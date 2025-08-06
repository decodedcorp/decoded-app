#!/bin/bash

# macOS Mini Development Server Deployment
# Usage: ./deploy-macos-dev.sh

set -e

echo "🚀 Starting macOS Mini development deployment..."

# Configuration for macOS server
REMOTE_HOST="121.130.214.186"
REMOTE_PORT="2202"
REMOTE_USER="decoded"
REMOTE_DIR="/Users/decoded/decoded-app"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Build the application
echo "🔨 Building the application..."
yarn build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully!"

# Create deployment package
echo "📦 Creating deployment package..."
DEPLOY_DIR="deploy-package"
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# Copy necessary files
cp -r .next $DEPLOY_DIR/
cp -r public $DEPLOY_DIR/
cp package.json $DEPLOY_DIR/
cp yarn.lock $DEPLOY_DIR/
cp next.config.ts $DEPLOY_DIR/
cp tailwind.config.ts $DEPLOY_DIR/
cp tsconfig.json $DEPLOY_DIR/
cp -r src $DEPLOY_DIR/

# Create development environment file
echo "📝 Creating development environment file..."
cat > $DEPLOY_DIR/.env.production << EOF
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=https://dev.decoded.style
API_BASE_URL=https://dev.decoded.style
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://121.130.214.186:3000/auth/callback
PORT=3000
EOF

# Create PM2 ecosystem file for macOS
cat > $DEPLOY_DIR/ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'decoded-app-dev',
      script: 'yarn',
      args: 'start',
      cwd: '$REMOTE_DIR',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        NEXT_PUBLIC_API_BASE_URL: 'https://dev.decoded.style',
        API_BASE_URL: 'https://dev.decoded.style'
      }
    }
  ]
};
EOF

# Create deployment archive
echo "📦 Creating deployment archive..."
tar -czf decoded-app-macos-dev.tar.gz -C $DEPLOY_DIR .

# Upload to macOS server
echo "📤 Uploading to macOS server..."
scp -P $REMOTE_PORT decoded-app-macos-dev.tar.gz $REMOTE_USER@$REMOTE_HOST:/tmp/

# Execute remote deployment
echo "🔧 Executing remote deployment on macOS..."
ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST << 'EOF'
set -e

echo "🔧 Starting macOS development deployment process..."

# Create app directory if it doesn't exist
mkdir -p /Users/decoded/decoded-app

# Stop existing application if running
if pm2 list | grep -q "decoded-app-dev"; then
    echo "🛑 Stopping existing development application..."
    pm2 stop decoded-app-dev
    pm2 delete decoded-app-dev
fi

# Extract deployment package
echo "📦 Extracting deployment package..."
cd /Users/decoded/decoded-app
tar -xzf /tmp/decoded-app-macos-dev.tar.gz
rm /tmp/decoded-app-macos-dev.tar.gz

# Install dependencies
echo "📦 Installing dependencies..."
yarn install --frozen-lockfile

# Start with PM2
echo "🚀 Starting development application with PM2..."
pm2 start ecosystem.config.js
pm2 save

echo "✅ macOS development deployment completed successfully!"
echo "🌐 Development application should be available at: http://121.130.214.186:3000"
echo "🔗 Using development API: https://dev.decoded.style"
echo "📊 PM2 Status:"
pm2 status
EOF

# Cleanup local files
echo "🧹 Cleaning up local files..."
rm -rf $DEPLOY_DIR
rm decoded-app-macos-dev.tar.gz

echo "✅ macOS development deployment completed successfully!"
echo "🌐 Your development application should now be running at: http://121.130.214.186:3000"
echo "🔗 API Base URL: https://dev.decoded.style"
