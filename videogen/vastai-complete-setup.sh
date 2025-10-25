#!/bin/bash
# Complete Vast.ai Setup and Render Script
# This single script does EVERYTHING

set -e

REPO_URL="${1:-}"

echo "════════════════════════════════════════════════════════════════"
echo "🚀 Vast.ai GPU Video Rendering - Complete Setup"
echo "════════════════════════════════════════════════════════════════"

# System setup
echo ""
echo "📦 [1/7] Updating system..."
apt-get update -qq > /dev/null 2>&1

echo "📦 [2/7] Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1
apt-get install -y nodejs > /dev/null 2>&1

echo "📦 [3/7] Installing Chromium GPU dependencies..."
apt-get install -y \
    libglib2.0-0 libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libdrm2 libdbus-1-3 libxkbcommon0 libxcomposite1 \
    libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 \
    libcairo2 libasound2 libatspi2.0-0 libxshmfence1 \
    libgl1 libglu1-mesa mesa-utils xvfb git rsync > /dev/null 2>&1

echo "🔧 [4/7] Verifying GPU..."
if nvidia-smi > /dev/null 2>&1; then
    echo "✅ GPU found:"
    nvidia-smi --query-gpu=name,memory.total --format=csv,noheader
else
    echo "⚠️  GPU not detected, but continuing..."
fi

# Clone repo
echo ""
echo "📥 [5/7] Cloning repository..."
if [ -z "$REPO_URL" ]; then
    echo "❌ ERROR: Repository URL not provided!"
    echo ""
    echo "Usage: bash vastai-complete-setup.sh <YOUR_REPO_URL>"
    echo "Example: bash vastai-complete-setup.sh https://github.com/username/repo.git"
    exit 1
fi

cd /root
if [ -d "Projects /Quiz Channel 2.0" ]; then
    echo "⚠️  Repository already exists, pulling latest changes..."
    cd "Projects /Quiz Channel 2.0"
    git pull
else
    git clone "$REPO_URL" "Projects /Quiz Channel 2.0"
    cd "Projects /Quiz Channel 2.0"
fi

# Install dependencies
echo ""
echo "📦 [6/7] Installing npm dependencies..."
cd videogen
npm install --silent > /dev/null 2>&1

# Test render
echo ""
echo "🎬 [7/7] Running test render..."
echo "════════════════════════════════════════════════════════════════"
npm run render:master -- --one

# Check result
if [ $? -eq 0 ]; then
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo "✅ TEST PASSED! Setup complete and rendering works!"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "📊 Video created:"
    ls -lh out/*.mp4 | tail -1
    echo ""
    echo "🚀 Ready to render all videos!"
    echo ""
    echo "Next step: npm run render:master -- --all"
    echo ""
    echo "════════════════════════════════════════════════════════════════"
else
    echo ""
    echo "❌ Test render failed. Check the errors above."
    exit 1
fi

