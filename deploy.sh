#!/bin/bash

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

# Build the application
echo "🔨 Building the application..."
yarn build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    
    # Start the application
    echo "🚀 Starting the application..."
    yarn start
else
    echo "❌ Build failed!"
    exit 1
fi
