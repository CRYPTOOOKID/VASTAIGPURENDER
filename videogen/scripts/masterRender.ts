import * as readline from 'readline';
import { spawn } from 'child_process';
import * as path from 'path';
import {
  getQuizList,
  getRandomQuizFile,
  getUnrenderedQuizzes,
  updateProgress,
  ensureOutputDir,
  readQuizData,
  getProgressSummary,
  audioFolderExists,
  copyAudioFilesToPublic,
  QuizFileInfo,
} from './fileManager';
import { getSeededRandomTemplate, getRandomTemplate } from '../src/templates/templateRegistry';
import { calculateTotalDuration, FRAMES } from '../src/config/timing';

// Get project root dynamically - works on any machine
const VIDEOGEN_DIR = path.resolve(__dirname, '..');
const PROJECT_ROOT = path.resolve(VIDEOGEN_DIR, '..');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Promisify readline question
const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

// Display main menu
const displayMenu = (): void => {
  console.log('\n' + '='.repeat(60));
  console.log('🎬 QUIZ VIDEO MASTER RENDER PROGRAM 🎬');
  console.log('='.repeat(60));
  console.log('\nOptions:');
  console.log('  1 - Render ONE randomly selected quiz');
  console.log('  2 - Process EVERYTHING available in quiz jsons (PARALLEL)');
  console.log('  3 - Show progress summary');
  console.log('  4 - Reset stuck "in_progress" videos');
  console.log('  5 - Exit');
  console.log('\n' + '='.repeat(60));
};

// Show progress summary
const showProgressSummary = (): void => {
  const summary = getProgressSummary();
  console.log('\n' + '='.repeat(60));
  console.log('📊 PROGRESS SUMMARY 📊');
  console.log('='.repeat(60));
  console.log(`Total Quizzes:     ${summary.total}`);
  console.log(`✅ Completed:       ${summary.completed}`);
  console.log(`⏳ Pending:         ${summary.pending}`);
  console.log(`❌ Failed:          ${summary.failed}`);
  console.log(`⚠️  In Progress:    ${summary.inProgress || 0}`);
  console.log('='.repeat(60) + '\n');
};

// Reset stuck "in_progress" videos back to pending
const resetStuckVideos = (): void => {
  const fs = require('fs');
  const path = require('path');
  const progressPath = path.join(PROJECT_ROOT, 'videogen/output/progress.json');

  if (!fs.existsSync(progressPath)) {
    console.log('\n❌ Progress file not found');
    return;
  }

  const progress = JSON.parse(fs.readFileSync(progressPath, 'utf-8'));
  let resetCount = 0;

  Object.keys(progress).forEach((key) => {
    if (progress[key].status === 'in_progress') {
      progress[key].status = 'pending';
      delete progress[key].templateId;
      delete progress[key].outputFile;
      resetCount++;
      console.log(`🔄 Reset: ${key}`);
    }
  });

  if (resetCount > 0) {
    fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
    console.log(`\n✅ Reset ${resetCount} stuck video(s) to pending status`);
  } else {
    console.log('\n✅ No stuck videos found!');
  }
};

