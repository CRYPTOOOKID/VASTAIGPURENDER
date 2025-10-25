# 🎬 Vast.ai GPU Video Rendering - Complete Setup

## ✅ Setup Complete!

Your project is now configured for **GPU-accelerated video rendering** on Vast.ai. Everything you need has been prepared.

---

## 📂 What Was Created

### 📖 Documentation Files (Start Here!)

| File | Purpose | When to Use |
|------|---------|-------------|
| **START_HERE_VASTAI.md** | Quick start guide | READ THIS FIRST! |
| **CHEATSHEET.txt** | One-page reference | Keep open while working |
| **VAST_AI_COMMANDS.txt** | All commands | Complete reference |
| **LOCAL_DOWNLOAD_GUIDE.txt** | Download instructions | When downloading videos |
| **VAST_AI_INSTRUCTIONS.md** | Technical details | Deep dive |
| **CHANGES_MADE.md** | What changed & why | Understanding changes |
| **README_VASTAI.md** | This file | Overview |

### 🔧 Configuration Files (Already Set Up!)

| File | What Changed |
|------|--------------|
| `remotion.config.ts` | ✅ GPU acceleration enabled (ANGLE renderer) |
| `scripts/masterRender.ts` | ✅ Chromium GPU flags added |
| `commands to run` | ✅ Updated with Vast.ai info |

### 🚀 Automation Scripts

| Script | Purpose |
|--------|---------|
| `quick-setup-vastai.sh` | Automated instance setup |
| `vast-ai-setup.sh` | Alternative setup script |
| `render-with-download.sh` | Render + auto-download |

---

## 🎯 Quick Start (3 Steps)

### Step 1: Open the Main Guide
```bash
open START_HERE_VASTAI.md
# or view in terminal:
cat START_HERE_VASTAI.md
```

### Step 2: Keep Cheatsheet Handy
```bash
open CHEATSHEET.txt
# Print it or keep it open in another window
```

### Step 3: Follow the Guide
The guide walks you through:
1. Connecting to Vast.ai
2. Setting up the instance
3. Testing with one video
4. Rendering all videos
5. Downloading results

---

## ⚡ GPU Acceleration Details

### What's Enabled
- ✅ ANGLE OpenGL renderer
- ✅ GPU rasterization
- ✅ Hardware acceleration
- ✅ Headless mode optimized for cloud
- ✅ Chromium GPU flags properly configured

### Expected Performance

| Metric | Before (CPU) | After (GPU) | Improvement |
|--------|--------------|-------------|-------------|
| Per video | 2-3 minutes | 30-60 seconds | **2-3x faster** |
| 430 videos | 14-36 hours | 3.5-7 hours | **4x faster** |
| Cost | Using local machine | $7-28 on Vast.ai | Frees up your computer |

### Your Instance Specs
- **GPU**: 31.8 GB VRAM, 107.6 TFLOPS
- **CPU**: 24 cores (AMD EPYC 7642)
- **RAM**: 129 GB
- **Storage**: 4TB SSD
- **Network**: Up to 7441 Mbps

**Perfect for video rendering!** 🎉

---

## 📋 Workflow Overview

```
┌─────────────────┐
│ Connect to      │
│ Vast.ai via SSH │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Run Setup       │
│ (One-time)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Clone Repo &    │
│ Install Deps    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Test Render     │
│ (--one) ⚠️       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Verify Test     │
│ Passed ✅        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Render All      │
│ (--all)         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Download Videos │
│ (Incremental)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Stop Instance   │
│ (Save Money 💰)  │
└─────────────────┘
```

---

## 🎓 Key Commands

### On Vast.ai Instance
```bash
# Connect
ssh -p <PORT> root@<IP>

# Test render
npm run render:master -- --one

# Full render
npm run render:master -- --all

# Check progress
npm run render:master -- --summary

# Monitor GPU
nvidia-smi
```

### On Your Local Machine
```bash
# Download videos
rsync -avz --progress -e "ssh -p <PORT>" \
    root@<IP>:"/root/Projects /Quiz Channel 2.0/videogen/out/" \
    ~/Desktop/rendered-videos/
```

---

## ⚠️ Important Reminders

### Before Starting
- [ ] Read **START_HERE_VASTAI.md** completely
- [ ] Have your Vast.ai SSH credentials ready
- [ ] Ensure you have 5-10 GB free space locally (for downloads)

### During Setup
- [ ] Verify GPU works: `nvidia-smi`
- [ ] Test with ONE video first (crucial!)
- [ ] Check the test video plays correctly

