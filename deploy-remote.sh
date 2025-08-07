#!/bin/bash

# Remote deployment script for decoded-app
# Usage: ./deploy-remote.sh

set -e

# Configuration
REMOTE_HOST="121.130.214.186"
REMOTE_PORT="2202"
REMOTE_USER="decoded"
REMOTE_DIR="/home/decoded/decoded-app"
LOCAL_DIR="."

echo "🚀 Starting remote deployment to $REMOTE_USER@$REMOTE_HOST:$REMOTE_PORT"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Build the application locally
echo "🔨 Building the application locally..."
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

# Create .env.production if it doesn't exist
if [ ! -f ".env.production" ]; then
    echo "📝 Creating .env.production file..."
    cat > $DEPLOY_DIR/.env.production << EOF
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://api.decoded.style
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://121.130.214.186:3000/auth/callback
PORT=3000
EOF
else
    cp .env.production $DEPLOY_DIR/
fi

# Create remote deployment script
cat > $DEPLOY_DIR/deploy-remote-setup.sh << 'EOF'
#!/bin/bash
set -e

echo "🔧 Setting up application on remote server..."

# Install dependencies
echo "📦 Installing dependencies..."
yarn install --frozen-lockfile

# Start the application
echo "🚀 Starting the application..."
yarn start
EOF

chmod +x $DEPLOY_DIR/deploy-remote-setup.sh

# Create PM2 ecosystem file for remote
cat > $DEPLOY_DIR/ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'decoded-app',
      script: 'yarn',
      args: 'start',
      cwd: '$REMOTE_DIR',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
EOF

# Create systemd service file
cat > $DEPLOY_DIR/decoded-app.service << EOF
[Unit]
Description=Decoded App
After=network.target

[Service]
Type=simple
User=decoded
WorkingDirectory=$REMOTE_DIR
ExecStart=/usr/bin/yarn start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

# Create deployment archive
echo "📦 Creating deployment archive..."
tar -czf decoded-app-deploy.tar.gz -C $DEPLOY_DIR .

# Upload to remote server
echo "📤 Uploading to remote server..."
scp -P $REMOTE_PORT decoded-app-deploy.tar.gz $REMOTE_USER@$REMOTE_HOST:/tmp/

# Execute remote deployment
echo "🔧 Executing remote deployment..."
ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST << 'EOF'
set -e

echo "🔧 Starting remote deployment process..."

# Create app directory if it doesn't exist
mkdir -p /home/decoded/decoded-app

# Stop existing application if running
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

# Start with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js
pm2 save

echo "✅ Deployment completed successfully!"
echo "🌐 Application should be available at: http://121.130.214.186:3000"
echo "📊 PM2 Status:"
pm2 status
EOF

# Cleanup local files
echo "🧹 Cleaning up local files..."
rm -rf $DEPLOY_DIR
rm decoded-app-deploy.tar.gz

echo "✅ Remote deployment completed successfully!"
echo "🌐 Your application should now be running at: http://121.130.214.186:3000"
