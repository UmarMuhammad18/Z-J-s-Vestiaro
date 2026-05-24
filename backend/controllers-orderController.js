// controllers/orderController.js - Order Management Controller
import supabase from './config-database.js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { validateOrderData } from './utils-validators.js';
import { createPaymentIntent } from './utils-stripe.js';

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { items, shippingAddress, email, phone } = req.body;

    const errors = validateOrderData({ user_id: userId, items, shipping_address: shippingAddress });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, error: errors });
    }

    // Get product details and calculate total
    let orderTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('id, price, stock')
        .eq('id', item.product_id)
        .single();

      if (!product) {
        return res.status(404).json({ success: false, error: `Product ${item.product_id} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, error: `Insufficient stock for ${item.product_id}` });
      }

      orderTotal += product.price * item.quantity;
      orderItems.push({ product_id: item.product_id, quantity: item.quantity, price: product.price });
    }

    // Create order
    const orderId = uuidv4();
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        user_id: userId,
        status: 'pending',
        total_amount: orderTotal,
        shipping_address: shippingAddress,
        email,
        phone,
        created_at: new Date()
      })
      .select()
      .single();

    if (error) throw error;

    // Add order items
    for (const item of orderItems) {
      await supabase.from('order_items').insert({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.price
      });
    }

    // Create Stripe payment intent
    const paymentIntent = await createPaymentIntent(orderTotal, 'usd', { orderId });

    res.status(201).json({
      success: true,
      data: {
        order: { ...order, total_amount: orderTotal },
        paymentIntent: { clientSecret: paymentIntent.client_secret }
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, error: 'Failed to create order' });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from('orders')
      .select('*, items:order_items(*)', { count: 'exact' })
      .eq('user_id', userId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: orders, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) throw error;

    res.json({
      success: true,
      data: {
        orders,
        pagination: { page: parseInt(page), limit: parseInt(limit), total: count }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

    const { data: order, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*, product:products(*))')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();

    if (error || !order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch order' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date() })
      .eq('id', orderId)
      .select()
      .single();

    if (error || !order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ success: false, error: 'Failed to update order' });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ success: false, error: 'Cannot cancel order in current status' });
    }

    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update({ status: 'cancelled', updated_at: new Date() })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ success: false, error: 'Failed to cancel order' });
  }
};
