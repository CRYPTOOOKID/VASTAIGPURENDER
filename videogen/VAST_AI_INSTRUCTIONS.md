# Vast.ai GPU Instance Setup Instructions

## Instance Specs
- GPU: 31.8 GB VRAM (Max CUDA 13.0, 107.6 TFLOPS)
- CPU: AMD EPYC 7642 48-Core (24/192 cores allocated)
- RAM: 129 GB
- Storage: WD_BLACK SN850X 4TB SSD
- Network: Up to 7441 Mbps

## Quick Start Guide

### 1. Connect to Your Vast.ai Instance

```bash
# SSH into your instance (replace with your actual SSH command from Vast.ai)
ssh -p <PORT> root@<INSTANCE_IP>
```

### 2. Run Initial Setup (One-time)

```bash
# Download and run the setup script
wget https://raw.githubusercontent.com/<your-repo>/vast-ai-setup.sh
chmod +x vast-ai-setup.sh
./vast-ai-setup.sh
```

**OR** manually run these commands:

```bash
# Update packages
sudo apt-get update

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install required libraries for Chromium GPU rendering
sudo apt-get install -y \
    libglib2.0-0 libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libdrm2 libdbus-1-3 libxkbcommon0 libxcomposite1 \
    libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 \
    libcairo2 libasound2 libatspi2.0-0 libxshmfence1 \
    libgl1 libglu1-mesa mesa-utils xvfb git rsync

# Verify NVIDIA drivers
nvidia-smi
```

### 3. Clone Your Project

```bash
# Clone the repository
git clone <YOUR_REPO_URL>
cd "Projects /Quiz Channel 2.0/videogen"

# Install dependencies
npm install
```

### 4. Configure GPU Rendering

The `remotion.config.ts` has been updated with GPU acceleration flags. No additional configuration needed!

### 5. Test Rendering (IMPORTANT - Do This First!)

```bash
# Test with ONE video first
npm run render:master -- --one
```

This will:
- Render a single random quiz video
- Use GPU acceleration
- Save to the `out/` directory
- Take ~30-60 seconds per video

**Check the output:**
```bash
# Verify the video was created
ls -lh out/*.mp4

# Check video info
ffmpeg -i out/<video-name>.mp4
```

### 6. Render All Videos

Once the test passes, render everything:

```bash
# Reset any stuck videos first (optional)
npm run render:master -- --reset

# Start rendering all videos
npm run render:master -- --all
```

This will:
- Render 2 videos in parallel (optimal for your 24-core setup)
- Each video uses 50% CPU (total 100% utilization)
- GPU acceleration for all renders
- Save all videos to `out/` directory

**Expected Performance:**
- ~30-60 seconds per video with GPU
- 2 parallel renders = ~15-30 videos per hour
- 430 total videos = ~14-28 hours total

## Downloading Rendered Videos

### Option 1: Manual Download with rsync (Recommended)

From your **local machine**:

```bash
# Create download directory
mkdir -p ~/Desktop/rendered-videos

# Download all videos (one-time)
rsync -avz --progress -e "ssh -p <VAST_PORT>" \
    root@<VAST_IP>:"/root/Projects /Quiz Channel 2.0/videogen/out/" \
    ~/Desktop/rendered-videos/

# Or download incrementally (only new files)
rsync -avz --progress --update -e "ssh -p <VAST_PORT>" \
    root@<VAST_IP>:"/root/Projects /Quiz Channel 2.0/videogen/out/" \
    ~/Desktop/rendered-videos/
```

### Option 2: Using the Automated Script

```bash
# On Vast.ai instance
cd "Projects /Quiz Channel 2.0/videogen"

# Edit the script to add your local machine info
nano render-with-download.sh
# Update: LOCAL_MACHINE_IP, LOCAL_MACHINE_USER, LOCAL_DOWNLOAD_PATH

# Make executable
chmod +x render-with-download.sh

# Run test with auto-download
./render-with-download.sh --test

# Run full render with auto-download
./render-with-download.sh
```

### Option 3: Download via Vast.ai File Manager

