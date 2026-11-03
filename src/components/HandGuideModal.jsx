import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Info, Keyboard } from 'lucide-react';
import handPositionImg from '../assets/hand-position.jpg';
import { FINGER_CONFIG } from '../data/khmerKeyMap.js';

// Coordinates of fingertips on the 1024x576 hand photo (% from top-left)
export const HAND_FINGER_SPOTS = [
  // LEFT HAND
  {
    id: 'left-pinky',
    nameKm: 'កូនដៃឆ្វេង',
    nameEn: 'Left Pinky',
    hand: 'left',
    homeKey: 'A',
    homeKm: 'ស្រៈ ា / អក្សរ ាំ',
    otherKeys: 'Q, Z, 1, Tab, CapsLock, Shift ឆ្វេង',
    x: 15.6,
    y: 42.0,
    color: '#f43f5e', // Rose
  },
  {
    id: 'left-ring',
    nameKm: 'នាងដៃឆ្វេង',
    nameEn: 'Left Ring',
    hand: 'left',
    homeKey: 'S',
    homeKm: 'ស / ្ស',
    otherKeys: 'W, X, 2',
    x: 21.0,
    y: 42.0,
    color: '#f97316', // Orange
  },
  {
    id: 'left-middle',
    nameKm: 'ចង្អុលកណ្តាលឆ្វេង',
    nameEn: 'Left Middle',
    hand: 'left',
    homeKey: 'D',
    homeKm: 'ដ / ឌ',
    otherKeys: 'E, C, 3',
    x: 26.4,
    y: 42.0,
    color: '#eab308', // Yellow
  },
  {
    id: 'left-index',
    nameKm: 'ចង្អុលដៃឆ្វេង',
    nameEn: 'Left Index',
    hand: 'left',
    homeKey: 'F',
    homeKm: 'ថ / ធ',
    otherKeys: 'R, T, G, V, B, 4, 5',
    hasBump: true,
    x: 32.0,
    y: 42.5,
    color: '#10b981', // Emerald
  },
  {
    id: 'left-thumb',
    fingerKey: 'thumb',
    nameKm: 'មេដៃឆ្វេង',
    nameEn: 'Left Thumb',
    hand: 'left',
    homeKey: 'Space',
    homeKm: 'ដកឃ្លា (Spacebar)',
    otherKeys: 'Spacebar',
    x: 34.8,
    y: 67.0,
    color: '#8b5cf6', // Violet
  },

  // RIGHT HAND
  {
    id: 'right-thumb',
    fingerKey: 'thumb',
    nameKm: 'មេដៃស្តាំ',
    nameEn: 'Right Thumb',
    hand: 'right',
    homeKey: 'Space',
    homeKm: 'ដកឃ្លា (Spacebar)',
    otherKeys: 'Spacebar',
    x: 52.8,
    y: 67.0,
    color: '#8b5cf6', // Violet
  },
  {
    id: 'right-index',
    nameKm: 'ចង្អុលដៃស្តាំ',
    nameEn: 'Right Index',
    hand: 'right',
    homeKey: 'J',
    homeKm: '្ (សញ្ញាជើង) / ញ',
    otherKeys: 'U, Y, H, N, M, 6, 7',
    hasBump: true,
    x: 48.6,
    y: 42.5,
    color: '#06b6d4', // Cyan
  },
  {
    id: 'right-middle',
    nameKm: 'ចង្អុលកណ្តាលស្តាំ',
    nameEn: 'Right Middle',
    hand: 'right',
    homeKey: 'K',
    homeKm: 'ក / គ',
    otherKeys: 'I, <, ,, 8',
    x: 54.0,
    y: 42.0,
    color: '#3b82f6', // Blue
  },
  {
    id: 'right-ring',
    nameKm: 'នាងដៃស្តាំ',
    nameEn: 'Right Ring',
    hand: 'right',
    homeKey: 'L',
    homeKm: 'ល / ឡ',
    otherKeys: 'O, >, ., 9',
    x: 59.4,
    y: 42.0,
    color: '#6366f1', // Indigo
  },
  {
    id: 'right-pinky',
    nameKm: 'កូនដៃស្តាំ',
    nameEn: 'Right Pinky',
    hand: 'right',
    homeKey: ';',
    homeKm: 'ើ / ោះ',
    otherKeys: "P, ', [, ], /, -, =, Enter, Shift ស្តាំ",
    x: 64.8,
    y: 42.0,
    color: '#ec4899', // Pink
  },
];

