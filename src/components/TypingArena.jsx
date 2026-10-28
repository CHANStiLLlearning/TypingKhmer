import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  tokenizeLessonText,
  validateKeystroke,
  calculateWPM,
  calculateAccuracy,
} from '../utils/khmerTextEngine.js';
import { FINGER_CONFIG } from '../data/khmerKeyMap.js';
import { RotateCcw, Sparkles } from 'lucide-react';

export default function TypingArena({
  lesson,
  onComplete,
  onActiveKeyChange,
  onKeyPress,
  language = 'km',
}) {
  // Tokenize lesson into words with individual keystroke breakdowns
  const words = useMemo(() => {
    return tokenizeLessonText(lesson.targetText, language);
  }, [lesson.targetText, language]);

  // Flatten all strokes across the lesson for global metrics
  const allStrokes = useMemo(() => {
    return words.flatMap((w) => w.strokes);
  }, [words]);

  // Typing state
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [recentStatus, setRecentStatus] = useState(null); // 'correct' | 'wrong'
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);

  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const textContainerRef = useRef(null);
  const activeWordRef = useRef(null);
  const statusTimeoutRef = useRef(null);
  const elapsedSecondsRef = useRef(0);
  const handleKeyDownRef = useRef(null);

  // Keep elapsedSecondsRef in sync with elapsedSeconds
  useEffect(() => {
    elapsedSecondsRef.current = elapsedSeconds;
  }, [elapsedSeconds]);

  // Active stroke
  const currentStroke = allStrokes[currentStrokeIndex] || null;

  // Active word index
  const activeWordIndex = useMemo(() => {
    const idx = words.findIndex(
      (w) => currentStrokeIndex >= w.startIndex && currentStrokeIndex < w.endIndex
    );
    return idx !== -1 ? idx : words.length - 1;
  }, [words, currentStrokeIndex]);

  // Auto-scroll single-line text container to keep active word centered with overflow-hidden
  useEffect(() => {
    if (activeWordRef.current && textContainerRef.current) {
      const container = textContainerRef.current;
      const activeEl = activeWordRef.current;
      const activeLeft = activeEl.offsetLeft;
      const activeWidth = activeEl.offsetWidth;
      const containerWidth = container.offsetWidth;
      const targetScrollLeft = activeLeft - containerWidth / 2 + activeWidth / 2;

      const rafId = requestAnimationFrame(() => {
        if (container) {
          container.scrollTo({
            left: Math.max(0, targetScrollLeft),
            behavior: activeWordIndex === 0 ? 'auto' : 'smooth',
          });
        }
      });
      return () => cancelAnimationFrame(rafId);
    }
  }, [activeWordIndex]);

  // Sync active key with the Virtual Keyboard
  useEffect(() => {
    if (onActiveKeyChange) {
      if (currentStroke && !isFinished) {
        onActiveKeyChange({
          code: currentStroke.code,
          layer: currentStroke.layer,
          modifier: currentStroke.modifier,
          char: currentStroke.char,
          isCoeng: currentStroke.isCoeng,
          finger: currentStroke.finger,
        });
      } else {
        onActiveKeyChange(null);
      }
    }
  }, [currentStrokeIndex, currentStroke, isFinished, onActiveKeyChange]);

  // Timer lifecycle
  useEffect(() => {
    if (timerRunning && !isFinished) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((sec) => sec + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, isFinished]);

  // Reset lesson state when lesson changes
  const handleReset = useCallback(() => {
    setCurrentStrokeIndex(0);
    setTotalAttempts(0);
    setErrorCount(0);
    setElapsedSeconds(0);
    elapsedSecondsRef.current = 0;
    setTimerRunning(false);
    setIsFinished(false);
    setRecentStatus(null);
    setCombo(0);
    setMaxCombo(0);
    if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    if (textContainerRef.current) {
      textContainerRef.current.scrollTo({ left: 0, behavior: 'auto' });
    }
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  useEffect(() => {
    handleReset();
    // Auto-focus container when switching lesson
    const t = setTimeout(() => {
      containerRef.current?.focus();
    }, 50);
    return () => clearTimeout(t);
  }, [lesson, handleReset]);

  // Handle keystroke input
  const handleKeyDown = useCallback(
    (e) => {
      // 1. CRITICAL: Ignore OS key-repeat events to prevent thread starvation and freezes
      if (e.repeat) {
        return;
      }

      // Ignore standalone modifier keys
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) {
        return;
      }

      // Ignore browser shortcuts
      if (e.ctrlKey || e.metaKey) {
        return;
      }

      e.preventDefault();

      if (isFinished || !currentStroke) return;

      // Start timer on first meaningful keystroke
      if (!timerRunning) {
        setTimerRunning(true);
      }

      setTotalAttempts((prev) => prev + 1);

      const isValid = validateKeystroke(e, currentStroke);

      if (isValid) {
        // Correct keystroke!
        setRecentStatus('correct');
        if (onKeyPress) {
          onKeyPress({ code: e.code, isCorrect: true });
        }

        setCombo((c) => {
          const next = c + 1;
          if (next > maxCombo) setMaxCombo(next);
          return next;
        });

        const nextIndex = currentStrokeIndex + 1;
        setCurrentStrokeIndex(nextIndex);

        // Check if lesson complete
        if (nextIndex >= allStrokes.length) {
          setIsFinished(true);
          setTimerRunning(false);

          const finalSeconds = elapsedSecondsRef.current || 1;
          const finalWpm = calculateWPM(allStrokes.length, finalSeconds);
          const finalAcc = calculateAccuracy(allStrokes.length, totalAttempts + 1);

          onComplete({
            wpm: finalWpm,
            accuracy: finalAcc,
            errors: errorCount,
            elapsedSeconds: finalSeconds,
            maxCombo: Math.max(combo + 1, maxCombo),
            totalStrokes: allStrokes.length,
          });
        }
      } else {
        // Wrong keystroke
        setErrorCount((err) => err + 1);
        setRecentStatus('wrong');
        if (onKeyPress) {
          onKeyPress({ code: e.code, isCorrect: false });
        }
        setCombo(0);
      }

      // Clear flash animation after 150ms with debouncing
      if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
      statusTimeoutRef.current = setTimeout(() => {
        setRecentStatus(null);
      }, 150);
    },
    [
      isFinished,
      currentStroke,
      timerRunning,
      currentStrokeIndex,
      allStrokes.length,
      totalAttempts,
      errorCount,
      combo,
      maxCombo,
      onComplete,
      onKeyPress,
    ]
  );

  // Keep handleKeyDownRef updated to always invoke current closure without listener churn
  useEffect(() => {
    handleKeyDownRef.current = handleKeyDown;
  }, [handleKeyDown]);

  // Global window key listener attached ONCE on mount to eliminate listener teardown lag
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Don't intercept if user is typing in a real text input/textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        return;
      }

      // If a select or button still has residual focus, blur it immediately so typing never locks up!
      if (['SELECT', 'BUTTON'].includes(e.target.tagName)) {
        if (['Escape', 'Tab'].includes(e.key)) return;
        e.target.blur();
        containerRef.current?.focus();
      }

      handleKeyDownRef.current?.(e);
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    };
  }, []);

  // Focus container on mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  // Computed metrics
  const wpm = calculateWPM(currentStrokeIndex, elapsedSeconds);
  const accuracy = calculateAccuracy(currentStrokeIndex, totalAttempts);
  const progressPercent = Math.round((currentStrokeIndex / allStrokes.length) * 100) || 0;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={`relative w-full rounded-2xl bg-white/95 dark:bg-slate-900/90 border transition-all duration-200 outline-none p-4 sm:p-5 shadow-xl dark:shadow-2xl backdrop-blur-md ${
        recentStatus === 'correct'
          ? 'border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
          : recentStatus === 'wrong'
          ? 'border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.3)] animate-shake'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Top Bar: Live Metrics & Controls */}
      <div className="flex items-center justify-between gap-4 pb-2.5 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-6">
          {/* WPM Counter */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 font-semibold">WPM</span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-sky-600 dark:text-sky-400 tracking-tight">{wpm}</span>
          </div>

          {/* Accuracy Gauge */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Accuracy</span>
            <span
              className={`text-xl sm:text-2xl font-extrabold font-mono ${
                accuracy >= 95
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : accuracy >= 85
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {accuracy}%
            </span>
          </div>

          {/* Errors Counter */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Errors</span>
            <span className={`text-xl font-bold font-mono ${errorCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'}`}>
              {errorCount}
            </span>
          </div>

          {/* Timer */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Time</span>
            <span className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200">
              {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>

          {/* Word Progress Counter */}
          <div className="flex items-baseline gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 font-mono text-xs">
            <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-semibold">Word</span>
            <span className="font-bold text-sky-600 dark:text-sky-400">
              {activeWordIndex + 1}
              <span className="text-slate-400 dark:text-slate-500 font-normal">/{words.length}</span>
            </span>
          </div>

          {/* Combo Badge */}
          {combo > 3 && (
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-mono font-bold animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>{combo} Streak!</span>
            </div>
          )}
        </div>

        {/* Action Button: Restart lesson */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            title="Restart lesson (Esc)"
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-150 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ============================================================ */}
      {/* 1. PRIMARY TEXT DISPLAY - 1 LINE ONLY WITH OVERFLOW HIDDEN  */}
      {/* ============================================================ */}
      <div className="relative my-4 sm:my-6 min-h-[130px] sm:min-h-[160px] lg:min-h-[180px] flex items-center overflow-hidden rounded-2xl bg-slate-50/60 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 px-2 py-4 sm:py-6 shadow-inner">
        {/* Subtle left & right gradient fade for graceful 1-line stream */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10" />

        <div
          ref={textContainerRef}
          className="w-full overflow-hidden whitespace-nowrap flex items-center gap-x-5 py-4 px-6 sm:px-14 text-3xl sm:text-4xl lg:text-[44px] leading-[2.8] tracking-wide font-khmer select-none font-medium scroll-smooth"
        >
          {words.map((word, wIdx) => {
            const isCompletedWord = wIdx < activeWordIndex;
            const isActiveWord = wIdx === activeWordIndex;
            const isUpcomingWord = wIdx > activeWordIndex;

            if (isCompletedWord) {
              return (
                <span
                  key={`w-${wIdx}`}
                  className="shrink-0 text-emerald-600/75 dark:text-emerald-400/80 font-medium transition-colors"
                >
                  {word.text}
                </span>
              );
            }

            if (isActiveWord) {
              // Calculate how many characters in active word have been typed correctly
              const strokesInWordCompleted = Math.max(0, currentStrokeIndex - word.startIndex);
              const completedCharLength = word.strokes
                .slice(0, strokesInWordCompleted)
                .reduce((sum, s) => sum + (s.rawLength || 1), 0);

              const typedPart = word.text.slice(0, completedCharLength);
              const remainingPart = word.text.slice(completedCharLength);

              return (
                <span
                  key={`w-${wIdx}`}
                  ref={activeWordRef}
                  className="shrink-0 relative inline-flex items-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-sky-100/90 dark:bg-sky-950/80 ring-2 ring-sky-500/60 dark:ring-sky-400/70 shadow-lg font-bold transition-all"
                >
                  {/* Correctly typed portion: CHANGES COLOR TO VIBRANT GREEN */}
                  {typedPart && (
                    <span className="text-emerald-600 dark:text-emerald-400 transition-colors duration-150 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
                      {typedPart}
                    </span>
                  )}

                  {/* Active pulsing cursor indicator (Monkeytype style) */}
                  <span className="inline-block w-[3.5px] h-9 sm:h-12 lg:h-14 bg-sky-500 dark:bg-sky-400 animate-pulse mx-1 rounded-full shadow-[0_0_12px_rgba(14,165,233,0.9)]" />

                  {/* Remaining untyped portion */}
                  {remainingPart && (
                    <span className="text-slate-900 dark:text-slate-100 transition-colors">
                      {remainingPart}
                    </span>
                  )}
                </span>
              );
            }

            if (isUpcomingWord) {
              return (
                <span
                  key={`w-${wIdx}`}
                  className="shrink-0 text-slate-400/80 dark:text-slate-600 font-normal transition-colors"
                >
                  {word.text}
                </span>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
}
