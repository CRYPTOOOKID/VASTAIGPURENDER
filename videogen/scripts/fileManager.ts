import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = '/Users/srinadhchitrakavi/Desktop/Projects /Quiz Channel 2.0';
const QUIZ_JSONS_DIR = path.join(PROJECT_ROOT, 'videogen/quiz jsons');
const AUDIO_DIR = path.join(PROJECT_ROOT, 'audiogen/output audios');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'videogen/output/videos');
const PROGRESS_FILE = path.join(PROJECT_ROOT, 'videogen/output/progress.json');
const PUBLIC_AUDIO_DIR = path.join(PROJECT_ROOT, 'videogen/public/question_audios');

export interface QuizFileInfo {
  fileName: string;
  baseName: string;
  quizPath: string;
  audioFolder: string;
  outputPath: string;
}

export interface ProgressEntry {
  status: 'completed' | 'failed' | 'in_progress' | 'pending';
  templateId?: string;
  outputFile?: string;
  renderedAt?: string;
  lastError?: string;
  attempts?: number;
}

export interface Progress {
  [quizName: string]: ProgressEntry;
}

// Get list of all quiz JSON files
export const getQuizList = (): QuizFileInfo[] => {
  if (!fs.existsSync(QUIZ_JSONS_DIR)) {
    throw new Error(`Quiz jsons directory not found: ${QUIZ_JSONS_DIR}`);
  }

  const files = fs.readdirSync(QUIZ_JSONS_DIR);
  const quizFiles = files.filter((f) => f.endsWith('.json'));

  return quizFiles.map((fileName) => {
    const baseName = fileName.replace('.json', '');
    const quizPath = path.join(QUIZ_JSONS_DIR, fileName);
    const audioFolder = baseName; // Audio folder has same name as quiz file (without .json)
    const outputFileName = baseName.replace(/\s+/g, '_') + '.mp4';
    const outputPath = path.join(OUTPUT_DIR, outputFileName);

    return {
      fileName,
      baseName,
      quizPath,
      audioFolder,
      outputPath,
    };
  });
};

// Get a random quiz file
export const getRandomQuizFile = (): QuizFileInfo => {
  const allQuizzes = getQuizList();
  const randomIndex = Math.floor(Math.random() * allQuizzes.length);
  return allQuizzes[randomIndex];
};

// Check if audio folder exists for a quiz
export const audioFolderExists = (audioFolder: string): boolean => {
  const audioPath = path.join(AUDIO_DIR, audioFolder);
  return fs.existsSync(audioPath);
};

// Check if video is already rendered
export const isVideoRendered = (quizName: string): boolean => {
  const progress = getProgress();
  return progress[quizName]?.status === 'completed';
};

// Load progress from file
export const getProgress = (): Progress => {
  if (!fs.existsSync(PROGRESS_FILE)) {
    return {};
  }

  try {
    const content = fs.readFileSync(PROGRESS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading progress file:', error);
    return {};
  }
};

// Save progress to file
export const saveProgress = (progress: Progress): void => {
  const outputDir = path.dirname(PROGRESS_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf-8');
};

// Update progress for a specific quiz
export const updateProgress = (
  quizName: string,
  entry: Partial<ProgressEntry>
): void => {
  const progress = getProgress();
  
  if (!progress[quizName]) {
    progress[quizName] = {
      status: 'in_progress',
      templateId: '',
      outputFile: '',
      attempts: 0,
    };
  }

  progress[quizName] = {
    ...progress[quizName],
    ...entry,
  };

  saveProgress(progress);
};

// Get quizzes that need to be rendered
export const getUnrenderedQuizzes = (): QuizFileInfo[] => {
  const allQuizzes = getQuizList();
  const progress = getProgress();

  return allQuizzes.filter((quiz) => {
    const entry = progress[quiz.baseName];
    return !entry || entry.status !== 'completed';
  });
};

// Ensure output directory exists
export const ensureOutputDir = (): void => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
};

// Read quiz JSON data
export const readQuizData = (quizPath: string): any => {
  const content = fs.readFileSync(quizPath, 'utf-8');
  return JSON.parse(content);
};

// Get progress summary
export const getProgressSummary = (): {
  total: number;
  completed: number;
  failed: number;
  pending: number;
  inProgress: number;
} => {
  const allQuizzes = getQuizList();
  const progress = getProgress();

  const completed = allQuizzes.filter(
    (q) => progress[q.baseName]?.status === 'completed'
  ).length;
  const failed = allQuizzes.filter(
    (q) => progress[q.baseName]?.status === 'failed'
  ).length;
  const inProgress = allQuizzes.filter(
    (q) => progress[q.baseName]?.status === 'in_progress'
  ).length;
  const pending = allQuizzes.length - completed - failed - inProgress;

  return {
    total: allQuizzes.length,
    completed,
    failed,
    pending,
    inProgress,
  };
};

// Copy audio files from quiz audio folder to public folder for rendering
export const copyAudioFilesToPublic = (audioFolder: string): boolean => {
  const sourceDir = path.join(AUDIO_DIR, audioFolder);
  
  if (!fs.existsSync(sourceDir)) {
    console.error(`Source audio folder not found: ${sourceDir}`);
    return false;
  }

  // Ensure public audio directory exists
  if (!fs.existsSync(PUBLIC_AUDIO_DIR)) {
    fs.mkdirSync(PUBLIC_AUDIO_DIR, { recursive: true });
  }

  try {
    // Clear existing audio files in public folder
    const existingFiles = fs.readdirSync(PUBLIC_AUDIO_DIR);
    existingFiles.forEach((file) => {
      if (file.startsWith('question_') && file.endsWith('.mp3')) {
        fs.unlinkSync(path.join(PUBLIC_AUDIO_DIR, file));
      }
    });

    // Copy new audio files
    const audioFiles = fs.readdirSync(sourceDir);
    const mp3Files = audioFiles.filter((f) => f.endsWith('.mp3'));
    
    mp3Files.forEach((file) => {
      const sourcePath = path.join(sourceDir, file);
      const destPath = path.join(PUBLIC_AUDIO_DIR, file);
      fs.copyFileSync(sourcePath, destPath);
    });

    console.log(`✅ Copied ${mp3Files.length} audio files to public folder`);
    return true;
  } catch (error) {
    console.error('Error copying audio files:', error);
    return false;
  }
};

