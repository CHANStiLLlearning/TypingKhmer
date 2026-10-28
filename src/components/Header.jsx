import React from 'react';
import { CURRICULUM } from '../data/lessons.js';
import {
  Keyboard,
  ChevronDown,
  Sun,
  Moon,
  BookOpen,
} from 'lucide-react';

export default function Header({
  currentLesson,
  onSelectLesson,
  theme,
  onToggleTheme,
  isKeyboardVisible = true,
  onToggleKeyboard,
  language = 'km',
  onToggleLanguage,
  curriculum = CURRICULUM,
  userName = '',
  onChangeUser,
}) {
  const isEn = language === 'en';
  return (
    <header className="w-full bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-md shrink-0 transition-colors shadow-sm">
      <div className="max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* 1. Left: Brand & App Title */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/25 text-white font-bold shrink-0">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold font-khmer text-slate-900 dark:text-white tracking-wide leading-tight">
                {isEn ? 'English Typing Tutor' : 'រៀនវាយអក្សរខ្មែរ'}
              </h1>
              <span className="hidden md:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/20 text-sky-600 dark:text-sky-300 font-semibold">
                {isEn ? 'US QWERTY' : 'NiDA Standard'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden sm:block">
              {isEn ? 'Touch Typing Master (125 Words)' : 'Khmer Unicode Typing Tutor'}
            </p>
          </div>
        </div>

        {/* 2. Center: Unified Lesson Selection Hub (100% Clickable Everywhere) */}
        <div className="flex-1 max-w-xl flex items-center gap-2.5 min-w-[280px]">
          <div className="relative flex-1 group">
            {/* Real Full-Coverage Invisible Select with Instant Blur on Change */}
            <select
              value={currentLesson.id}
              onChange={(e) => {
                const selectedId = e.target.value;
                e.target.blur(); // Release focus immediately so keys type instantly!
                for (const level of curriculum) {
                  const found = level.lessons.find((l) => l.id === selectedId);
                  if (found) {
                    onSelectLesson(found);
                    break;
                  }
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              title="ជ្រើសរើសមេរៀន (Select Lesson)"
            >
              {curriculum.map((level) => (
                <optgroup
                  key={level.id}
                  label={`${level.titleKm} (${level.titleEn})`}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                >
                  {level.lessons.map((lesson) => (
                    <option
                      key={lesson.id}
                      value={lesson.id}
                      className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-1"
                    >
                      {lesson.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            {/* Custom Visual Presentation Underneath */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 group-hover:bg-slate-200/90 dark:bg-slate-800/90 dark:group-hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 group-hover:border-sky-500 dark:group-hover:border-sky-500 transition-all shadow-sm">
              <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <div className="flex-1 min-w-0 pr-6">
                <div className="text-xs sm:text-sm font-khmer font-bold text-slate-900 dark:text-slate-100 truncate">
                  {currentLesson.title}
                </div>
                <div className="text-[11px] font-khmer text-slate-500 dark:text-slate-400 truncate">
                  {currentLesson.description}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 3. Right: Single Global Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* User Profile Badge & Switcher */}
          {userName && (
            <button
              onClick={onChangeUser}
              title={
                isEn
                  ? `Logged in as ${userName} (Click to switch user)`
                  : `ឈ្មោះ៖ ${userName} (ចុចដើម្បីប្តូរឈ្មោះ)`
              }
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold font-khmer shadow-sm transition-all"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="truncate max-w-[110px] hidden sm:inline">{userName}</span>
            </button>
          )}

          {/* Language Switcher Pill: Khmer / English */}
          {onToggleLanguage && (
            <div className="flex items-center p-0.5 rounded-xl bg-slate-200/80 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold shadow-sm">
              <button
                onClick={() => onToggleLanguage('km')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                  language === 'km'
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="ប្តូរទៅរៀនវាយអក្សរខ្មែរ (Khmer Mode)"
              >
                <span>🇰🇭</span>
                <span className="font-khmer">ខ្មែរ</span>
              </button>
              <button
                onClick={() => onToggleLanguage('en')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                  language === 'en'
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Switch to English Typing Tutor"
              >
                <span>🇬🇧</span>
                <span>English</span>
              </button>
            </div>
          )}

          {/* Keyboard Toggle (Mobile & Desktop) */}
          {onToggleKeyboard && (
            <button
              onClick={onToggleKeyboard}
              title={isKeyboardVisible ? 'លាក់ក្តារចុច (Hide Keyboard)' : 'បង្ហាញក្តារចុច (Show Keyboard)'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-sm ${
                isKeyboardVisible
                  ? 'bg-sky-500/10 dark:bg-sky-500/15 border-sky-300 dark:border-sky-600/50 text-sky-700 dark:text-sky-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Keyboard className="w-4 h-4" />
              <span className="hidden sm:inline font-khmer">
                {isKeyboardVisible ? 'ក្តារចុច: បើក' : 'ក្តារចុច: បិទ'}
              </span>
            </button>
          )}

          {/* Theme Toggle (Dark / Light Mode) */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode (ប្តូរទៅ Light Mode)' : 'Switch to Dark Mode (ប្តូរទៅ Dark Mode)'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-sm text-xs font-semibold"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <span className="hidden sm:inline font-mono">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline font-mono">Dark</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
