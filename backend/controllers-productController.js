// controllers/productController.js - Product Management Controller
import supabase from '../config-database.js';
import { validateProductData } from '../utils-validators.js';

export const getCategories = async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;

    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20, sort = 'created_at' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase.from('products').select('*', { count: 'exact' });

    if (category) {
      query = query.eq('category_id', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: products, count, error } = await query
      .order(sort, { ascending: sort !== 'price' })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) throw error;

    res.json({
      success: true,
      data: {
        products,
        pagination: { page: parseInt(page), limit: parseInt(limit), total: count }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabase
      .from('products')
      .select('*, category:categories(*), variants(*), reviews(*)')
      .eq('id', id)
      .single();

    if (error || !product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category_id, sku, images, stock } = req.body;

    const errors = validateProductData({ name, price, category_id });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, error: errors });
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name,
        description,
        price: parseFloat(price),
        category_id,
        sku,
        images: images || [],
        stock: stock || 0,
        created_at: new Date()
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data: product, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error || !product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
};
