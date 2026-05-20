#!/bin/bash

# install-and-setup.sh - Setup script for Z&J's Vestiaro Backend

echo "╔════════════════════════════════════════╗"
echo "║  Z&J's Vestiaro Backend Setup          ║"
echo "╚════════════════════════════════════════╝"

# Check if .env exists
if [ ! -f .env ]; then
  echo "📋 Creating .env file from .env.example..."
  cp .env.example .env
  echo "✅ .env created. Please update with your credentials."
else
  echo "✅ .env file already exists"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if database schema needs to be created
echo ""
echo "📊 Database setup:"
echo "1. Go to your Supabase dashboard"
echo "2. Open SQL Editor"
echo "3. Copy contents from database-schema.sql"
echo "4. Execute the SQL to create tables"

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your Supabase and Stripe credentials"
echo "2. Run: npm run dev (for development)"
echo "3. Run: node sample-data.js (to add sample products)"
echo ""
echo "Server will run on: http://localhost:5000"
