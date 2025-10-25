# 🚀 Vast.ai GPU Rendering - Complete Guide

## ⚡ Your Instance Specs
- **GPU**: 31.8 GB VRAM, 107.6 TFLOPS (CUDA 13.0)
- **CPU**: AMD EPYC 7642, 24 cores / 192 total
- **RAM**: 129 GB
- **Storage**: 4TB WD_BLACK SN850X SSD
- **Network**: Up to 7441 Mbps

Perfect for GPU-accelerated video rendering! 🎉

---

## 📋 Quick Start (5 Steps)

### Step 1: Connect to Your Instance
```bash
# From Vast.ai dashboard, get your SSH command:
ssh -p <YOUR_PORT> root@<YOUR_IP>
```

### Step 2: Run One-Time Setup
```bash
# Copy and paste this entire command block:
apt-get update && \
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
apt-get install -y nodejs \
    libglib2.0-0 libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libdrm2 libdbus-1-3 libxkbcommon0 libxcomposite1 \
    libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 \
    libcairo2 libasound2 libatspi2.0-0 libxshmfence1 \
    libgl1 libglu1-mesa mesa-utils xvfb git rsync && \
nvidia-smi
```

### Step 3: Clone Project & Install
```bash
# Clone your repository (update with your repo URL):
git clone <YOUR_REPO_URL>
cd "Projects /Quiz Channel 2.0/videogen"
npm install
```

### Step 4: Test Render (ONE VIDEO)
```bash
# IMPORTANT: Test first before rendering all!
npm run render:master -- --one
```

**✅ What to Look For:**
- Rendering completes without errors
- Video appears in `out/` directory
- Check with: `ls -lh out/*.mp4`

### Step 5: Render All Videos
```bash
# If test passes, render everything:
npm run render:master -- --all
```

When prompted, type `yes` to confirm.

**⏱️ Expected Time**: 14-28 hours for 430 videos  
**💰 Expected Cost**: $7-28 total (depends on instance pricing)

---

## 📥 Downloading Videos to Your Local Machine

### While Rendering (Recommended)
On **YOUR LOCAL MACHINE**, create this script:

```bash
# Create sync-videos.sh:
nano sync-videos.sh
```

Paste this (update PORT and IP):
```bash
#!/bin/bash
while true; do
    rsync -avz --progress --update -e "ssh -p YOUR_VAST_PORT" \
        root@YOUR_VAST_IP:"/root/Projects /Quiz Channel 2.0/videogen/out/" \
        ~/Desktop/rendered-videos/
    echo "✅ Sync at $(date). Waiting 30min..."
    sleep 1800
done
```

Run it:
```bash
chmod +x sync-videos.sh
./sync-videos.sh
```

### After All Rendering Complete
```bash
# One-time download:
mkdir -p ~/Desktop/rendered-videos
rsync -avz --progress -e "ssh -p YOUR_VAST_PORT" \
    root@YOUR_VAST_IP:"/root/Projects /Quiz Channel 2.0/videogen/out/" \
    ~/Desktop/rendered-videos/
```

---

## 📊 Monitoring Progress

### Check Rendering Status
```bash
# Show summary:
npm run render:master -- --summary

# Count completed videos:
ls out/*.mp4 | wc -l
```

### Monitor GPU Usage
```bash
# Real-time GPU monitoring:
watch -n 1 nvidia-smi

# CPU usage:
apt-get install -y htop && htop

# Disk space:
df -h
```

---

## 🔧 GPU Acceleration Enabled

The following optimizations have been configured:

### ✅ In `remotion.config.ts`:
- ANGLE OpenGL renderer for GPU acceleration
- Headless mode with GPU enabled
- Optimized for cloud/Docker environments

### ✅ In `scripts/masterRender.ts`:
- GPU flags passed to Chromium:
  - `--enable-gpu`
  - `--use-gl=angle`
  - `--enable-gpu-rasterization`
  - `--ignore-gpu-blocklist`
  - `--no-sandbox` (required for cloud)
