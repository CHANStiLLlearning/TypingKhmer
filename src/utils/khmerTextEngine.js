import { KHMER_KEY_MAP, CHAR_TO_KEY_MAP } from '../data/khmerKeyMap.js';
import { ENGLISH_KEY_MAP, ENGLISH_CHAR_TO_KEY_MAP } from '../data/englishKeyMap.js';

// Compound multi-codepoint ligatures that correspond to a single key on Khmer NiDA
const NIDA_COMPOUND_LIGATURES = [
  { sequence: '\u17B6\u17C6', char: 'ាំ', code: 'KeyA', layer: 'shift', modifier: 'Shift', name: 'ស្រៈ ាំ (AAM)' },
  { sequence: '\u17C1\u17C7', char: 'េះ', code: 'KeyV', layer: 'shift', modifier: 'Shift', name: 'ស្រៈ េះ (EH)' },
  { sequence: '\u17C4\u17C7', char: 'ោះ', code: 'Semicolon', layer: 'shift', modifier: 'Shift', name: 'ស្រៈ ោះ (OH)' },
  { sequence: '\u17BB\u17C6', char: 'ុំ', code: 'Comma', layer: 'normal', modifier: null, name: 'ស្រៈ ុំ (UM)' },
  { sequence: '\u17BB\u17C7', char: 'ុះ', code: 'Comma', layer: 'shift', modifier: 'Shift', name: 'ស្រៈ ុះ (UH)' },
];

/**
 * Deconstructs a Khmer string into an array of atomic keystroke units.
 * Each unit contains:
 * - char: character or compound ligature to display
 * - code: physical event.code on QWERTY
 * - layer: 'normal' | 'shift' | 'altGr'
 * - modifier: null | 'Shift' | 'AltGr'
 * - finger: finger placement ID
 * - keyData: full key metadata from KHMER_KEY_MAP
 * - isCoeng: boolean if this stroke is the Coeng sign (\u17D2)
 */
export function parseKhmerKeystrokes(text) {
  const strokes = [];
  let i = 0;

  while (i < text.length) {
    // 1. Check for 2-codepoint compound ligatures that are a single NiDA key
    const twoChar = text.slice(i, i + 2);
    const compound = NIDA_COMPOUND_LIGATURES.find((c) => c.sequence === twoChar);

    if (compound) {
      const keyData = KHMER_KEY_MAP[compound.code];
      strokes.push({
        id: `stroke-${i}`,
        char: compound.char,
        name: compound.name,
        code: compound.code,
        layer: compound.layer,
        modifier: compound.modifier,
        finger: keyData?.finger || 'left-index',
        keyData,
        isCoeng: false,
        rawLength: 2,
      });
      i += 2;
      continue;
    }

    // 2. Individual Unicode codepoint
    const singleChar = text[i];

    // Check if character is Coeng sign (\u17D2)
    if (singleChar === '\u17D2') {
      const keyData = KHMER_KEY_MAP['KeyJ'];
      strokes.push({
        id: `stroke-${i}`,
        char: '្',
        name: 'ជើង ្ (Coeng / Subscript)',
        code: 'KeyJ',
        layer: 'normal',
        modifier: null,
        finger: 'right-index',
        keyData,
        isCoeng: true,
        rawLength: 1,
      });
      i += 1;
      continue;
    }

    // Standard character lookup
    const mapped = CHAR_TO_KEY_MAP.get(singleChar);
    if (mapped) {
      strokes.push({
        id: `stroke-${i}`,
        char: singleChar,
        name: mapped.keyData[mapped.layer]?.name || singleChar,
        code: mapped.code,
        layer: mapped.layer,
        modifier: mapped.modifier,
        finger: mapped.keyData.finger,
        keyData: mapped.keyData,
        isCoeng: false,
        rawLength: 1,
      });
    } else {
      // Fallback for space or punctuation
      if (singleChar === ' ' || singleChar === '\u200B') {
        const spaceKey = KHMER_KEY_MAP['Space'];
        strokes.push({
          id: `stroke-${i}`,
          char: ' ',
          name: 'ដកឃ្លា (Space)',
          code: 'Space',
          layer: 'normal',
          modifier: null,
          finger: 'thumb',
          keyData: spaceKey,
          isCoeng: false,
          rawLength: 1,
        });
      } else {
        // Unknown or direct ASCII fallback
        strokes.push({
          id: `stroke-${i}`,
          char: singleChar,
          name: singleChar,
          code: `Key${singleChar.toUpperCase()}`,
          layer: 'normal',
          modifier: null,
          finger: 'left-index',
          keyData: null,
          isCoeng: false,
          rawLength: 1,
        });
      }
    }
    i += 1;
  }

  return strokes;
}

