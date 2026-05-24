// controllers/paymentController.js - Payment Processing Controller
import supabase from './config-database.js';
import { confirmPaymentIntent, createRefund, verifyWebhookSignature } from './utils-stripe.js';

export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    const paymentIntent = await confirmPaymentIntent(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update order status
      await supabase
        .from('orders')
        .update({ 
          status: 'confirmed',
          payment_status: 'paid',
          updated_at: new Date()
        })
        .eq('id', orderId);

      // Update inventory
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      for (const item of orderItems) {
        await supabase.rpc('decrement_inventory', {
          product_id: item.product_id,
          quantity: item.quantity
        });
      }

      res.json({ 
        success: true, 
        message: 'Payment confirmed',
        data: { orderId, status: 'paid' }
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: `Payment status: ${paymentIntent.status}` 
      });
    }
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ success: false, error: 'Failed to confirm payment' });
  }
};

export const refundPayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (order.payment_status !== 'paid') {
      return res.status(400).json({ success: false, error: 'Order not paid' });
    }

    // Create refund through Stripe (requires payment_intent_id in order)
    // For now, just update order status
    const refundAmount = amount || order.total_amount;

    const refund = await createRefund(order.stripe_payment_intent_id, refundAmount);

    if (refund.status === 'succeeded') {
      await supabase
        .from('orders')
        .update({ 
          payment_status: 'refunded',
          updated_at: new Date()
        })
        .eq('id', orderId);

      res.json({ success: true, message: 'Refund processed', data: refund });
    } else {
      throw new Error('Refund failed');
    }
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ success: false, error: 'Failed to process refund' });
  }
};

export const handleStripeWebhook = async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    const event = verifyWebhookSignature(req.body, signature);

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const { orderId } = paymentIntent.metadata;
        
        await supabase
          .from('orders')
          .update({ 
            status: 'confirmed',
            payment_status: 'paid',
            stripe_payment_intent_id: paymentIntent.id,
            updated_at: new Date()
          })
          .eq('id', orderId);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        const { orderId: failedOrderId } = failedPayment.metadata;
        
        await supabase
          .from('orders')
          .update({ 
            payment_status: 'failed',
            updated_at: new Date()
          })
          .eq('id', failedOrderId);
        break;
    }

    res.json({ success: true, received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ success: false, error: 'Webhook processing failed' });
  }
};