### During Rendering
- [ ] Start downloading incrementally (don't wait till end!)
- [ ] Monitor progress periodically
- [ ] Keep an eye on Vast.ai costs

### After Rendering
- [ ] Download ALL videos
- [ ] Verify count matches (local vs remote)
- [ ] Spot-check video quality
- [ ] **STOP INSTANCE** to avoid charges!

---

## 📊 Cost & Time Estimates

### Rendering Time
- **Total videos**: 430
- **Per video**: 30-60 seconds
- **Parallel renders**: 2 at a time
- **Total time**: 3.5-7 hours (vs 14-36 hours on CPU)

### Cost Breakdown
- **Instance rate**: ~$0.50-1.00/hour
- **Rendering**: $3.50-7.00 (7 hours max)
- **Idle/setup**: $0.50-1.00 (setup time)
- **Buffer**: $3.00-5.00 (unexpected delays)
- **Total**: **$7-28** (very reasonable!)

### What You Save
- **Your time**: Can work on other things
- **Your hardware**: No wear on your machine
- **Electricity**: No 36-hour local render
- **Sanity**: No "is it done yet?" checking

---

## 🆘 Help & Support

### Something Not Working?

1. **Check the docs first**:
   - START_HERE_VASTAI.md (quick start)
   - VAST_AI_COMMANDS.txt (all commands)
   - LOCAL_DOWNLOAD_GUIDE.txt (download issues)

2. **Common issues**:
   - GPU not working → Run `nvidia-smi`
   - Render fails → Check `cat ~/.remotion/logs/*.log`
   - Can't download → Verify SSH connection
   - Out of space → Check `df -h`

3. **Reset and retry**:
   ```bash
   npm run render:master -- --reset
   npm run render:master -- --one
   ```

### Still Stuck?
- Check CHANGES_MADE.md for technical details
- Review VAST_AI_INSTRUCTIONS.md troubleshooting section
- Verify your Vast.ai instance is still running

---

## 🎉 Success Checklist

Complete workflow checklist:

### Setup Phase
- [ ] Connected to Vast.ai instance
- [ ] Ran setup commands
- [ ] Verified GPU access (`nvidia-smi`)
- [ ] Cloned repository
- [ ] Installed npm dependencies

### Testing Phase
- [ ] Ran test render (`--one`)
- [ ] Test completed successfully
- [ ] Video file created in `out/`
- [ ] Video plays correctly
- [ ] GPU was utilized (checked `nvidia-smi`)

### Production Phase
- [ ] Started full render (`--all`)
- [ ] Set up incremental download
- [ ] Monitoring progress
- [ ] No errors in console

### Completion Phase
- [ ] All 430 videos rendered
- [ ] All videos downloaded locally
- [ ] Verified video count matches
- [ ] Spot-checked quality (5-10 videos)
- [ ] Created backup of videos
- [ ] Stopped Vast.ai instance

---

## 📚 File Reference

### Must-Read First
1. **START_HERE_VASTAI.md** - Your main guide
2. **CHEATSHEET.txt** - Quick reference

### When You Need Details
3. **VAST_AI_COMMANDS.txt** - Complete commands
4. **LOCAL_DOWNLOAD_GUIDE.txt** - Download methods
5. **VAST_AI_INSTRUCTIONS.md** - Technical deep dive

### For Understanding Changes
6. **CHANGES_MADE.md** - What changed and why
7. **README_VASTAI.md** - This overview

### Scripts (Optional)
8. **quick-setup-vastai.sh** - Automated setup
9. **render-with-download.sh** - Auto download

---

## 🚀 Ready to Start?

**Open this file first:**
```bash
open START_HERE_VASTAI.md
```

**And keep this handy:**
```bash
open CHEATSHEET.txt
```

**Then follow the 5-step quick start guide!**

---

## 💡 Pro Tips

1. **Use `screen` or `tmux`**: Keeps render running if SSH disconnects
   ```bash
   screen -S render
   npm run render:master -- --all
   # Ctrl+A then D to detach
   ```

2. **Monitor costs**: Check Vast.ai dashboard regularly

3. **Download while rendering**: Don't wait till the end!

4. **Test thoroughly**: Better to catch issues with one video than 430

5. **Backup everything**: Before destroying the instance

---

## 🎬 Let's Go!

Everything is set up and ready. You have:
- ✅ GPU acceleration configured
- ✅ Comprehensive documentation
- ✅ Helper scripts ready
- ✅ Download guides prepared
- ✅ Troubleshooting resources available

**Estimated total time**: 1-2 hours (mostly waiting for renders)  
**Estimated cost**: $7-28 (much better than 36 hours locally!)

**Start here**: Open `START_HERE_VASTAI.md` and follow the steps!

Good luck! 🚀

---

## 📞 Quick Contact Info

- **Vast.ai Dashboard**: https://cloud.vast.ai/instances/
- **Your Instance ID**: 27276076
- **Documentation Location**: `/Users/srinadhchitrakavi/Desktop/Projects /Quiz Channel 2.0/videogen/`

---

**Last Updated**: October 25, 2025  
**Version**: 1.0  
**Status**: Ready to use ✅

