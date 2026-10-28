import { ENGLISH_CURRICULUM } from '../src/data/englishLessons.js';
import { ENGLISH_KEY_MAP, ENGLISH_CHAR_TO_KEY_MAP } from '../src/data/englishKeyMap.js';

console.log('=== VALIDATING ENGLISH CURRICULUM ===');
let pass = true;

for (const group of ENGLISH_CURRICULUM) {
  for (const lesson of group.lessons) {
    const words = lesson.targetText.trim().split(/\s+/);
    console.log(`Lesson ${lesson.id}: ${words.length} words`);
    if (words.length !== 125) {
      console.error(`  FAIL count != 125 for ${lesson.id}: got ${words.length}`);
      pass = false;
    }

    // Check all characters
    for (const ch of lesson.targetText) {
      if (ch === ' ') continue;
      if (!ENGLISH_CHAR_TO_KEY_MAP.has(ch)) {
        console.error(`  FAIL unmapped character in ${lesson.id}: [${ch}] (code ${ch.charCodeAt(0)})`);
        pass = false;
      }
    }
  }
}

if (pass) {
  console.log('ALL ENGLISH LESSONS PASS 100% WITH EXACTLY 125 WORDS! 🎉');
}

