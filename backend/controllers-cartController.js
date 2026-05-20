// controllers/cartController.js - Shopping Cart Controller
import supabase from '../config-database.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: cart, error } = await supabase
      .from('carts')
      .select('*, items:cart_items(*, product:products(*))')
      .eq('user_id', userId)
      .single();

    if (error || !cart) {
      return res.json({ success: true, data: { items: [], total: 0 } });
    }

    const total = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    res.json({ success: true, data: { items: cart.items, total, cartId: cart.id } });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch cart' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity, variant } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ success: false, error: 'Invalid product or quantity' });
    }

    // Get or create cart
    let { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!cart) {
      const { data: newCart } = await supabase
        .from('carts')
        .insert({ user_id: userId, created_at: new Date() })
        .select()
        .single();
      cart = newCart;
    }

    // Check if item already in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      // Update quantity
      await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + parseInt(quantity) })
        .eq('id', existingItem.id);
    } else {
      // Add new item
      await supabase
        .from('cart_items')
        .insert({
          cart_id: cart.id,
          product_id: productId,
          quantity: parseInt(quantity),
          variant: variant || {},
          added_at: new Date()
        });
    }

    res.json({ success: true, message: 'Added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to add to cart' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;

    res.json({ success: true, message: 'Removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to remove from cart' });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, error: 'Invalid quantity' });
    }

    const { data: item, error } = await supabase
      .from('cart_items')
      .update({ quantity: parseInt(quantity) })
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data: item });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to update cart' });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (cart) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cart.id);
    }

    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to clear cart' });
  }
};