/**
 * Deconstructs an English string into an array of atomic keystroke units.
 */
export function parseEnglishKeystrokes(text) {
  const strokes = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const mapping = ENGLISH_CHAR_TO_KEY_MAP.get(ch);

    if (mapping) {
      strokes.push({
        id: `en-stroke-${i}`,
        char: ch,
        name: mapping.keyData?.normal?.name || mapping.keyData?.shift?.name || `Key ${ch}`,
        code: mapping.code,
        layer: mapping.layer,
        modifier: mapping.modifier,
        finger: mapping.keyData?.finger || 'thumb',
        keyData: mapping.keyData,
        isCoeng: false,
        rawLength: 1,
      });
    } else if (ch === ' ') {
      const keyData = ENGLISH_KEY_MAP['Space'];
      strokes.push({
        id: `en-stroke-${i}`,
        char: ' ',
        name: 'Space',
        code: 'Space',
        layer: 'normal',
        modifier: null,
        finger: 'thumb',
        keyData,
        isCoeng: false,
        rawLength: 1,
      });
    }
  }
  return strokes;
}

/**
 * Tokenizes lesson text into words/segments to preserve font ligatures during rendering.
 * Returns an array of word objects, each containing:
 * - text: full unbroken word string
 * - strokes: array of keystrokes for this word (including trailing space delimiter if applicable)
 * - startIndex: starting stroke index in the global strokes array
 * - endIndex: ending stroke index
 */
export function tokenizeLessonText(fullText, language = 'km') {
  const rawWords = fullText.trim().split(/\s+/);
  const words = [];
  let globalStrokeIndex = 0;

  for (let wIdx = 0; wIdx < rawWords.length; wIdx++) {
    const rawWord = rawWords[wIdx];
    if (!rawWord) continue;

    const strokes = language === 'en' ? parseEnglishKeystrokes(rawWord) : parseKhmerKeystrokes(rawWord);

    // If this is not the last word, append a space keystroke to complete the word and advance to next word
    if (wIdx < rawWords.length - 1) {
      const spaceKey = language === 'en' ? ENGLISH_KEY_MAP['Space'] : KHMER_KEY_MAP['Space'];
      strokes.push({
        id: `stroke-space-${wIdx}`,
        char: ' ',
        name: language === 'en' ? 'Space' : 'ដកឃ្លា (Space)',
        code: 'Space',
        layer: 'normal',
        modifier: null,
        finger: 'thumb',
        keyData: spaceKey,
        isCoeng: false,
        rawLength: 1,
      });
    }

    const startIndex = globalStrokeIndex;
    const endIndex = startIndex + strokes.length;

    words.push({
      text: rawWord,
      isSpace: false,
      strokes,
      startIndex,
      endIndex,
    });

    globalStrokeIndex = endIndex;
  }

  return words;
}

/**
 * Validates a keyboard event against the expected keystroke.
 * Supports:
 * 1. Physical event.code matching (with shift/altGr state verification)
 * 2. Native Khmer input mode via event.key comparison
 */
export function validateKeystroke(event, expectedStroke) {
  if (!expectedStroke) return false;

  // 1. Direct native Khmer key match (e.g., if user has Khmer NiDA keyboard installed in OS)
  if (event.key === expectedStroke.char) {
    return true;
  }

  // 2. Physical US QWERTY event.code match
  if (event.code === expectedStroke.code) {
    if (expectedStroke.layer === 'shift') {
      return event.shiftKey;
    }
    if (expectedStroke.layer === 'altGr') {
      return event.altKey || (event.ctrlKey && event.altKey);
    }
    if (expectedStroke.layer === 'normal') {
      // Normal key should not have Shift or Alt pressed (unless capsLock is on, but we don't rely on it)
      return !event.shiftKey && !event.altKey;
    }
    return true;
  }

  // 3. Space special case
  if (expectedStroke.code === 'Space' && (event.code === 'Space' || event.key === ' ' || event.key === '\u200B' || event.key === '\u00A0')) {
    return true;
  }

  return false;
}

/**
 * Calculate Words Per Minute (WPM)
 * Standard formula: (Total Characters / 5) / (Elapsed Time in Minutes)
 */
export function calculateWPM(totalChars, elapsedSeconds) {
  if (elapsedSeconds <= 0 || totalChars <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  const wpm = (totalChars / 5) / minutes;
  return Math.max(0, Math.round(wpm));
}

/**
 * Calculate Accuracy Percentage
 */
export function calculateAccuracy(correctStrokes, totalStrokes) {
  if (totalStrokes <= 0) return 100;
  const acc = (correctStrokes / totalStrokes) * 100;
  return Math.max(0, Math.min(100, Math.round(acc * 10) / 10));
}

