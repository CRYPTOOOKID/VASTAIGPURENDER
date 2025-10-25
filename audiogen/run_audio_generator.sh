#!/bin/bash
# Audio Generator Runner Script
# This script activates the virtual environment and runs the audio generator

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🚀 Starting Audio Generator..."
echo "📁 Working directory: $SCRIPT_DIR"

# Activate virtual environment
if [ -d "$PROJECT_DIR/venv" ]; then
    echo "✅ Activating virtual environment..."
    source "$PROJECT_DIR/venv/bin/activate"
else
    echo "⚠️  Virtual environment not found at $PROJECT_DIR/venv"
    echo "   Using system Python..."
fi

# Run the audio generator
cd "$SCRIPT_DIR"
python audio_generator.py

# Deactivate virtual environment
deactivate 2>/dev/null

echo ""
echo "👋 Audio generator finished!"