// Render a single quiz
const renderQuiz = async (quizInfo: QuizFileInfo): Promise<boolean> => {
  try {
    console.log('\n' + '-'.repeat(60));
    console.log(`🎬 Rendering: ${quizInfo.baseName}`);
    console.log('-'.repeat(60));

    // Check if audio folder exists
    if (!audioFolderExists(quizInfo.audioFolder)) {
      console.error(`❌ Audio folder not found: ${quizInfo.audioFolder}`);
      updateProgress(quizInfo.baseName, {
        status: 'failed',
        lastError: 'Audio folder not found',
        attempts: (updateProgress as any).attempts || 1,
      });
      return false;
    }

    // Copy audio files to public folder for rendering
    console.log(`📋 Copying audio files...`);
    const audioCopied = copyAudioFilesToPublic(quizInfo.audioFolder);
    if (!audioCopied) {
      console.error(`❌ Failed to copy audio files`);
      updateProgress(quizInfo.baseName, {
        status: 'failed',
        lastError: 'Failed to copy audio files',
      });
      return false;
    }

    // Read quiz data to get question count
    const quizData = readQuizData(quizInfo.quizPath);
    const questionCount = quizData.quiz.length;

    // Select template using seeded random (consistent for same quiz)
    const template = getSeededRandomTemplate(quizInfo.baseName);
    console.log(`📋 Template: ${template.name} (${template.id})`);
    console.log(`📝 Questions: ${questionCount}`);
    console.log(`🎵 Audio folder: ${quizInfo.audioFolder}`);

    // Calculate duration
    const totalDuration = calculateTotalDuration(questionCount);
    const durationSeconds = totalDuration / FRAMES.FPS;
    console.log(`⏱️  Duration: ${durationSeconds.toFixed(1)}s (${totalDuration} frames)`);

    // Mark as in progress
    updateProgress(quizInfo.baseName, {
      status: 'in_progress',
      templateId: template.id,
      outputFile: quizInfo.outputPath,
    });

    // Ensure output directory exists
    ensureOutputDir();

    // Prepare props for Remotion
    const props = {
      quizData,
      audioFolder: quizInfo.audioFolder,
      templateId: template.id,
    };

    // Write props to a temporary file to avoid shell escaping issues
    const propsFile = path.join(VIDEOGEN_DIR, '.render-props.json');
    const fs = require('fs');
    fs.writeFileSync(propsFile, JSON.stringify(props, null, 2));

    // Build Remotion render command with HD quality settings
    // When running parallel renders, concurrency is adjusted automatically
    const concurrency = process.env.RENDER_CONCURRENCY || '4';

    // GPU acceleration flags for Vast.ai instance
    const gpuFlags = [
      '--enable-gpu',
      '--use-gl=angle',
      '--use-angle=gl',
      '--enable-gpu-rasterization',
      '--enable-zero-copy',
      '--ignore-gpu-blocklist',
      '--enable-hardware-overlays',
      '--disable-software-rasterizer',
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--autoplay-policy=no-user-gesture-required',
      '--disable-features=AudioServiceOutOfProcess',
      '--disable-audio-output',
    ];

    const args = [
      'remotion',
      'render',
      'QuizVideo',
      quizInfo.outputPath,
      '--props',
      propsFile,
      '--concurrency',
      concurrency,  // Adjustable based on parallel render count
      '--height',
      '1080',  // 1080p resolution
      '--crf',
      '18',  // CRF 18 = visually lossless quality
      '--image-format',
      'png',  // PNG instead of JPEG for better quality
      '--codec',
      'h264',  // H264 codec for compatibility
      '--overwrite',  // Overwrite existing files
      '--gl',
      'angle',  // Use ANGLE for GPU acceleration
      '--timeout',
      '120000',  // 2 minute timeout for video loading
      ...gpuFlags.map(flag => `--chromium-flags="${flag}"`),  // Pass GPU flags to Chromium
    ];

    console.log('\n🎥 Starting render...\n');

    // Execute Remotion render
    // Note: NOT using shell:true to properly handle spaces in paths
    return new Promise((resolve) => {
      // Force GPU usage via environment variables
      const env = {
        ...process.env,
        DISPLAY: process.env.DISPLAY || ':99',
        CHROMIUM_FLAGS: gpuFlags.join(' '),
        PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: 'false',
      };
      
      const remotionProcess = spawn('npx', args, {
        cwd: VIDEOGEN_DIR,
        stdio: 'inherit',
        env: env,
      });

      remotionProcess.on('close', (code) => {
        // Clean up props file
        try {
          if (fs.existsSync(propsFile)) {
            fs.unlinkSync(propsFile);
          }
        } catch (e) {
          // Ignore cleanup errors
        }

        if (code === 0) {
          console.log('\n✅ Render completed successfully!');
          updateProgress(quizInfo.baseName, {
            status: 'completed',
            templateId: template.id,
            outputFile: quizInfo.outputPath,
            renderedAt: new Date().toISOString(),
          });
          resolve(true);
        } else {
          console.error(`\n❌ Render failed with code ${code}`);
          updateProgress(quizInfo.baseName, {
            status: 'failed',
            templateId: template.id,
            outputFile: quizInfo.outputPath,
            lastError: `Process exited with code ${code}`,
          });
          resolve(false);
        }
      });

      remotionProcess.on('error', (error) => {
        // Clean up props file
        try {
          if (fs.existsSync(propsFile)) {
            fs.unlinkSync(propsFile);
          }
        } catch (e) {
          // Ignore cleanup errors
        }

        console.error('\n❌ Error spawning render process:', error);
        updateProgress(quizInfo.baseName, {
          status: 'failed',
          templateId: template.id,
          outputFile: quizInfo.outputPath,
          lastError: error.message,
        });
        resolve(false);
      });
    });
  } catch (error) {
    console.error('❌ Error in renderQuiz:', error);
    updateProgress(quizInfo.baseName, {
      status: 'failed',
      lastError: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
};

// Render one random quiz
const renderOneRandom = async (): Promise<void> => {
  const unrendered = getUnrenderedQuizzes();
  
  if (unrendered.length === 0) {
    console.log('\n🎉 All quizzes have been rendered!');
    return;
  }

  const randomQuiz = unrendered[Math.floor(Math.random() * unrendered.length)];
  console.log(`\n🎲 Randomly selected: ${randomQuiz.baseName}`);
  
  await renderQuiz(randomQuiz);
};

// Render all unrendered quizzes with parallel processing
const renderAll = async (): Promise<void> => {
  const unrendered = getUnrenderedQuizzes();

  if (unrendered.length === 0) {
    console.log('\n🎉 All quizzes have been rendered!');
    return;
  }

  console.log(`\n📋 Found ${unrendered.length} quiz(zes) to render`);

  const answer = await question(`\nProceed with rendering all ${unrendered.length} quizzes? (yes/no): `);

  if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
    console.log('❌ Cancelled.');
    return;
  }

  // Parallel rendering configuration
  const PARALLEL_RENDERS = 1;  // Number of videos to render simultaneously (reduced for Vast.ai)
  const CONCURRENCY_PER_RENDER = '8';  // CPU cores per video (conservative to avoid EAGAIN)

  // Set environment variable for concurrency
  process.env.RENDER_CONCURRENCY = CONCURRENCY_PER_RENDER;

  console.log(`\n⚡ Sequential rendering: ${PARALLEL_RENDERS} video at a time`);
  console.log(`🔧 CPU allocation: ${CONCURRENCY_PER_RENDER} threads per video\n`);

  let successCount = 0;
  let failCount = 0;
  let currentIndex = 0;

  // Process in batches
  while (currentIndex < unrendered.length) {
    const batch = unrendered.slice(currentIndex, currentIndex + PARALLEL_RENDERS);
    const batchPromises = batch.map((quiz, batchIndex) => {
      const globalIndex = currentIndex + batchIndex;
      console.log(`\n[${globalIndex + 1}/${unrendered.length}] Starting: ${quiz.baseName}`);
      return renderQuiz(quiz);
    });

    // Wait for all videos in this batch to complete
    const results = await Promise.all(batchPromises);

    // Count successes and failures
    results.forEach((success) => {
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    });

    currentIndex += PARALLEL_RENDERS;

    // Show progress after each batch
    const processed = Math.min(currentIndex, unrendered.length);
    console.log(`\n📊 Progress: ${processed}/${unrendered.length} processed (${successCount} successful, ${failCount} failed)`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 BATCH RENDER COMPLETE 📊');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📁 Total processed: ${successCount + failCount}`);
  console.log('='.repeat(60) + '\n');
};

// Main program loop
const main = async (): Promise<void> => {
  // Check for command-line arguments
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // Non-interactive mode with command-line arguments
    const command = args[0].toLowerCase();
    
    console.log('\n🚀 Initializing Master Render Program...\n');
    
    switch (command) {
      case '--one':
      case '-1':
        showProgressSummary();
        await renderOneRandom();
        break;
        
      case '--all':
      case '-a':
        showProgressSummary();
        await renderAll();
        break;
        
      case '--summary':
      case '-s':
        showProgressSummary();
        break;

      case '--reset':
      case '-r':
        showProgressSummary();
        resetStuckVideos();
        break;

      case '--help':
      case '-h':
        console.log('Usage: npm run render:master [option]');
        console.log('\nOptions:');
        console.log('  --one, -1       Render one randomly selected quiz');
        console.log('  --all, -a       Render all unrendered quizzes (parallel)');
        console.log('  --summary, -s   Show progress summary');
        console.log('  --reset, -r     Reset stuck "in_progress" videos');
        console.log('  --help, -h      Show this help message');
        console.log('\nIf no option is provided, runs in interactive mode.\n');
        break;
        
      default:
        console.log(`\n❌ Unknown option: ${command}`);
        console.log('Use --help to see available options.\n');
        process.exit(1);
    }
    
    rl.close();
    return;
  }
  
  // Interactive mode (no command-line arguments)
  console.log('\n🚀 Initializing Master Render Program...\n');

  // Show initial summary
  showProgressSummary();

  let running = true;

  while (running) {
    displayMenu();

    const choice = await question('Enter your choice (1-5): ');

    switch (choice.trim()) {
      case '1':
        await renderOneRandom();
        break;

      case '2':
        await renderAll();
        break;

      case '3':
        showProgressSummary();
        break;

      case '4':
        resetStuckVideos();
        break;

      case '5':
        console.log('\n👋 Goodbye!\n');
        running = false;
        break;

      default:
        console.log('\n❌ Invalid choice. Please enter 1, 2, 3, 4, or 5.\n');
    }
  }

  rl.close();
};

// Run the program
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

