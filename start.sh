#!/bin/bash
# Quick start script for Waste Collection Management app

echo "🚀 Starting Waste Collection Management System..."
echo ""

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing dependencies..."
    cd frontend
    npm install
    cd ..
fi

echo "✅ Starting development server..."
echo ""
echo "🌐 Open your browser and go to: http://localhost:3000"
echo "📝 Test credentials: Any email (e.g., user@test.com) + any password"
echo ""

cd frontend
npm run dev
