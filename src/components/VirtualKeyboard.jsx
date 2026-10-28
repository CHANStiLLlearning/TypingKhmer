import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  KHMER_KEY_MAP,
  KEYBOARD_LAYOUT_ROWS,
  FINGER_CONFIG,
} from '../data/khmerKeyMap.js';
import { ENGLISH_KEY_MAP } from '../data/englishKeyMap.js';
import KeyboardHandsOverlay from './KeyboardHandsOverlay.jsx';
import { Eye, EyeOff } from 'lucide-react';

// Proportional flex weights to make each row span exactly 100% full width
const KEY_FLEX_WEIGHTS = {
  // Row 0
  Backspace: 'flex-[1.6]',
  // Row 1
  Tab: 'flex-[1.4]',
  Backslash: 'flex-[1.2]',
  // Row 2
  CapsLock: 'flex-[1.7]',
  Enter: 'flex-[2.0]',
  // Row 3
  ShiftLeft: 'flex-[2.3]',
  ShiftRight: 'flex-[2.4]',
  // Row 4
  ControlLeft: 'flex-[1.4]',
  AltLeft: 'flex-[1.3]',
  Space: 'flex-[8.6]',
  AltRight: 'flex-[1.3]',
  ControlRight: 'flex-[1.4]',
};

export default function VirtualKeyboard({
  activeKeyInfo, // { code, layer, modifier, char, isCoeng, finger }
  lastKeyPressed, // { code, isCorrect }
  theme,
  language = 'km',
}) {
  const isEn = language === 'en';
  const keyMap = isEn ? ENGLISH_KEY_MAP : KHMER_KEY_MAP;
  const keyboardContainerRef = useRef(null);
  const activeFinger = activeKeyInfo?.finger;
  const currentFinger = activeFinger ? FINGER_CONFIG[activeFinger] : null;

  // Hands overlay visibility toggle: 0.55 (default visible) -> 0.25 (faint) -> 0 (off)
  const [handsOpacity, setHandsOpacity] = useState(0.55);

  const cycleHandsOpacity = () => {
    setHandsOpacity((prev) => {
      if (prev === 0.55) return 0.25;
      if (prev === 0.25) return 0;
      return 0.55;
    });
  };

  // Determine if shift or altGr should be highlighted
  const isShiftNeeded = activeKeyInfo?.modifier === 'Shift';
  const isAltGrNeeded = activeKeyInfo?.modifier === 'AltGr';

  // Which Shift key to highlight (Left shift if key is on right hand, Right shift if key on left hand)
  const preferredShiftCode = useMemo(() => {
    if (!isShiftNeeded) return null;
    const hand = currentFinger ? currentFinger.hand : 'right';
    return hand === 'left' ? 'ShiftRight' : 'ShiftLeft';
  }, [isShiftNeeded, currentFinger]);

  // Dynamic Key Position Measurement for Pixel-Perfect Finger Placement
  const [keyPositions, setKeyPositions] = useState({});
  const [containerDimensions, setContainerDimensions] = useState({ width: 1000, height: 320 });
  const prevDimensionsRef = useRef({ width: 0, height: 0 });

  const updateKeyPositions = useCallback(() => {
    if (!keyboardContainerRef.current) return;
    const containerRect = keyboardContainerRef.current.getBoundingClientRect();
    if (containerRect.width === 0 || containerRect.height === 0) return;

    // Skip if width and height haven't changed meaningfully to prevent ResizeObserver loop
    const prev = prevDimensionsRef.current;
    if (
      Math.abs(prev.width - containerRect.width) < 1 &&
      Math.abs(prev.height - containerRect.height) < 1 &&
      prev.width > 0
    ) {
      return;
    }
    prevDimensionsRef.current = { width: containerRect.width, height: containerRect.height };

    const keyNodes = keyboardContainerRef.current.querySelectorAll('[data-key]');
    const newPositions = {};

    keyNodes.forEach((node) => {
      const code = node.getAttribute('data-key');
      const rect = node.getBoundingClientRect();
      newPositions[code] = {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
        left: rect.left - containerRect.left,
        top: rect.top - containerRect.top,
      };
    });

    setKeyPositions(newPositions);
    setContainerDimensions({
      width: containerRect.width,
      height: containerRect.height,
    });
  }, []);

  // Measure positions on mount, activeKey change, and container resize
  useEffect(() => {
    updateKeyPositions();

    if (!keyboardContainerRef.current) return;
    const ro = new ResizeObserver(() => {
      updateKeyPositions();
    });
    ro.observe(keyboardContainerRef.current);

    window.addEventListener('resize', updateKeyPositions);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateKeyPositions);
    };
  }, [updateKeyPositions]);

  return (
    <div className="relative w-full bg-slate-200/90 dark:bg-slate-900/95 border border-slate-300/80 dark:border-slate-800/90 rounded-2xl p-2 sm:p-2.5 lg:p-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05),0_10px_25px_rgba(0,0,0,0.08)] dark:shadow-2xl backdrop-blur-md flex flex-col justify-between overflow-hidden transition-colors">
      {/* Keyboard Header / Controls */}
      <div className="flex items-center justify-between gap-3 mb-1.5 px-2 text-xs text-slate-500 dark:text-slate-400 shrink-0 z-30">
        {/* Left: Layout Title */}
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-khmer">
            {isEn ? 'ក្តារចុចអង់គ្លេស US QWERTY (English)' : 'ក្តារចុចខ្មែរ យូនីកូដ (NiDA)'}
          </span>
          {!isEn ? (
            <div className="hidden sm:flex items-center gap-2.5 text-[11px]">
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded bg-sky-500"></span> Normal
              </span>
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded bg-amber-500"></span> Shift
              </span>
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> AltGr
              </span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2.5 text-[11px]">
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded bg-sky-500"></span> Normal / Lowercase
              </span>
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded bg-amber-500"></span> Shift / Uppercase
              </span>
            </div>
          )}
        </div>

        {/* Center: Subscript Alert if needed */}
        <div className="flex items-center gap-2">
          {activeKeyInfo?.isCoeng && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-700 dark:text-purple-200 text-xs font-bold animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping"></span>
              <span>ចុច <strong>J</strong> ដាក់ជើងអក្សរ</span>
            </div>
          )}
        </div>

        {/* Right: Hands Overlay Opacity Toggle */}
        <button
          onClick={cycleHandsOpacity}
          title="ចុចដើម្បីបិទ/បើក ឬប្តូរភាពច្បាស់នៃដៃលើ Keyboard"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-700/90 border border-slate-300 dark:border-slate-700 text-xs font-khmer font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
        >
          {handsOpacity > 0 ? (
            <>
              <Eye className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>ដៃលើ Keyboard: {Math.round(handsOpacity * 100)}%</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>ដៃលើ Keyboard: បិទ</span>
            </>
          )}
        </button>
      </div>

      {/* ============================================================ */}
      {/* KEYBOARD WORKSPACE: KEYS WITH DIRECT ACCURATE HANDS OVERLAY  */}
      {/* ============================================================ */}
      <div ref={keyboardContainerRef} className="relative w-full">
        {/* TRANSLUCENT HANDS OVERLAY RESTING DIRECTLY & ACCURATELY ON KEYS */}
        <KeyboardHandsOverlay
          keyPositions={keyPositions}
          containerDimensions={containerDimensions}
          activeKeyInfo={activeKeyInfo}
          preferredShiftCode={preferredShiftCode}
          opacity={handsOpacity}
          theme={theme}
        />

        {/* 5 Rows of Keyboard Keys */}
        <div className="flex flex-col gap-1 sm:gap-1.5 w-full relative z-10">
          {KEYBOARD_LAYOUT_ROWS.map((row, rIdx) => (
            <div key={`row-${rIdx}`} className="flex items-center justify-between gap-1 sm:gap-1.5 w-full">
              {row.map((keyCode) => {
                const keyData = keyMap[keyCode];
                if (!keyData) return null;

                // Proportional flex width
                const flexClass = KEY_FLEX_WEIGHTS[keyCode] || 'flex-1';

                // Determine key state
                const isDirectTarget = activeKeyInfo?.code === keyCode;
                const isModifierTarget =
                  (keyCode === preferredShiftCode && isShiftNeeded) ||
                  (keyCode === 'AltRight' && isAltGrNeeded);

                const isTarget = isDirectTarget || isModifierTarget;

                // Flash status
                const isRecentlyPressed = lastKeyPressed?.code === keyCode;
                const isCorrectPress = isRecentlyPressed && lastKeyPressed?.isCorrect;
                const isWrongPress = isRecentlyPressed && !lastKeyPressed?.isCorrect;

                // Finger color indicator
                const fingerInfo = keyData.finger ? FINGER_CONFIG[keyData.finger] : null;

                return (
                  <div
                    key={keyCode}
                    data-key={keyCode}
                    className={`relative flex flex-col justify-between select-none rounded-xl sm:rounded-2xl text-xs transition-all duration-150 ${flexClass} min-w-0 h-16 sm:h-20 lg:h-[94px] xl:h-[102px] p-1.5 sm:p-2 lg:p-2.5 ${
                      isCorrectPress
                        ? 'bg-emerald-500 text-white border border-emerald-400 border-b-[3px] border-b-emerald-700 shadow-[0_0_20px_rgba(16,185,129,0.9)] scale-95 z-30'
                        : isWrongPress
                        ? 'bg-rose-600 text-white border border-rose-400 border-b-[3px] border-b-rose-800 shadow-[0_0_20px_rgba(244,63,94,0.9)] animate-shake z-30'
                        : isTarget
                        ? keyData.isCoengKey
                          ? 'bg-gradient-to-b from-purple-600 to-indigo-700 text-white border border-purple-300 border-b-[3px] border-b-indigo-900 shadow-[0_0_24px_rgba(168,85,247,0.9)] scale-[1.03] z-30'
                          : isModifierTarget
                          ? 'bg-gradient-to-b from-amber-500 to-orange-600 text-white border border-amber-300 border-b-[3px] border-b-orange-800 shadow-[0_0_22px_rgba(245,158,11,0.9)] scale-[1.03] z-30'
                          : 'bg-gradient-to-b from-sky-500 to-blue-600 text-white border border-sky-300 border-b-[3px] border-b-blue-800 shadow-[0_0_25px_rgba(14,165,233,0.95)] scale-[1.03] z-30'
                        : 'bg-white hover:bg-slate-50 dark:bg-slate-800/90 dark:hover:bg-slate-700/90 border border-slate-200/90 dark:border-slate-700/80 border-b-[3px] border-b-slate-300 dark:border-b-slate-950 text-slate-800 dark:text-slate-100 shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:shadow-sm'
                    }`}
                  >
                    {/* Special modifier / function keys (Shift, Backspace, Enter, Tab, Space) */}
                    {keyData.isSpecial ? (
                      <div className="flex items-center justify-center h-full font-mono text-xs sm:text-sm lg:text-base font-bold tracking-wide text-slate-700 dark:text-slate-200">
                        {keyData.label}
                      </div>
                    ) : isEn ? (
                      <>
                        {/* English Keycap: Shift symbol on top-left, Letter centered and large */}
                        <div className="flex items-center justify-between w-full leading-none">
                          <span
                            className={`font-mono text-xs sm:text-sm font-bold ${
                              isTarget && activeKeyInfo?.layer === 'shift'
                                ? 'text-white scale-110 drop-shadow'
                                : 'text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {keyData.shift?.char !== keyData.normal?.char?.toUpperCase() ? keyData.shift?.char || '' : ''}
                          </span>
                        </div>
                        <div className="flex items-center justify-center w-full my-auto leading-none">
                          <span
                            className={`font-mono text-2xl sm:text-3xl lg:text-[38px] xl:text-[44px] font-black ${
                              isTarget
                                ? 'text-white scale-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                                : 'text-slate-900 dark:text-slate-100'
                            }`}
                          >
                            {keyData.label}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Top Row: Shift Legend (Left) & AltGr Legend (Right) */}
                        <div className="flex items-center justify-between w-full leading-none">
                          {/* Shift Character - Generously Sized for Diacritics */}
                          <span
                            className={`font-khmer text-sm sm:text-base lg:text-2xl font-black leading-tight ${
                              isTarget && activeKeyInfo?.layer === 'shift'
                                ? 'text-white scale-110 drop-shadow'
                                : 'text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {keyData.shift?.char || ''}
                          </span>

                          {/* AltGr Character - Clean & Distinct */}
                          <span
                            className={`font-khmer text-xs sm:text-sm lg:text-base font-bold leading-tight ${
                              isTarget && activeKeyInfo?.layer === 'altGr'
                                ? 'text-white scale-110 drop-shadow'
                                : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {keyData.altGr?.char || ''}
                          </span>
                        </div>

                        {/* Bottom Row: Normal Character (Left) & Physical QWERTY Label (Right) */}
                        <div className="flex items-end justify-between w-full leading-none mt-auto">
                          {/* Normal Khmer Character - LARGE PROMINENT GLYPH */}
                          <span
                            className={`font-khmer text-2xl sm:text-3xl lg:text-[40px] xl:text-[46px] font-black leading-none ${
                              isTarget && activeKeyInfo?.layer === 'normal'
                                ? 'text-white scale-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                                : 'text-slate-900 dark:text-slate-100'
                            }`}
                          >
                            {keyData.normal?.char || ''}
                          </span>

                          {/* US QWERTY physical key letter */}
                          <span className="font-mono text-[10px] sm:text-xs lg:text-sm font-bold text-slate-400 dark:text-slate-500">
                            {keyData.label}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
