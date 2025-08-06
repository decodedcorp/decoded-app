#!/bin/bash

# macOS Mini Server Setup Script
# This script sets up the macOS server with necessary dependencies

set -e

REMOTE_HOST="121.130.214.186"
REMOTE_PORT="2202"
REMOTE_USER="decoded"

echo "🔧 Setting up macOS Mini server environment..."

# Connect to macOS server and setup
ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST << 'EOF'
set -e

echo "🔧 Checking macOS version..."
sw_vers

echo "📦 Checking if Homebrew is installed..."
if ! command -v brew &> /dev/null; then
    echo "📦 Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo "✅ Homebrew is already installed"
fi

echo "📦 Installing Node.js..."
if ! command -v node &> /dev/null; then
    brew install node@18
    echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
    source ~/.zshrc
else
    echo "✅ Node.js is already installed: $(node --version)"
fi

echo "📦 Installing Yarn..."
if ! command -v yarn &> /dev/null; then
    npm install -g yarn
else
    echo "✅ Yarn is already installed: $(yarn --version)"
fi

echo "📦 Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
else
    echo "✅ PM2 is already installed: $(pm2 --version)"
fi

echo "🔧 Creating application directory..."
mkdir -p /Users/decoded/decoded-app

echo "🔧 Setting up PM2 startup..."
pm2 startup

echo "✅ macOS server setup completed!"
echo "📊 Node.js version: $(node --version)"
echo "📊 Yarn version: $(yarn --version)"
echo "📊 PM2 version: $(pm2 --version)"
EOF

echo "✅ macOS server setup completed successfully!"
