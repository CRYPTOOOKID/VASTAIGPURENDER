import * as fs from 'fs';
import * as path from 'path';
import { getQuizList, getProgressSummary } from './fileManager';
import { TEMPLATES } from '../src/templates/templateRegistry';

const PROJECT_ROOT = '/Users/srinadhchitrakavi/Desktop/Projects /Quiz Channel 2.0';

console.log('\n' + '='.repeat(70));
console.log('🎬 QUIZ VIDEO RENDERING SYSTEM - SYSTEM CHECK 🎬');
console.log('='.repeat(70));

console.log('\n📋 TEMPLATES AVAILABLE:');
console.log('-'.repeat(70));
TEMPLATES.forEach((template, index) => {
  console.log(`  ${index + 1}. ${template.name} (${template.id})`);
  console.log(`     ${template.description}`);
});

console.log('\n📁 QUIZ FILES:');
console.log('-'.repeat(70));
try {
  const quizzes = getQuizList();
  console.log(`  Total quiz JSON files found: ${quizzes.length}`);
  console.log(`  Sample quizzes:`);
  quizzes.slice(0, 5).forEach((quiz, i) => {
    console.log(`    ${i + 1}. ${quiz.baseName}`);
  });
  if (quizzes.length > 5) {
    console.log(`    ... and ${quizzes.length - 5} more`);
  }
} catch (error) {
  console.log(`  ❌ Error reading quiz files: ${error}`);
}

console.log('\n🎵 AUDIO FOLDERS:');
console.log('-'.repeat(70));
const audioDir = path.join(PROJECT_ROOT, 'audiogen/output audios');
if (fs.existsSync(audioDir)) {
  const audioFolders = fs.readdirSync(audioDir);
  console.log(`  Total audio folders found: ${audioFolders.length}`);
  console.log(`  Sample folders:`);
  audioFolders.slice(0, 5).forEach((folder, i) => {
    console.log(`    ${i + 1}. ${folder}`);
  });
  if (audioFolders.length > 5) {
    console.log(`    ... and ${audioFolders.length - 5} more`);
  }
} else {
  console.log(`  ❌ Audio directory not found: ${audioDir}`);
}

console.log('\n📊 RENDER PROGRESS:');
console.log('-'.repeat(70));
try {
  const summary = getProgressSummary();
  console.log(`  Total Quizzes:     ${summary.total}`);
  console.log(`  ✅ Completed:       ${summary.completed}`);
  console.log(`  ⏳ Pending:         ${summary.pending}`);
  console.log(`  ❌ Failed:          ${summary.failed}`);
} catch (error) {
  console.log(`  No progress data yet (will be created on first render)`);
}

console.log('\n📂 OUTPUT DIRECTORY:');
console.log('-'.repeat(70));
const outputDir = path.join(PROJECT_ROOT, 'videogen/output/videos');
if (fs.existsSync(outputDir)) {
  const videos = fs.readdirSync(outputDir).filter(f => f.endsWith('.mp4'));
  console.log(`  Output directory: ${outputDir}`);
  console.log(`  Rendered videos: ${videos.length}`);
} else {
  console.log(`  Output directory will be created on first render`);
}

console.log('\n✅ SYSTEM STATUS:');
console.log('-'.repeat(70));
console.log(`  Templates: ${TEMPLATES.length} available`);
console.log(`  System: Ready to render`);
console.log(`  Command: npm run render:master`);

console.log('\n' + '='.repeat(70));
console.log('💡 TIP: Read USAGE_INSTRUCTIONS.txt for detailed usage guide');
console.log('='.repeat(70) + '\n');









