import { Config } from '@remotion/cli/config';

// Use PNG for better quality (no JPEG compression artifacts)
Config.setVideoImageFormat('png');
Config.setOverwriteOutput(true);

// Set CRF to 18 for visually lossless quality
Config.setCrf(18);

// GPU Acceleration Settings for Vast.ai rendering
// Enable GPU acceleration in headless Chromium for faster rendering
Config.setChromiumOpenGlRenderer('angle');
Config.setBrowserExecutable(null); // Use bundled Chromium
Config.setChromiumHeadlessMode(true);