export default function HandGuideModal({
  isOpen,
  onClose,
  activeFinger = null,
  language = 'km',
}) {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const isEn = language === 'en';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-800/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 text-xl shrink-0">
              🤲
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-khmer text-slate-900 dark:text-white leading-tight">
                {isEn ? 'Keyboard Hand Placement Guide' : 'ការណែនាំពីរបៀបដាក់ដៃលើក្តារចុច (Hand Placement Guide)'}
              </h2>
              <p className="text-xs font-khmer text-slate-500 dark:text-slate-400">
                {isEn
                  ? 'Correct touch typing posture: 8 fingers on the Home Row (A S D F - J K L ;)'
                  : 'ឥរិយាបថដាក់ម្រាមដៃទាំង ១០ លើជួរកណ្តាល (Home Row) អោយបានត្រឹមត្រូវ'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            title="បិទ (Close)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* 1. Main Realistic Image with Interactive Hotspots */}
          <div className="relative w-full rounded-2xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 shadow-xl bg-slate-950 group">
            <img
              src={handPositionImg}
              alt="Hand Placement on Keyboard"
              className="w-full h-auto object-cover block select-none"
            />

            {/* Subtle Gradient vignette overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />

            {/* Interactive Finger Hotspots */}
            {HAND_FINGER_SPOTS.map((spot) => {
              const isActive =
                activeFinger &&
                (spot.id === activeFinger || (spot.fingerKey && spot.fingerKey === activeFinger));
              const isSelected = selectedSpot?.id === spot.id;

              return (
                <div
                  key={spot.id}
                  style={{
                    left: `${spot.x}%`,
                    top: `${spot.y}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group/spot"
                  onClick={() => setSelectedSpot(spot)}
                >
                  {/* Ping animation when active */}
                  {isActive && (
                    <span
                      style={{ borderColor: spot.color }}
                      className="absolute inset-0 -m-2 rounded-full border-2 animate-ping opacity-75"
                    />
                  )}

                  {/* Fingertip Hotspot Pill / Target */}
                  <div
                    style={{
                      backgroundColor: isSelected ? spot.color : `${spot.color}cc`,
                      boxShadow: isSelected || isActive ? `0 0 16px ${spot.color}` : 'none',
                    }}
                    className={`flex items-center justify-center px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-white font-mono text-[10px] sm:text-xs font-black border border-white/90 shadow-lg transition-transform hover:scale-125 ${
                      isSelected || isActive ? 'scale-125 ring-2 ring-white' : 'scale-100'
                    }`}
                  >
                    <span>{spot.homeKey}</span>
                    {spot.hasBump && (
                      <span className="w-1 h-1 rounded-full bg-white ml-0.5 animate-pulse" title="Bump" />
                    )}
                  </div>

                  {/* Hover Floating Tooltip */}
                  <div className="absolute left-1/2 -top-10 -translate-x-1/2 hidden group-hover/spot:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/95 text-white border border-slate-700 shadow-xl text-[11px] whitespace-nowrap pointer-events-none z-30 font-khmer">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: spot.color }} />
                    <span className="font-bold">{spot.nameKm}</span>: <strong>{spot.homeKey}</strong>
                  </div>
                </div>
              );
            })}

            {/* Bottom Caption Pill */}
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-white text-[11px] sm:text-xs font-khmer">
                <span className="text-sky-400 font-bold">💡 គន្លឹះ៖</span>
                <span>ចុចលើចំណុចអក្សរនីមួយៗលើរូបភាព ដើម្បីមើលព័ត៌មានលម្អិត</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-slate-300 text-[11px] font-mono">
                <span>Home Row: A S D F - J K L ;</span>
              </div>
            </div>
          </div>

          {/* Selected Finger Details Banner (if clicked) */}
          {selectedSpot && (
            <div
              style={{ borderColor: selectedSpot.color }}
              className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border-2 flex flex-wrap items-center justify-between gap-3 animate-fade-in shadow-sm font-khmer text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2.5">
                <div
                  style={{ backgroundColor: selectedSpot.color }}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-mono font-black text-sm shadow-md"
                >
                  {selectedSpot.homeKey}
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{selectedSpot.nameKm} ({selectedSpot.nameEn})</span>
                    {selectedSpot.hasBump && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[10px] font-bold">
                        មានចំណុចប៉ោង (F/J)
                      </span>
                    )}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 text-xs">
                    គ្រាប់ចុចដើម៖ <strong>{selectedSpot.homeKey}</strong> ({selectedSpot.homeKm})
                  </div>
                </div>
              </div>

              <div className="text-slate-700 dark:text-slate-300 text-xs bg-white dark:bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                គ្រាប់ចុចទទួលខុសត្រូវ៖ <span className="font-mono font-bold text-sky-600 dark:text-sky-400">{selectedSpot.otherKeys}</span>
              </div>
            </div>
          )}

          {/* 2. Structured Two-Hand Finger Responsibility Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-khmer">
            {/* Left Hand Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2.5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-base">✋</span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isEn ? 'Left Hand (ដៃឆ្វេង)' : 'ដៃឆ្វេង (Left Hand)'}
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-auto font-mono">
                  A S D F + Space
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                {HAND_FINGER_SPOTS.filter((s) => s.hand === 'left').map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSpot(s)}
                    className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800/80 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{s.nameKm}:</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="font-mono font-black px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sky-600 dark:text-sky-400 shadow-xs">
                        {s.homeKey}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 truncate max-w-[130px]" title={s.otherKeys}>
                        ({s.otherKeys})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Hand Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2.5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-base">🤚</span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isEn ? 'Right Hand (ដៃស្តាំ)' : 'ដៃស្តាំ (Right Hand)'}
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-auto font-mono">
                  J K L ; + Space
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                {HAND_FINGER_SPOTS.filter((s) => s.hand === 'right').map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSpot(s)}
                    className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800/80 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{s.nameKm}:</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="font-mono font-black px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sky-600 dark:text-sky-400 shadow-xs">
                        {s.homeKey}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 truncate max-w-[130px]" title={s.otherKeys}>
                        ({s.otherKeys})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Golden Rules of Touch Typing for Students */}
          <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 font-khmer text-xs space-y-2">
            <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <span>វិធានមាស ៤ យ៉ាងក្នុងការវាយអក្សរដោយមិនបាច់មើលក្តារចុច (Touch Typing Rules)</span>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300 pt-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>១. ជួរកណ្តាល (Home Row)៖</strong> ដាក់ម្រាមដៃលើ A S D F និង J K L ; ជានិច្ច មុននិងក្រោយចុចអក្សរផ្សេង។
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>២. ចំណុចសម្គាល់ F និង J៖</strong> គ្រាប់ចុច F និង J មានគំនូសប៉ោង សម្រាប់អោយចង្អុលដៃស្ទាបដឹងទីតាំង។
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>៣. ហាមសម្លឹងមើលក្តារចុច៖</strong> សម្លឹងមើលតែអេក្រង់ ហាត់ប្រើការចងចាំសាច់ដុំ (Muscle Memory)។
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>៤. ឥរិយាបថដៃត្រឹមត្រូវ៖</strong> កោងម្រាមដៃបន្តិចដូចកាន់កូនបាល់ លើកកដៃកុំផ្អែកនឹងតុ ដើម្បីកុំអោយចុកដៃ។
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-[11px] font-khmer text-slate-500 dark:text-slate-400 hidden sm:block">
            ចុច [ESC] ឬចុចប៊ូតុង [យល់ព្រម] ដើម្បីត្រឡប់ទៅការអនុវត្តវាយអត្ថបទ
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-khmer font-bold text-xs sm:text-sm shadow-md shadow-sky-500/25 transition-all"
          >
            យល់ព្រម ចាប់ផ្តើមវាយ (Got it, Let's Type)
          </button>
        </div>
      </div>
    </div>
  );
}