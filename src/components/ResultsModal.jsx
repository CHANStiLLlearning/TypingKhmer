import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, ArrowRight, Award } from 'lucide-react';

export default function ResultsModal({
  results, // { wpm, accuracy, errors, elapsedSeconds, maxCombo, totalStrokes }
  lesson,
  onRetry,
  onNextLesson,
  hasNextLesson,
  language = 'km',
  userName = '',
}) {
  const isEn = language === 'en';

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  if (!results) return null;

  // Rating badge based on WPM and Accuracy
  const getRating = () => {
    if (results.accuracy >= 95 && results.wpm >= 40) {
      return {
        label: isEn ? 'Expert (ជំនាញខ្ពស់)' : 'ជំនាញខ្ពស់ (Expert)',
        color: 'text-amber-500 dark:text-amber-400 bg-amber-500/10 border-amber-500/30',
      };
    }
    if (results.accuracy >= 90 && results.wpm >= 25) {
      return {
        label: isEn ? 'Proficient (ល្អប្រសើរ)' : 'ល្អប្រសើរ (Proficient)',
        color: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/30',
      };
    }
    if (results.accuracy >= 80) {
      return {
        label: isEn ? 'Intermediate (មធ្យម)' : 'មធ្យម (Intermediate)',
        color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      };
    }
    return {
      label: isEn ? 'Practicing (ត្រូវខិតខំបន្ថែម)' : 'ត្រូវខិតខំបន្ថែម (Practicing)',
      color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30',
    };
  };

  const rating = getRating();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center transition-colors">
        {/* Trophy Header */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white shadow-xl shadow-amber-500/30 mb-4 animate-bounce">
          <Trophy className="w-9 h-9" />
        </div>

        <h2 className="text-2xl font-bold font-khmer text-slate-900 dark:text-white mb-1">
          {userName
            ? isEn
              ? `Congratulations, ${userName}!`
              : `អបអរសាទរ ${userName}! បានបញ្ចប់មេរៀន`
            : isEn
            ? 'Congratulations! Lesson Completed'
            : 'អបអរសាទរ! បានបញ្ចប់មេរៀន'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-khmer mb-6">
          {lesson.title}
        </p>

        {/* Rating Pill */}
        <div className="mb-6">
          <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-semibold ${rating.color}`}>
            <Award className="w-4 h-4" />
            <span>{rating.label}</span>
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {/* WPM */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              WPM
            </span>
            <span className="text-3xl font-extrabold font-mono text-sky-600 dark:text-sky-400">
              {results.wpm}
            </span>
          </div>

          {/* Accuracy */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Accuracy
            </span>
            <span className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              {results.accuracy}%
            </span>
          </div>

          {/* Errors */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Errors
            </span>
            <span className="text-3xl font-extrabold font-mono text-rose-600 dark:text-rose-400">
              {results.errors}
            </span>
          </div>

          {/* Time */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Time
            </span>
            <span className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-200">
              {Math.floor(results.elapsedSeconds / 60)}:{(results.elapsedSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onRetry}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-khmer text-sm font-semibold transition-all border border-slate-300 dark:border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isEn ? 'Practice Again (Retry)' : 'អនុវត្តម្តងទៀត (Retry)'}</span>
          </button>

          {hasNextLesson && (
            <button
              onClick={onNextLesson}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-khmer text-sm font-semibold shadow-lg shadow-sky-500/25 transition-all"
            >
              <span>{isEn ? 'Next Lesson' : 'មេរៀនបន្ទាប់ (Next)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
