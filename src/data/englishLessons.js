/**
 * English Typing Curriculum
 * Structured in 5 progressive levels from Home Row to full literature paragraphs.
 * Each lesson contains exactly 125 words for substantial practice.
 */

function make125Words(vocabList) {
  const words = [];
  let i = 0;
  while (words.length < 125) {
    words.push(vocabList[i % vocabList.length]);
    i++;
  }
  return words.slice(0, 125).join(' ');
}

// Level 1: Home Row
const en_1_1_vocab = ['fjd', 'kdk', 'fjf', 'kjk', 'did', 'kif', 'jfk', 'djk', 'fdf', 'jkj', 'kid', 'did', 'fjk', 'kdf', 'jfk', 'kjd'];
const en_1_2_vocab = ['all', 'sad', 'glad', 'fall', 'lad', 'salad', 'flask', 'ask', 'alas', 'lass', 'dad', 'falls', 'asks', 'dads', 'lads', 'flasks'];
const en_1_3_vocab = ['a', 'sad', 'lad', 'falls', 'as', 'a', 'glad', 'dad', 'asks', 'a', 'kid', 'all', 'salads', 'fall', 'as', 'flasks', 'fill', 'lads', 'ask', 'dads'];

// Level 2: Top & Bottom Rows
const en_2_1_vocab = ['tree', 'water', 'write', 'power', 'quite', 'route', 'tower', 'quiet', 'upper', 'prior', 'point', 'outer', 'wire', 'pure', 'rope', 'tire', 'pour', 'weep', 'trip', 'port'];
const en_2_2_vocab = ['box', 'man', 'can', 'van', 'zen', 'zone', 'mix', 'cab', 'ban', 'vex', 'zinc', 'buzz', 'camp', 'move', 'name', 'cave', 'band', 'maze', 'comb', 'zero'];
const en_2_3_vocab = ['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog', 'pack', 'my', 'box', 'with', 'five', 'dozen', 'liquor', 'jugs', 'how', 'vexingly', 'quick'];

// Level 3: Shift, Capitals & Numbers
const en_3_1_vocab = ['Cambodia', 'Phnom', 'Penh', 'Angkor', 'Wat', 'London', 'Paris', 'Tokyo', 'New', 'York', 'Sydney', 'Canada', 'Rome', 'Berlin', 'Madrid', 'Asia', 'Europe', 'America', 'Africa', 'Oceania'];
const en_3_2_vocab = ['Hello!', 'How', 'are', 'you?', 'I', 'am', 'fine,', 'thank', 'you.', '"Look,"', 'she', 'said.', 'Is', 'it', 'true?', 'Yes,', 'indeed!', 'Never', 'give', 'up.'];
const en_3_3_vocab = ['Item', '#1', 'costs', '$25.', 'Item', '#2', 'costs', '$50.', 'Save', '10%', 'today!', 'Call', '(855)', '123-456.', 'Total:', '100%', 'valid', 'at', '2026.', 'Great!'];

// Level 4: Speed & Vocabulary
const en_4_1_vocab = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from'];
const en_4_2_vocab = ['computer', 'software', 'hardware', 'internet', 'network', 'database', 'algorithm', 'system', 'keyboard', 'screen', 'developer', 'program', 'security', 'digital', 'server', 'browser', 'memory', 'device'];

// Level 5: Full Literature & Inspiring Passages (Exactly 125 words each)
const en_5_1_raw = 'Success is not final, failure is not fatal: it is the courage to continue that counts. In the journey of learning and personal growth, every small effort builds the foundation for extraordinary achievement. When you practice typing each day with focus and dedication, your fingers begin to move with natural rhythm and effortless precision. Do not be discouraged by initial mistakes or slower speeds; accuracy always precedes rapid progress. Embrace every challenge as an opportunity to sharpen your intellect and expand your capabilities. Believe in your potential, cultivate patience, and remain persistently curious about the wonders of the world. With consistent practice and an unwavering positive mindset, you can achieve mastery in any discipline you pursue. Keep moving forward with confidence and joy! Always persist!';
const en_5_1 = en_5_1_raw.trim().split(/\s+/).slice(0, 125).join(' ');

const en_5_2_raw = 'The beauty of modern science lies in its capacity to transform human curiosity into groundbreaking discoveries. Across countless generations, explorers and thinkers have looked up at the vast starlit sky, asking questions that unlocked the laws of physics, chemistry, and biology. Today, technology connects billions of minds across continents, enabling collaborative problem solving and instant sharing of global knowledge. From the intricate coding of genetic material to the distant horizons of deep space exploration, our collective ambition continues to illuminate the unknown. As we create intelligent software and sustainable innovations, we carry the shared responsibility to protect our living planet and foster human well-being everywhere. Knowledge is the greatest heritage we leave to generations yet to come. Science and technology empower humanity to flourish together.';
const en_5_2 = en_5_2_raw.trim().split(/\s+/).slice(0, 125).join(' ');

const en_5_3_raw = 'Language is the vital bridge connecting human hearts across different cultures and distant lands. Whether expressed in the sacred elegance of ancient Khmer inscriptions or the global fluency of modern English, words possess the remarkable power to educate, heal, and inspire. Learning to type fluently in multiple languages empowers us to communicate ideas with crystal clarity and effortless speed. Every keystroke represents a deliberate thought, a creative spark, and a stepping stone toward deeper international understanding. As digital technology unites our global community, let us use our voices and tools to champion peace, celebrate diversity, and build a brighter future for all humankind. Embrace the lifelong joy of learning, practicing, and creating meaningful work every single day. Together, we build an interconnected world filled with hope.';
const en_5_3 = en_5_3_raw.trim().split(/\s+/).slice(0, 125).join(' ');

