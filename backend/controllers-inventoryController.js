// controllers/inventoryController.js - Inventory Management Controller
import supabase from './config-database.js';

export const getInventory = async (req, res) => {
  try {
    const { productId } = req.params;

    const { data: inventory, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('product_id', productId)
      .single();

    if (error || !inventory) {
      return res.status(404).json({ success: false, error: 'Inventory not found' });
    }

    res.json({ success: true, data: inventory });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch inventory' });
  }
};

export const checkStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ success: false, error: 'Product ID and quantity required' });
    }

    const { data: product } = await supabase
      .from('products')
      .select('stock')
      .eq('id', productId)
      .single();

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const inStock = product.stock >= parseInt(quantity);

    res.json({
      success: true,
      data: {
        productId,
        requestedQuantity: quantity,
        availableStock: product.stock,
        inStock
      }
    });
  } catch (error) {
    console.error('Check stock error:', error);
    res.status(500).json({ success: false, error: 'Failed to check stock' });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, operation } = req.body;

    if (!['add', 'subtract', 'set'].includes(operation)) {
      return res.status(400).json({ success: false, error: 'Invalid operation' });
    }

    let newQuantity = quantity;

    if (operation !== 'set') {
      const { data: product } = await supabase
        .from('products')
        .select('stock')
        .eq('id', productId)
        .single();

      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      newQuantity = operation === 'add' 
        ? product.stock + quantity 
        : Math.max(0, product.stock - quantity);
    }

    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update({ stock: newQuantity, updated_at: new Date() })
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;

    res.json({ 
      success: true, 
      data: { productId, newStock: newQuantity, product: updatedProduct }
    });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ success: false, error: 'Failed to update inventory' });
  }
};

export const getLowStockProducts = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;

    const { data: lowStockProducts, error } = await supabase
      .from('products')
      .select('*')
      .lt('stock', parseInt(threshold))
      .order('stock');

    if (error) throw error;

    res.json({ 
      success: true, 
      data: { threshold: parseInt(threshold), products: lowStockProducts }
    });
  } catch (error) {
    console.error('Get low stock error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch low stock products' });
  }
};
