#!/bin/bash

# Automated Rendering and Download Script for Vast.ai
# This script renders videos on Vast.ai and automatically downloads them to your local machine

set -e  # Exit on error

# Configuration - UPDATE THESE VALUES
LOCAL_MACHINE_IP="YOUR_LOCAL_IP_HERE"  # Your local machine's public IP or hostname
LOCAL_MACHINE_USER="YOUR_USERNAME_HERE"  # Your local machine's username
LOCAL_DOWNLOAD_PATH="$HOME/Desktop/rendered-videos"  # Where to download videos on your local machine
SSH_PORT="22"  # SSH port on your local machine (usually 22)

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================="
echo "🎬 Vast.ai Automated Render & Download"
echo -e "==========================================${NC}"

# Check if this is a test run
TEST_MODE=false
if [ "$1" == "--test" ]; then
    TEST_MODE=true
    echo -e "${YELLOW}🧪 Running in TEST mode (one video only)${NC}"
    echo ""
fi

# Get the output directory
OUTPUT_DIR="$(pwd)/out"
mkdir -p "$OUTPUT_DIR"

# Count videos before rendering
VIDEOS_BEFORE=$(find "$OUTPUT_DIR" -name "*.mp4" 2>/dev/null | wc -l)

echo ""
echo -e "${GREEN}📊 Pre-render status:${NC}"
echo "   Output directory: $OUTPUT_DIR"
echo "   Existing videos: $VIDEOS_BEFORE"
echo ""

# Start rendering
echo -e "${GREEN}🎬 Starting render process...${NC}"
echo ""

if [ "$TEST_MODE" = true ]; then
    # Test mode - render one video
    npm run render:master -- --one
else
    # Production mode - render all videos
    npm run render:master -- --all
fi

RENDER_EXIT_CODE=$?

if [ $RENDER_EXIT_CODE -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ Rendering failed with exit code $RENDER_EXIT_CODE${NC}"
    exit $RENDER_EXIT_CODE
fi

# Count videos after rendering
VIDEOS_AFTER=$(find "$OUTPUT_DIR" -name "*.mp4" 2>/dev/null | wc -l)
NEW_VIDEOS=$((VIDEOS_AFTER - VIDEOS_BEFORE))

echo ""
echo -e "${GREEN}=========================================="
echo "✅ Rendering completed successfully!"
echo -e "==========================================${NC}"
echo "   Videos before: $VIDEOS_BEFORE"
echo "   Videos after: $VIDEOS_AFTER"
echo "   New videos: $NEW_VIDEOS"
echo ""

# Download videos to local machine
if [ "$NEW_VIDEOS" -gt 0 ]; then
    echo -e "${BLUE}📥 Downloading videos to local machine...${NC}"
    echo ""
    
    # Create local download directory if it doesn't exist
    ssh -p "$SSH_PORT" "$LOCAL_MACHINE_USER@$LOCAL_MACHINE_IP" "mkdir -p '$LOCAL_DOWNLOAD_PATH'"
    
    # Use rsync to efficiently transfer only new/changed files
    rsync -avz --progress -e "ssh -p $SSH_PORT" \
        "$OUTPUT_DIR/" \
        "$LOCAL_MACHINE_USER@$LOCAL_MACHINE_IP:$LOCAL_DOWNLOAD_PATH/"
    
    DOWNLOAD_EXIT_CODE=$?
    
    if [ $DOWNLOAD_EXIT_CODE -eq 0 ]; then
        echo ""
        echo -e "${GREEN}=========================================="
        echo "✅ Download completed successfully!"
        echo -e "==========================================${NC}"
        echo "   Downloaded to: $LOCAL_DOWNLOAD_PATH"
        echo ""
    else
        echo ""
        echo -e "${YELLOW}⚠️  Download failed. You can manually download using:${NC}"
        echo "   rsync -avz --progress -e 'ssh -p $SSH_PORT' \\"
        echo "       vast-instance:$OUTPUT_DIR/ \\"
        echo "       $LOCAL_DOWNLOAD_PATH/"
        echo ""
    fi
else
    echo -e "${YELLOW}ℹ️  No new videos to download${NC}"
    echo ""
fi

echo -e "${GREEN}🎉 Process complete!${NC}"

