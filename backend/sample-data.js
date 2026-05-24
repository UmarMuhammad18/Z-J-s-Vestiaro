// sample-data.js - Sample Data for Testing
// Run this with: node sample-data.js (after setting up database)

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ws from 'ws';

dotenv.config();

// Use service role key to bypass Row Level Security for seeding
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { realtime: { transport: ws } }
);

const sampleCategories = [
  { name: 'Dresses', description: 'Elegant evening and casual dresses' },
  { name: 'Tops', description: 'Luxury blouses and tops' },
  { name: 'Bottoms', description: 'Skirts, trousers, and more' },
  { name: 'Accessories', description: 'Bags, scarves, and jewelry' },
  { name: 'Outerwear', description: 'Coats and jackets' }
];

const sampleProducts = [
  {
    name: 'Silk Evening Dress',
    description: 'Luxurious black silk evening dress with elegant draping',
    price: 450.00,
    sku: 'DRESS001',
    stock: 15
  },
  {
    name: 'Gold Sequined Gown',
    description: 'Stunning gold sequined gown perfect for special occasions',
    price: 680.00,
    sku: 'DRESS002',
    stock: 8
  },
  {
    name: 'Cashmere Sweater',
    description: 'Premium cashmere sweater in multiple colors',
    price: 320.00,
    sku: 'TOP001',
    stock: 20
  },
  {
    name: 'Designer Handbag',
    description: 'Handcrafted leather handbag with gold hardware',
    price: 850.00,
    sku: 'ACC001',
    stock: 5
  },
  {
    name: 'Wool Blend Coat',
    description: 'Classic wool blend coat with timeless design',
    price: 520.00,
    sku: 'OUT001',
    stock: 12
  },
  {
    name: 'Tailored Trousers',
    description: 'Professional tailored trousers in neutral tones',
    price: 280.00,
    sku: 'BOT001',
    stock: 25
  }
];

async function insertSampleData() {
  try {
    console.log('🚀 Starting to insert sample data...\n');

    // Insert categories
    console.log('📁 Inserting categories...');
    for (const category of sampleCategories) {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();
      
      if (error) {
        console.error(`❌ Error inserting category ${category.name}:`, error);
      } else {
        console.log(`✅ Inserted category: ${data.name}`);

        // Insert products for this category
        const categoryProducts = sampleProducts.slice(0, Math.ceil(sampleProducts.length / sampleCategories.length));
        for (const product of categoryProducts) {
          const { error: productError } = await supabase
            .from('products')
            .insert({ ...product, category_id: data.id });
          
          if (!productError) {
            console.log(`  ✅ Added product: ${product.name}`);
          }
        }
      }
    }

    console.log('\n✨ Sample data insertion complete!\n');
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
  }
}

insertSampleData();
