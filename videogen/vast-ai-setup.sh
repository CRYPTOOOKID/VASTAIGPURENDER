#!/bin/bash

# Vast.ai GPU Instance Setup Script for Video Rendering
# This script sets up your Vast.ai instance for GPU-accelerated Remotion rendering

set -e  # Exit on error

echo "=========================================="
echo "🚀 Vast.ai GPU Instance Setup"
echo "=========================================="

# Update system packages
echo ""
echo "📦 Updating system packages..."
sudo apt-get update

# Install Node.js and npm (if not already installed)
echo ""
echo "📦 Installing Node.js and npm..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install essential dependencies for Chromium GPU rendering
echo ""
echo "📦 Installing Chromium dependencies and GPU libraries..."
sudo apt-get install -y \
    libglib2.0-0 \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    libatspi2.0-0 \
    libxshmfence1 \
    libgl1 \
    libglu1-mesa \
    mesa-utils \
    xvfb

# Install CUDA drivers if not present
echo ""
echo "🔧 Checking CUDA installation..."
if ! command -v nvidia-smi &> /dev/null; then
    echo "⚠️  NVIDIA drivers not found. Installing..."
    sudo apt-get install -y nvidia-driver-535
else
    echo "✅ NVIDIA drivers already installed"
    nvidia-smi
fi

# Install git if not present
echo ""
echo "📦 Installing git..."
sudo apt-get install -y git

# Install rsync for efficient file transfers
echo ""
echo "📦 Installing rsync..."
sudo apt-get install -y rsync

echo ""
echo "✅ System setup complete!"
echo ""
echo "=========================================="
echo "📋 Next Steps:"
echo "=========================================="
echo "1. Clone your repository: git clone <repo-url>"
echo "2. Navigate to videogen directory: cd videogen"
echo "3. Install dependencies: npm install"
echo "4. Run test render: npm run render:master -- --one"
echo "=========================================="

