# Decoded App Deployment Guide

## Overview

This document provides comprehensive instructions for deploying the Decoded App to various environments including local development, remote servers, and production environments.

## Table of Contents

- [Local Development](#local-development)
- [Remote Server Deployment](#remote-server-deployment)
- [macOS Mini Development Server](#macos-mini-development-server)
- [Production Deployment](#production-deployment)
- [Environment Configuration](#environment-configuration)
- [Monitoring and Maintenance](#monitoring-and-maintenance)

## Local Development

### Prerequisites

- Node.js 18.x or higher
- Yarn package manager
- Git

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd decoded-app

# Install dependencies
yarn install

# Start development server
yarn dev
```

### Build for Production

```bash
# Build the application
yarn build

# Start production server
yarn start
```

## Remote Server Deployment

### Prerequisites

- SSH access to remote server
- Node.js 18.x or higher on remote server
- Yarn or npm on remote server

### Quick Deployment

```bash
# Build locally
yarn build

# Create deployment package
tar -czf decoded-app-deploy.tar.gz .next public package.json yarn.lock next.config.ts tailwind.config.ts tsconfig.json src

# Upload to server
scp -P 2202 decoded-app-deploy.tar.gz decoded@121.130.214.186:/tmp/

# Deploy on server
ssh -p 2202 decoded@121.130.214.186 << 'EOF'
cd /Users/decoded/decoded-app
tar -xzf /tmp/decoded-app-deploy.tar.gz
rm /tmp/decoded-app-deploy.tar.gz
yarn install --production
yarn start
EOF
```

## macOS Mini Development Server

### Prerequisites

- SSH access to macOS Mini server
- NVM (Node Version Manager) installed on server

### Initial Setup (First Time Only)

```bash
# Install NVM if not already installed
ssh decoded@121.130.214.186 -p 2202 "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"

# Install Node.js 18
ssh decoded@121.130.214.186 -p 2202 "export NVM_DIR=\"\$HOME/.nvm\" && [ -s \"\$NVM_DIR/nvm.sh\" ] && \. \"\$NVM_DIR/nvm.sh\" && nvm install 18 && nvm use 18"
```

### Development Deployment

```bash
# Build locally
yarn build

# Create deployment package
tar -czf decoded-app-dev.tar.gz .next public package.json yarn.lock next.config.ts tailwind.config.ts tsconfig.json src

# Upload to macOS Mini
scp -P 2202 decoded-app-dev.tar.gz decoded@121.130.214.186:/tmp/

# Deploy on macOS Mini
ssh decoded@121.130.214.186 -p 2202 "export NVM_DIR=\"\$HOME/.nvm\" && [ -s \"\$NVM_DIR/nvm.sh\" ] && \. \"\$NVM_DIR/nvm.sh\" && cd /Users/decoded/decoded-app && tar -xzf /tmp/decoded-app-dev.tar.gz && rm /tmp/decoded-app-dev.tar.gz && npm install --production && npx next start -p 3000"
```

### Access Development Server

- **URL**: `http://121.130.214.186:3000`
- **API Base**: `https://dev.decoded.style`

### Environment Variables for Development

```bash
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=https://dev.decoded.style
API_BASE_URL=https://dev.decoded.style
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://121.130.214.186:3000/auth/callback
PORT=3000
```

## Production Deployment

### Prerequisites

- Production server with Node.js 18.x
- PM2 for process management
- Nginx for reverse proxy (optional)

### Deployment Steps

1. **Build the application**

   ```bash
   yarn build
   ```

2. **Create deployment package**

   ```bash
   tar -czf decoded-app-prod.tar.gz .next public package.json yarn.lock next.config.ts tailwind.config.ts tsconfig.json src
   ```

3. **Upload to production server**

   ```bash
   scp decoded-app-prod.tar.gz user@production-server:/tmp/
   ```

4. **Deploy on production server**
   ```bash
   ssh user@production-server << 'EOF'
   cd /var/www/decoded-app
   tar -xzf /tmp/decoded-app-prod.tar.gz
   rm /tmp/decoded-app-prod.tar.gz
   yarn install --production
   pm2 start ecosystem.config.js
   EOF
   ```

## Environment Configuration

### Development Environment

- **API Base URL**: `https://dev.decoded.style`
- **Google OAuth Redirect**: `https://121.130.214.186:3000/auth/callback`
- **Node Environment**: `development`

### Production Environment

- **API Base URL**: `https://api.decoded.style`
- **Google OAuth Redirect**: `https://decoded.style/auth/callback`
- **Node Environment**: `production`

### Environment Variables

```bash
# Required
NODE_ENV=development|production
NEXT_PUBLIC_API_BASE_URL=https://dev.decoded.style|https://api.decoded.style
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=your_redirect_uri

# Optional
PORT=3000
API_BASE_URL=https://dev.decoded.style|https://api.decoded.style
```

## Monitoring and Maintenance

### Process Management with PM2

```bash
# Start application
pm2 start ecosystem.config.js

# Monitor processes
pm2 status
pm2 logs decoded-app

# Restart application
pm2 restart decoded-app

# Stop application
pm2 stop decoded-app
```

### Logs and Debugging

```bash
# View application logs
pm2 logs decoded-app

# View error logs
pm2 logs decoded-app --err

# Monitor system resources
pm2 monit
```

### Health Checks

```bash
# Check if application is running
curl http://localhost:3000/api/health

# Check API connectivity
curl https://dev.decoded.style/health
```

## Troubleshooting

### Common Issues

1. **Port already in use**

   ```bash
   lsof -i :3000
   kill -9 <PID>
   ```

2. **Build errors**

   ```bash
   # Clear Next.js cache
   rm -rf .next
   yarn build
   ```

3. **Dependency issues**

   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules yarn.lock
   yarn install
   ```

4. **Environment variable issues**
   ```bash
   # Check environment variables
   echo $NODE_ENV
   echo $NEXT_PUBLIC_API_BASE_URL
   ```

### Support

For deployment issues, check:

1. Node.js version compatibility
2. Environment variable configuration
3. Network connectivity to API servers
4. Firewall settings on server

---

**Last Updated**: $(date)
**Version**: 1.0.0