1. Go to your Vast.ai instance dashboard
2. Click "Files" tab
3. Navigate to `/root/Projects /Quiz Channel 2.0/videogen/out/`
4. Select and download videos

### Option 4: Setup Periodic Downloads (While Rendering)

From your **local machine**, create a cron job or run this loop:

```bash
# Download every 30 minutes while rendering
while true; do
    rsync -avz --progress --update -e "ssh -p <VAST_PORT>" \
        root@<VAST_IP>:"/root/Projects /Quiz Channel 2.0/videogen/out/" \
        ~/Desktop/rendered-videos/
    echo "✅ Sync complete. Waiting 30 minutes..."
    sleep 1800  # 30 minutes
done
```

## Monitoring Progress

### Check Rendering Progress

```bash
# Show summary
npm run render:master -- --summary

# Watch GPU usage
watch -n 1 nvidia-smi

# Monitor CPU usage
htop

# Check disk space
df -h

# Check network usage
iftop  # or: sudo apt-get install iftop && sudo iftop
```

### Check Output

```bash
# Count rendered videos
ls out/*.mp4 | wc -l

# Total size of rendered videos
du -sh out/

# Show recent renders
ls -lt out/*.mp4 | head -10
```

## GPU Optimization Flags Explained

The following flags have been added to `remotion.config.ts`:

- `--enable-gpu`: Enables GPU acceleration in Chromium
- `--use-gl=angle`: Use ANGLE (Almost Native Graphics Layer Engine) for better GPU support
- `--enable-gpu-rasterization`: Use GPU for rasterization instead of CPU
- `--ignore-gpu-blocklist`: Override GPU blocklist (safe in controlled environment)
- `--disable-software-rasterizer`: Prevent fallback to CPU rendering
- `--no-sandbox`: Required for Docker/cloud environments

## Troubleshooting

### GPU Not Being Used

```bash
# Check if GPU is accessible
nvidia-smi

# Run a quick GPU test
glxinfo | grep "OpenGL"

# If glxinfo not found
sudo apt-get install mesa-utils
```

### Rendering Failures

```bash
# Reset stuck videos
npm run render:master -- --reset

# Check logs
cat ~/.remotion/logs/*.log

# Try with lower concurrency
export RENDER_CONCURRENCY=25%
npm run render:master -- --one
```

### Out of Memory

```bash
# Check memory usage
free -h

# Check disk space
df -h

# Clear old renders if needed
rm -rf out/*.mp4  # BE CAREFUL - only if you've downloaded them!
```

### Slow Network Download

```bash
# Use compression with rsync
rsync -avz --compress-level=9 -e "ssh -p <VAST_PORT>" \
    root@<VAST_IP>:"/root/Projects /Quiz Channel 2.0/videogen/out/" \
    ~/Desktop/rendered-videos/

# Or download in background with screen
screen -S download
rsync -avz --progress -e "ssh -p <VAST_PORT>" \
    root@<VAST_IP>:"/root/Projects /Quiz Channel 2.0/videogen/out/" \
    ~/Desktop/rendered-videos/
# Press Ctrl+A then D to detach
# Reattach with: screen -r download
```

## Cost Optimization Tips

1. **Monitor Usage**: Check Vast.ai dashboard for hourly costs
2. **Pause When Done**: Stop the instance when rendering completes
3. **Batch Processing**: Render everything at once to minimize idle time
4. **Download Promptly**: Don't keep instance running just to store files
5. **Use Storage Instance**: For long-term storage, use cheaper storage-only instances

## Estimated Costs & Timeline

Based on 430 videos to render:

- **Rendering Time**: 14-28 hours total
- **Cost**: ~$0.50-1.00/hour = $7-28 total
- **Download Time**: 2-6 hours (depends on video sizes and network)
- **Total Time**: ~16-34 hours from start to finish

## Next Steps After Rendering

1. Download all videos to local machine
2. Verify video quality (spot check ~10 videos)
3. Stop Vast.ai instance to avoid charges
4. Upload videos to your content platform
5. Keep backups of rendered videos

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Remotion logs: `~/.remotion/logs/`
3. Check Vast.ai instance logs
4. Verify GPU access with `nvidia-smi`
5. Test with single video render first

