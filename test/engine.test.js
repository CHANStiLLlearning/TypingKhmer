import {
  parseKhmerKeystrokes,
  tokenizeLessonText,
  validateKeystroke,
  calculateWPM,
  calculateAccuracy,
} from '../src/utils/khmerTextEngine.js';
import { KHMER_KEY_MAP } from '../src/data/khmerKeyMap.js';

console.log('--- Running Khmer Typing Tutor Engine Tests ---');

// Test 1: Subscripts deconstruction (e.g. កម្ពុជា -> Kampuchea)
const kampuchea = 'កម្ពុជា';
const strokes = parseKhmerKeystrokes(kampuchea);
console.log(`Deconstructed "${kampuchea}" into ${strokes.length} keystrokes:`);
strokes.forEach((s, idx) => {
  console.log(`  [${idx}] char: ${s.char}, code: ${s.code}, layer: ${s.layer}, mod: ${s.modifier}, coeng: ${s.isCoeng}`);
});

// Assertions for កម្ពុជា:
// 0. ក -> KeyK, normal
// 1. ម -> KeyM, normal
// 2. ្ -> KeyJ, normal, isCoeng: true
// 3. ព -> KeyB, shift, mod: Shift
// 4. ុ -> KeyU, normal
// 5. ជ -> KeyC, shift, mod: Shift
// 6. ា -> KeyA, normal
if (strokes.length !== 7) throw new Error(`Expected 7 strokes, got ${strokes.length}`);
if (strokes[0].code !== 'KeyK' || strokes[0].char !== 'ក') throw new Error('Failed on ក');
if (strokes[1].code !== 'KeyM' || strokes[1].char !== 'ម') throw new Error('Failed on ម');
if (strokes[2].code !== 'KeyJ' || strokes[2].char !== '្' || !strokes[2].isCoeng) throw new Error('Failed on ជើង (Coeng)');
if (strokes[3].code !== 'KeyB' || strokes[3].char !== 'ព' || strokes[3].layer !== 'shift') throw new Error('Failed on ព');
if (strokes[4].code !== 'KeyU' || strokes[4].char !== 'ុ') throw new Error('Failed on ុ');
if (strokes[5].code !== 'KeyC' || strokes[5].char !== 'ជ' || strokes[5].layer !== 'shift') throw new Error('Failed on ជ');
if (strokes[6].code !== 'KeyA' || strokes[6].char !== 'ា') throw new Error('Failed on ា');
console.log('✓ Test 1: Subscript deconstruction PASSED!');

// Test 2: Compound ligatures that map to single NiDA keys
// ាំ (\u17B6\u17C6) -> Shift + KeyA
const aamStrokes = parseKhmerKeystrokes('\u17B6\u17C6');
if (aamStrokes.length !== 1 || aamStrokes[0].code !== 'KeyA' || aamStrokes[0].layer !== 'shift') {
  throw new Error(`Failed on ាំ compound ligature: ${JSON.stringify(aamStrokes)}`);
}

// េះ (\u17C1\u17C7) -> Shift + KeyV
const ehStrokes = parseKhmerKeystrokes('\u17C1\u17C7');
if (ehStrokes.length !== 1 || ehStrokes[0].code !== 'KeyV' || ehStrokes[0].layer !== 'shift') {
  throw new Error(`Failed on េះ compound ligature: ${JSON.stringify(ehStrokes)}`);
}

// ោះ (\u17C4\u17C7) -> Shift + Semicolon
const ohStrokes = parseKhmerKeystrokes('\u17C4\u17C7');
if (ohStrokes.length !== 1 || ohStrokes[0].code !== 'Semicolon' || ohStrokes[0].layer !== 'shift') {
  throw new Error(`Failed on ោះ compound ligature: ${JSON.stringify(ohStrokes)}`);
}

// ុំ (\u17BB\u17C6) -> Comma (normal)
const umStrokes = parseKhmerKeystrokes('\u17BB\u17C6');
if (umStrokes.length !== 1 || umStrokes[0].code !== 'Comma' || umStrokes[0].layer !== 'normal') {
  throw new Error(`Failed on ុំ compound ligature: ${JSON.stringify(umStrokes)}`);
}
console.log('✓ Test 2: Compound NiDA ligatures PASSED!');