- Parallel rendering (2 videos at once)
- 50% CPU per video (100% total utilization)

### Expected Performance:
- **Without GPU**: ~2-3 minutes per video
- **With GPU**: ~30-60 seconds per video
- **Speedup**: 2-3x faster! 🚀

---

## 📁 Files Created for You

| File | Purpose |
|------|---------|
| `VAST_AI_COMMANDS.txt` | Complete command reference |
| `LOCAL_DOWNLOAD_GUIDE.txt` | Detailed download instructions |
| `START_HERE_VASTAI.md` | This quick start guide (you are here) |
| `quick-setup-vastai.sh` | Automated setup script |
| `vast-ai-setup.sh` | Alternative setup script |
| `render-with-download.sh` | Render + auto-download script |
| `remotion.config.ts` | ✅ Updated with GPU settings |
| `scripts/masterRender.ts` | ✅ Updated with GPU flags |

---

## ⚠️ Important Reminders

### Before You Start
- ✅ Test with ONE video first (`--one`)
- ✅ Verify GPU is accessible (`nvidia-smi`)
- ✅ Check disk space (`df -h`)

### While Rendering
- ✅ Start downloading incrementally (saves time at the end)
- ✅ Monitor progress periodically
- ✅ Keep SSH connection alive (or use `screen`/`tmux`)

### After Rendering
- ✅ Verify all videos downloaded
- ✅ Spot-check video quality (play 5-10 videos)
- ✅ **STOP INSTANCE** to avoid charges!
- ✅ Backup videos locally before deleting anything

---

## 🆘 Troubleshooting

### GPU Not Working?
```bash
nvidia-smi  # Should show GPU info
glxinfo | grep "OpenGL"  # Check OpenGL
```

### Rendering Fails?
```bash
npm run render:master -- --reset  # Reset stuck videos
npm run render:master -- --one   # Try single video
```

### Out of Memory?
```bash
free -h  # Check RAM
df -h    # Check disk
```

### Can't Download?
```bash
# Test SSH connection:
ssh -p YOUR_PORT root@YOUR_IP

# Try single file:
scp -P YOUR_PORT root@YOUR_IP:"/root/Projects /Quiz Channel 2.0/videogen/out/test.mp4" ~/Desktop/
```

---

## 📞 Need More Help?

Refer to these detailed guides:
1. **VAST_AI_COMMANDS.txt** - All commands in one place
2. **LOCAL_DOWNLOAD_GUIDE.txt** - Comprehensive download instructions
3. **VAST_AI_INSTRUCTIONS.md** - Detailed technical documentation

---

## 🎯 Success Checklist

- [ ] Connected to Vast.ai instance
- [ ] Ran system setup commands
- [ ] Cloned repository
- [ ] Installed npm dependencies
- [ ] Verified GPU access (`nvidia-smi`)
- [ ] Tested ONE video successfully
- [ ] Started rendering all videos
- [ ] Setup automatic downloading
- [ ] Monitoring progress
- [ ] Downloaded all videos locally
- [ ] Verified video quality
- [ ] Stopped Vast.ai instance

---

## 💡 Pro Tips

1. **Use Screen** - Keep renders running even if SSH disconnects:
   ```bash
   screen -S render
   npm run render:master -- --all
   # Press Ctrl+A then D to detach
   # Reconnect: screen -r render
   ```

2. **Monitor Costs** - Check Vast.ai dashboard regularly for charges

3. **Download While Rendering** - Start incremental sync early to save time

4. **Spot Check Quality** - Don't wait until the end to verify videos work

5. **Backup Everything** - Make copies before destroying the instance

---

## 🎬 Ready to Go!

You're all set! Follow the 5 quick start steps above and you'll be rendering in minutes.

**Expected Timeline:**
- Setup: 10 minutes
- Test render: 1 minute
- Full render: 14-28 hours
- Download: 2-6 hours
- **Total: ~16-34 hours**

**Cost Estimate:**  
$7-28 total (much cheaper than rendering locally for days!)

Good luck! 🚀

