#!/bin/bash

# Quick Setup Script for Vast.ai GPU Instance
# Copy this entire script and run it on your Vast.ai instance

set -e  # Exit on error

echo "=========================================="
echo "🚀 Vast.ai Quick Setup for Video Rendering"
echo "=========================================="
echo ""

# Update system
echo "📦 Updating system packages..."
apt-get update -qq

# Install Node.js 20
echo ""
echo "📦 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1
apt-get install -y nodejs > /dev/null 2>&1

# Verify Node.js installation
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
echo "✅ Node.js $NODE_VERSION installed"
echo "✅ npm $NPM_VERSION installed"

# Install Chromium dependencies
echo ""
echo "📦 Installing Chromium GPU dependencies..."
apt-get install -y \
    libglib2.0-0 libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libdrm2 libdbus-1-3 libxkbcommon0 libxcomposite1 \
    libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 \
    libcairo2 libasound2 libatspi2.0-0 libxshmfence1 \
    libgl1 libglu1-mesa mesa-utils xvfb git rsync > /dev/null 2>&1

echo "✅ Dependencies installed"

# Check GPU
echo ""
echo "🔧 Checking GPU status..."
if command -v nvidia-smi &> /dev/null; then
    echo "✅ NVIDIA drivers found"
    nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader
else
    echo "⚠️  NVIDIA drivers not found. Installing..."
    apt-get install -y nvidia-driver-535 > /dev/null 2>&1
    echo "⚠️  Please reboot the instance after installation"
fi

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Clone your repository:"
echo "   git clone <YOUR_REPO_URL>"
echo ""
echo "2. Navigate to videogen:"
echo "   cd 'Projects /Quiz Channel 2.0/videogen'"
echo ""
echo "3. Install dependencies:"
echo "   npm install"
echo ""
echo "4. Test render:"
echo "   npm run render:master -- --one"
echo ""
echo "5. If test passes, render all:"
echo "   npm run render:master -- --all"
echo ""
echo "=========================================="

