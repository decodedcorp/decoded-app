#!/bin/bash

# Remote server setup script
# This script sets up the remote server with necessary dependencies

set -e

REMOTE_HOST="121.130.214.186"
REMOTE_PORT="2202"
REMOTE_USER="decoded"

echo "🔧 Setting up remote server environment..."

# Connect to remote server and setup
ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST << 'EOF'
set -e

echo "🔧 Updating system packages..."
sudo apt update

echo "📦 Installing Node.js and npm..."
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "📦 Installing Yarn..."
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install yarn

echo "📦 Installing PM2 globally..."
sudo npm install -g pm2

echo "📦 Installing nginx..."
sudo apt install -y nginx

echo "🔧 Creating application directory..."
mkdir -p /home/decoded/decoded-app

echo "🔧 Setting up nginx configuration..."
sudo tee /etc/nginx/sites-available/decoded-app << 'NGINX_EOF'
server {
    listen 80;
    server_name 121.130.214.186;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX_EOF

echo "🔧 Enabling nginx site..."
sudo ln -sf /etc/nginx/sites-available/decoded-app /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

echo "🔧 Testing nginx configuration..."
sudo nginx -t

echo "🔧 Starting nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

echo "🔧 Setting up firewall..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

echo "✅ Remote server setup completed!"
echo "📊 Node.js version: $(node --version)"
echo "📊 Yarn version: $(yarn --version)"
echo "📊 PM2 version: $(pm2 --version)"
EOF

echo "✅ Remote server setup completed successfully!"
