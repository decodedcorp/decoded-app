#!/bin/bash

# Simple remote deployment script
# Usage: ./deploy-simple.sh

set -e

echo "🚀 Starting simple remote deployment..."

# Build the application
echo "🔨 Building application..."
yarn build

# Create deployment package
echo "📦 Creating deployment package..."
tar -czf decoded-app-deploy.tar.gz .next public package.json yarn.lock next.config.ts tailwind.config.ts tsconfig.json src

# Upload to server
echo "📤 Uploading to server..."
scp -P 2202 decoded-app-deploy.tar.gz decoded@121.130.214.186:/tmp/

# Deploy on server
echo "🔧 Deploying on server..."
ssh -p 2202 decoded@121.130.214.186 << 'EOF'
set -e

echo "🔧 Starting deployment on server..."

# Create app directory
mkdir -p /home/decoded/decoded-app

# Stop existing app if running
if pm2 list | grep -q "decoded-app"; then
    echo "🛑 Stopping existing application..."
    pm2 stop decoded-app
    pm2 delete decoded-app
fi

# Extract deployment package
echo "📦 Extracting deployment package..."
cd /home/decoded/decoded-app
tar -xzf /tmp/decoded-app-deploy.tar.gz
rm /tmp/decoded-app-deploy.tar.gz

# Install dependencies
echo "📦 Installing dependencies..."
yarn install --frozen-lockfile

# Start application
echo "🚀 Starting application..."
yarn start &

echo "✅ Deployment completed!"
echo "🌐 Application should be available at: http://121.130.214.186:3000"
EOF

# Cleanup
echo "🧹 Cleaning up..."
rm decoded-app-deploy.tar.gz

echo "✅ Simple deployment completed!"