export const ENGLISH_CURRICULUM = [
  {
    id: 'en-level-1',
    level: 1,
    titleKm: 'កម្រិត ១៖ ជួរកណ្តាលអង់គ្លេស (Home Row)',
    titleEn: 'Level 1: Home Row (A S D F J K L ;)',
    description: 'Learn fundamental touch-typing finger positions on the Home Row (125 Words)',
    lessons: [
      {
        id: 'en-1.1',
        title: 'Lesson 1.1: Index & Middle Fingers (F, J, D, K)',
        description: 'Practice home key resting positions for index and middle fingers (125 words)',
        targetText: make125Words(en_1_1_vocab),
      },
      {
        id: 'en-1.2',
        title: 'Lesson 1.2: Ring & Pinky Fingers (S, L, A, ;)',
        description: 'Practice ring and pinky fingers on outer home row keys (125 words)',
        targetText: make125Words(en_1_2_vocab),
      },
      {
        id: 'en-1.3',
        title: 'Lesson 1.3: All Home Row Keys Combined',
        description: 'Master full home row coordination across both hands (125 words)',
        targetText: make125Words(en_1_3_vocab),
      },
    ],
  },
  {
    id: 'en-level-2',
    level: 2,
    titleKm: 'កម្រិត ២៖ ជួរលើ និងជួរក្រោម (Top & Bottom Rows)',
    titleEn: 'Level 2: Top & Bottom Rows',
    description: 'Expand your reach to QWERTY top row and ZXCVBN bottom row (125 Words)',
    lessons: [
      {
        id: 'en-2.1',
        title: 'Lesson 2.1: Top Row Vowels & Consonants',
        description: 'Reach up to E, R, T, U, I, O, P smoothly (125 words)',
        targetText: make125Words(en_2_1_vocab),
      },
      {
        id: 'en-2.2',
        title: 'Lesson 2.2: Bottom Row Consonants',
        description: 'Reach down to Z, X, C, V, B, N, M accurately (125 words)',
        targetText: make125Words(en_2_2_vocab),
      },
      {
        id: 'en-2.3',
        title: 'Lesson 2.3: Full Alphabet Pangram Drills',
        description: 'Type sentences containing every letter of the alphabet (125 words)',
        targetText: make125Words(en_2_3_vocab),
      },
    ],
  },
  {
    id: 'en-level-3',
    level: 3,
    titleKm: 'កម្រិត ៣៖ Shift អក្សរធំ និងលេខ (Capitals & Numbers)',
    titleEn: 'Level 3: Capitals, Punctuation & Numbers',
    description: 'Master Shift key capitalization, punctuation marks, and numbers (125 Words)',
    lessons: [
      {
        id: 'en-3.1',
        title: 'Lesson 3.1: Proper Nouns & Capitalization',
        description: 'Practice Left and Right Shift keys on countries and cities (125 words)',
        targetText: make125Words(en_3_1_vocab),
      },
      {
        id: 'en-3.2',
        title: 'Lesson 3.2: Punctuation Marks & Dialogue Quotes',
        description: 'Master periods, commas, exclamation points, and quotation marks (125 words)',
        targetText: make125Words(en_3_2_vocab),
      },
      {
        id: 'en-3.3',
        title: 'Lesson 3.3: Number Row & Common Symbols',
        description: 'Practice digits 0-9 and symbols ($, %, #, &, @) (125 words)',
        targetText: make125Words(en_3_3_vocab),
      },
    ],
  },
  {
    id: 'en-level-4',
    level: 4,
    titleKm: 'កម្រិត ៤៖ ល្បឿន និងពាក្យទូទៅ (Speed & Vocabulary)',
    titleEn: 'Level 4: Speed Drills & Tech Vocabulary',
    description: 'Build typing rhythm and muscle memory on high-frequency words (125 Words)',
    lessons: [
      {
        id: 'en-4.1',
        title: 'Lesson 4.1: Top 100 Most Frequent English Words',
        description: 'Drill the most common English words that make up 50% of all text (125 words)',
        targetText: make125Words(en_4_1_vocab),
      },
      {
        id: 'en-4.2',
        title: 'Lesson 4.2: Technology & Computing Vocabulary',
        description: 'Practice programming, internet, and computer engineering terms (125 words)',
        targetText: make125Words(en_4_2_vocab),
      },
    ],
  },
  {
    id: 'en-level-5',
    level: 5,
    titleKm: 'កម្រិត ៥៖ អត្ថបទពេញលេញ (Literature & Speeches)',
    titleEn: 'Level 5: Inspiring Literature & Articles',
    description: 'Type full paragraphs with natural punctuation and rhythm (125 Words)',
    lessons: [
      {
        id: 'en-5.1',
        title: 'Lesson 5.1: Inspiration & Perseverance',
        description: 'A powerful passage on courage, persistence, and continuous learning (125 words)',
        targetText: en_5_1,
      },
      {
        id: 'en-5.2',
        title: 'Lesson 5.2: Science, Discovery & Innovation',
        description: 'An inspiring article on scientific curiosity and technology (125 words)',
        targetText: en_5_2,
      },
      {
        id: 'en-5.3',
        title: 'Lesson 5.3: Language, Culture & Human Connection',
        description: 'A thoughtful reflection on language, communication, and global peace (125 words)',
        targetText: en_5_3,
      },
    ],
  },
];
