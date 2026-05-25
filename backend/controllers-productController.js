// controllers/productController.js - Product Management Controller
import supabase from './config-database.js';
import validator from 'validator';
import { validateProductData } from './utils-validators.js';

const CATEGORY_RELATION = '*, category:categories(name)';

const resolveCategoryId = async (category_id, category_name) => {
  if (category_id) return category_id;
  if (!category_name) return null;

  const { data: existingCategory, error: queryError } = await supabase
    .from('categories')
    .select('id')
    .eq('name', category_name)
    .single();

  if (queryError && queryError.code !== 'PGRST116') {
    throw queryError;
  }

  if (existingCategory) return existingCategory.id;

  const { data: newCategory, error: insertError } = await supabase
    .from('categories')
    .insert({ name: category_name, created_at: new Date() })
    .select()
    .single();

  if (insertError) throw insertError;
  return newCategory.id;
};

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

    let query = supabase.from('products').select(CATEGORY_RELATION, { count: 'exact' });

    if (category) {
      if (validator.isUUID(category)) {
        query = query.eq('category_id', category);
      } else {
        query = query.eq('category.name', category);
      }
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
      .select('*, category:categories(name), variants(*), reviews(*)')
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
    const { name, description, price, category_id, category, sku, images, stock } = req.body;
    const resolvedCategoryId = await resolveCategoryId(category_id, category);

    const errors = validateProductData({ name, price, category_id: resolvedCategoryId });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, error: errors });
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name,
        description,
        price: parseFloat(price),
        category_id: resolvedCategoryId,
        sku,
        images: images || [],
        stock: stock || 0,
        created_at: new Date()
      })
      .select(CATEGORY_RELATION)
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
    const updates = { ...req.body };

    if (updates.category || updates.category_id) {
      updates.category_id = await resolveCategoryId(updates.category_id, updates.category);
      delete updates.category;
    }

    const { data: product, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .select(CATEGORY_RELATION)
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
