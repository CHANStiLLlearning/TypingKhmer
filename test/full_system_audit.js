import { CURRICULUM } from '../src/data/lessons.js';
import { ENGLISH_CURRICULUM } from '../src/data/englishLessons.js';
import { tokenizeLessonText } from '../src/utils/khmerTextEngine.js';

console.log('==================================================');
console.log('       FULL COMPREHENSIVE CURRICULUM AUDIT       ');
console.log('==================================================');

// 1. Audit Khmer Lessons
console.log('\n--- 1. AUDITING KHMER CURRICULUM ---');
let totalKhmerStrokes = 0;
let khmerLessonsCount = 0;

for (const level of CURRICULUM) {
  for (const lesson of level.lessons) {
    khmerLessonsCount++;
    const words = tokenizeLessonText(lesson.targetText, 'km');
    if (words.length !== 125) {
      console.error(`❌ Khmer lesson ${lesson.id} has ${words.length} words (expected 125)!`);
      process.exit(1);
    }
    const strokes = words.flatMap((w) => w.strokes);
    totalKhmerStrokes += strokes.length;
    for (const stroke of strokes) {
      if (!stroke.code) {
        console.error(`❌ Unmapped stroke in Khmer lesson ${lesson.id}: char='${stroke.char}'`);
        process.exit(1);
      }
    }
    console.log(`✓ Lesson ${lesson.id}: 125 words, ${strokes.length} strokes mapped perfectly.`);
  }
}
console.log(`🌟 All ${khmerLessonsCount} Khmer lessons verified: 125 words each, ${totalKhmerStrokes} total strokes.`);

// 2. Audit English Lessons
console.log('\n--- 2. AUDITING ENGLISH CURRICULUM ---');
let totalEnglishStrokes = 0;
let englishLessonsCount = 0;

for (const level of ENGLISH_CURRICULUM) {
  for (const lesson of level.lessons) {
    englishLessonsCount++;
    const words = tokenizeLessonText(lesson.targetText, 'en');
    if (words.length !== 125) {
      console.error(`❌ English lesson ${lesson.id} has ${words.length} words (expected 125)!`);
      process.exit(1);
    }
    const strokes = words.flatMap((w) => w.strokes);
    totalEnglishStrokes += strokes.length;
    for (const stroke of strokes) {
      if (!stroke.code) {
        console.error(`❌ Unmapped stroke in English lesson ${lesson.id}: char='${stroke.char}'`);
        process.exit(1);
      }
    }
    console.log(`✓ Lesson ${lesson.id}: 125 words, ${strokes.length} strokes mapped perfectly.`);
  }
}
console.log(`🌟 All ${englishLessonsCount} English lessons verified: 125 words each, ${totalEnglishStrokes} total strokes.`);

console.log('\n==================================================');
console.log('✅ 100% OF ALL LESSONS & KEYSTROKES VALIDATED!');
console.log('==================================================');