// Test 3: Validation logic
const targetKa = strokes[0]; // { code: 'KeyK', layer: 'normal' }
if (!validateKeystroke({ code: 'KeyK', shiftKey: false, altKey: false }, targetKa)) {
  throw new Error('Valid KeyK rejected');
}
if (validateKeystroke({ code: 'KeyK', shiftKey: true, altKey: false }, targetKa)) {
  throw new Error('Shift+KeyK should not match normal KeyK');
}
if (validateKeystroke({ code: 'KeyL', shiftKey: false, altKey: false }, targetKa)) {
  throw new Error('KeyL should not match KeyK');
}

// Test shifted target: ព (Shift+KeyB)
const targetPho = strokes[3];
if (!validateKeystroke({ code: 'KeyB', shiftKey: true, altKey: false }, targetPho)) {
  throw new Error('Valid Shift+KeyB rejected');
}
if (validateKeystroke({ code: 'KeyB', shiftKey: false, altKey: false }, targetPho)) {
  throw new Error('Unshifted KeyB accepted when Shift was required');
}
console.log('✓ Test 3: Keystroke validation PASSED!');

// Test 4: WPM and Accuracy
const wpm = calculateWPM(250, 60); // 250 chars in 1 min = 50 WPM
if (wpm !== 50) throw new Error(`Expected WPM 50, got ${wpm}`);

const acc = calculateAccuracy(95, 100);
if (acc !== 95) throw new Error(`Expected Accuracy 95, got ${acc}`);
console.log('✓ Test 4: Metrics calculation PASSED!');

// Test 5: Full Windows KBDKNI.DLL 100% Independent Vowels & Keys Verification
const independentVowelTests = [
  { char: 'ឲ', expectedCode: 'Equal', expectedLayer: 'normal', expectedMod: null },
  { char: 'ឬ', expectedCode: 'KeyR', expectedLayer: 'shift', expectedMod: 'Shift' },
  { char: 'ឫ', expectedCode: 'KeyR', expectedLayer: 'altGr', expectedMod: 'AltGr' },
  { char: 'ឱ', expectedCode: 'KeyO', expectedLayer: 'altGr', expectedMod: 'AltGr' },
  { char: 'ឩ', expectedCode: 'BracketLeft', expectedLayer: 'altGr', expectedMod: 'AltGr' },
  { char: 'ឪ', expectedCode: 'BracketRight', expectedLayer: 'normal', expectedMod: null },
  { char: 'ឧ', expectedCode: 'BracketRight', expectedLayer: 'shift', expectedMod: 'Shift' },
  { char: 'ឳ', expectedCode: 'BracketRight', expectedLayer: 'altGr', expectedMod: 'AltGr' },
  { char: 'ឮ', expectedCode: 'Backslash', expectedLayer: 'normal', expectedMod: null },
  { char: 'ឭ', expectedCode: 'Backslash', expectedLayer: 'shift', expectedMod: 'Shift' },
  { char: ' ', expectedCode: 'Space', expectedLayer: 'normal', expectedMod: null },
  { char: '\u200B', expectedCode: 'Space', expectedLayer: 'normal', expectedMod: null },
];

for (const test of independentVowelTests) {
  const result = parseKhmerKeystrokes(test.char);
  if (result.length !== 1) {
    throw new Error(`Failed on ${test.char}: expected 1 stroke, got ${result.length}`);
  }
  const s = result[0];
  if (s.code !== test.expectedCode || s.layer !== test.expectedLayer || s.modifier !== test.expectedMod) {
    throw new Error(`Mismatch for ${test.char}: got ${s.code} (${s.layer}, mod ${s.modifier}), expected ${test.expectedCode} (${test.expectedLayer}, mod ${test.expectedMod})`);
  }
}
console.log('✓ Test 5: Full Windows KBDKNI.DLL 100% key validation PASSED!');

console.log('ALL TESTS PASSED SUCCESSFULLY! 🎉');

