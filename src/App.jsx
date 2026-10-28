import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header.jsx';
import TypingArena from './components/TypingArena.jsx';
import VirtualKeyboard from './components/VirtualKeyboard.jsx';
import ResultsModal from './components/ResultsModal.jsx';
import LoginModal from './components/LoginModal.jsx';
import { CURRICULUM } from './data/lessons.js';
import { ENGLISH_CURRICULUM } from './data/englishLessons.js';

export default function App() {
  // User name authentication state (Name-only, no password)
  const [userName, setUserName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('khmer-typing-username') || '';
    }
    return '';
  });
  const [isChangingUser, setIsChangingUser] = useState(false);

  // Language mode: 'km' (Khmer NiDA) | 'en' (English US QWERTY)
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('typing-language');
      if (saved === 'en' || saved === 'km') return saved;
    }
    return 'km';
  });

  const curriculum = useMemo(() => {
    return language === 'en' ? ENGLISH_CURRICULUM : CURRICULUM;
  }, [language]);

  const allLessons = useMemo(() => {
    return curriculum.flatMap((lvl) => lvl.lessons);
  }, [curriculum]);

  const [currentLesson, setCurrentLesson] = useState(() => allLessons[0]);
  const [activeKeyInfo, setActiveKeyInfo] = useState(null);
  const [lastKeyPressed, setLastKeyPressed] = useState(null);
  const [results, setResults] = useState(null);

  // Theme state: 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('khmer-typing-theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(true);

  // Apply theme class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('khmer-typing-theme', theme);
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleToggleLanguage = useCallback((newLang) => {
    if (newLang === language) return;
    setLanguage(newLang);
    localStorage.setItem('typing-language', newLang);
    const targetCurriculum = newLang === 'en' ? ENGLISH_CURRICULUM : CURRICULUM;
    const firstLesson = targetCurriculum[0].lessons[0];
    setCurrentLesson(firstLesson);
    setActiveKeyInfo(null);
    setLastKeyPressed(null);
    setResults(null);
  }, [language]);

  const handleLessonComplete = useCallback((stats) => {
    setResults(stats);
  }, []);

  const handleRetry = useCallback(() => {
    setResults(null);
  }, []);

  const flashTimeoutRef = React.useRef(null);

  // Flash key press state on virtual keyboard with debounced clearing
  const handleKeyPress = useCallback((keyStatus) => {
    setLastKeyPressed(keyStatus);
    if (flashTimeoutRef.current) {
      clearTimeout(flashTimeoutRef.current);
    }
    flashTimeoutRef.current = setTimeout(() => {
      setLastKeyPressed(null);
    }, 150);
  }, []);

  const currentLessonIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
  const hasNextLesson = currentLessonIndex !== -1 && currentLessonIndex < allLessons.length - 1;

  const handleNextLesson = useCallback(() => {
    if (hasNextLesson) {
      setCurrentLesson(allLessons[currentLessonIndex + 1]);
      setResults(null);
    }
  }, [hasNextLesson, currentLessonIndex, allLessons]);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-sky-500/20 selection:text-sky-400 transition-colors duration-200 overflow-hidden">
      {/* 1. Header with Unified Lesson Picker, Theme controls, Language toggle */}
      <Header
        currentLesson={currentLesson}
        onSelectLesson={(lesson) => {
          setCurrentLesson(lesson);
          setResults(null);
        }}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isKeyboardVisible={isKeyboardVisible}
        onToggleKeyboard={() => setIsKeyboardVisible((v) => !v)}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        curriculum={curriculum}
        userName={userName}
        onChangeUser={() => setIsChangingUser(true)}
      />

      {/* 2. Main Full-Screen Body */}
      <main className="flex-1 w-full max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 py-3 flex flex-col gap-3 justify-start overflow-y-auto lg:overflow-hidden">
        {/* Typing Arena Engine */}
        <div className="w-full shrink-0">
          <TypingArena
            key={`${language}-${currentLesson.id}`}
            lesson={currentLesson}
            onComplete={handleLessonComplete}
            onActiveKeyChange={setActiveKeyInfo}
            onKeyPress={handleKeyPress}
            language={language}
          />
        </div>

        {/* Full-Width Virtual Keyboard with Hands Resting Directly on Keys */}
        {isKeyboardVisible ? (
          <div className="w-full shrink-0 pb-1 transition-all duration-300">
            <VirtualKeyboard
              activeKeyInfo={activeKeyInfo}
              lastKeyPressed={lastKeyPressed}
              theme={theme}
              language={language}
            />
          </div>
        ) : (
          <div className="w-full flex justify-center py-2 shrink-0">
            <button
              onClick={() => setIsKeyboardVisible(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sky-600 dark:text-sky-400 text-xs sm:text-sm font-khmer font-bold shadow-sm transition-all"
            >
              <span>⌨️</span>
              <span>{language === 'en' ? 'Show Virtual Keyboard' : 'បង្ហាញក្តារចុច (Show Virtual Keyboard)'}</span>
            </button>
          </div>
        )}
      </main>

      {/* Results Celebration Modal */}
      {results && (
        <ResultsModal
          results={results}
          lesson={currentLesson}
          onRetry={handleRetry}
          onNextLesson={handleNextLesson}
          hasNextLesson={hasNextLesson}
          language={language}
          userName={userName}
        />
      )}

      {/* Name-only Login Modal (Onboarding Gate - No password needed) */}
      {(!userName || isChangingUser) && (
        <LoginModal
          onLogin={(name) => {
            setUserName(name);
            setIsChangingUser(false);
          }}
          language={language}
        />
      )}
    </div>
  );
}
