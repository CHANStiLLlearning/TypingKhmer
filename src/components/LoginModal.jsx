import React, { useState } from 'react';
import { User, UserPlus, ArrowRight, Sparkles, Trash2, ArrowLeft, Check } from 'lucide-react';

const STORAGE_PROFILES_KEY = 'khmer-typing-profiles';
const STORAGE_CURRENT_USER_KEY = 'khmer-typing-username';

export function getStoredProfiles() {
  try {
    const raw = localStorage.getItem(STORAGE_PROFILES_KEY);
    if (!raw) {
      const oldUser = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      if (oldUser && oldUser.trim()) {
        const initial = [{ id: 'user-1', name: oldUser.trim(), createdAt: Date.now() }];
        localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(initial));
        return initial;
      }
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredProfiles(profiles) {
  try {
    localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(profiles));
  } catch {
    // LocalStorage fallback
  }
}

export default function LoginModal({ onLogin, language = 'km' }) {
  const [profiles, setProfiles] = useState(() => getStoredProfiles());
  const [mode, setMode] = useState(() => (getStoredProfiles().length > 0 ? 'select' : 'create'));
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  const isEn = language === 'en';

  const handleSelectProfile = (profile) => {
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, profile.name);
    onLogin(profile.name);
  };

  const handleCreateProfile = (e) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) {
      setError(isEn ? 'Please enter your name' : 'សូមបញ្ចូលឈ្មោះរបស់អ្នកជាមុនសិន!');
      return;
    }
    if (trimmed.length > 40) {
      setError(isEn ? 'Name is too long (max 40 chars)' : 'ឈ្មោះវែងពេកហើយ (អតិបរមា ៤០ តួ)');
      return;
    }

    const existing = profiles.find((p) => p.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      handleSelectProfile(existing);
      return;
    }

    const newProfile = {
      id: `user-${Date.now()}`,
      name: trimmed,
      createdAt: Date.now(),
    };

    const updated = [newProfile, ...profiles];
    setProfiles(updated);
    saveStoredProfiles(updated);
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, trimmed);
    onLogin(trimmed);
  };

  const handleDeleteProfile = (e, profileId) => {
    e.stopPropagation();
    const target = profiles.find((p) => p.id === profileId);
    if (!target) return;

    const confirmMsg = isEn
      ? `Are you sure you want to remove '${target.name}'?`
      : `តើអ្នកពិតជាចង់លុបឈ្មោះ «${target.name}» មែនទេ?`;

    if (window.confirm(confirmMsg)) {
      const updated = profiles.filter((p) => p.id !== profileId);
      setProfiles(updated);
      saveStoredProfiles(updated);
      if (updated.length === 0) {
        setMode('create');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in select-none">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/15 dark:bg-sky-500/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-indigo-500/15 dark:bg-indigo-500/25 rounded-full blur-2xl pointer-events-none" />

      {/* Main Expansive Login Window */}
      <div className="relative w-full max-w-2xl lg:max-w-3xl rounded-[32px] bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-2xl p-6 sm:p-10 lg:p-12 text-center overflow-hidden transition-all backdrop-blur-md">
        {/* Top Gradient Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400" />

        {/* Header: Large App Icon & Title */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-1 bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-xl shadow-sky-500/30 flex items-center justify-center shrink-0">
            <img src="/icon.png" alt="Logo" className="w-full h-full object-contain rounded-2xl" />
          </div>

          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>{isEn ? 'Welcome to Typing Master' : 'សូមស្វាគមន៍មកកាន់'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-khmer text-slate-900 dark:text-white leading-tight">
              {isEn ? 'Khmer & English Typing Tutor' : 'កម្មវិធីរៀនវាយអត្ថបទខ្មែរ យូនីកូដ'}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-khmer mt-1">
              {mode === 'select'
                ? isEn
                  ? 'Select your profile below to start typing'
                  : 'សូមជ្រើសរើសឈ្មោះរបស់អ្នកខាងក្រោមដើម្បីចូលហាត់វាយ'
                : isEn
                ? 'Enter your name to create a profile (No password required)'
                : 'សូមបញ្ចូលឈ្មោះរបស់អ្នកដើម្បីចាប់ផ្ដើម (មិនចាំបាច់ដាក់ password ទេ)'}
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MODE 1: SELECT FROM EXISTING PROFILES                    */}
        {/* ======================================================== */}
        {mode === 'select' && (
          <div className="flex flex-col gap-5">
            {/* Grid of Profiles: 2 Columns on desktop with generous spacing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[380px] overflow-y-auto pr-1.5 p-1">
              {profiles.map((profile, idx) => {
                const colors = [
                  'from-sky-500 to-blue-600',
                  'from-indigo-500 to-purple-600',
                  'from-emerald-500 to-teal-600',
                  'from-amber-500 to-orange-600',
                  'from-rose-500 to-pink-600',
                  'from-cyan-500 to-blue-500',
                ];
                const avatarColor = colors[idx % colors.length];

                return (
                  <div
                    key={profile.id}
                    onClick={() => handleSelectProfile(profile)}
                    className="group relative flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-sky-50/90 dark:bg-slate-800/70 dark:hover:bg-slate-800 border-2 border-slate-200/80 dark:border-slate-700/80 hover:border-sky-500 dark:hover:border-sky-400 cursor-pointer transition-all shadow-sm hover:shadow-md active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr ${avatarColor} text-white font-extrabold flex items-center justify-center text-lg sm:text-xl shadow-md shrink-0`}
                      >
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left min-w-0">
                        <div className="font-khmer font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 truncate transition-colors">
                          {profile.name}
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 font-khmer flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{isEn ? 'Ready to type' : 'រួចរាល់សម្រាប់ហាត់'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDeleteProfile(e, profile.id)}
                        title={isEn ? 'Delete profile' : 'លុបឈ្មោះនេះ'}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions: Add New Name */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setMode('create');
                  setNewName('');
                  setError('');
                }}
                className="w-full py-4 px-6 rounded-2xl border-2 border-dashed border-sky-400/80 dark:border-sky-500/60 hover:border-sky-500 hover:bg-sky-50/60 dark:hover:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-khmer font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm hover:shadow"
              >
                <UserPlus className="w-5 h-5" />
                <span>{isEn ? '+ Add New Typist Name' : '+ បន្ថែមឈ្មោះអ្នករៀនថ្មី'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODE 2: CREATE / ENTER A NEW NAME                        */}
        {/* ======================================================== */}
        {mode === 'create' && (
          <form onSubmit={handleCreateProfile} className="flex flex-col gap-6 mt-4 text-left max-w-xl mx-auto">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold font-khmer text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <User className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>{isEn ? 'Enter Your Name' : 'សូមបញ្ចូលឈ្មោះរបស់អ្នក'}</span>
              </label>
              <input
                type="text"
                autoFocus
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  if (error) setError('');
                }}
                placeholder={isEn ? 'e.g. John, Sokha, Dara...' : 'ឧ. ចាន់ សុខា, វិចិត្រ, ដារ៉ា...'}
                className={`w-full px-5 py-4 rounded-2xl border text-base sm:text-lg font-khmer bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all ${
                  error
                    ? 'border-rose-500 ring-4 ring-rose-500/20'
                    : 'border-slate-300 dark:border-slate-700 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20'
                }`}
              />
              {error && (
                <span className="text-xs sm:text-sm font-khmer text-rose-600 dark:text-rose-400 font-medium">
                  {error}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {profiles.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('select');
                    setError('');
                  }}
                  className="py-4 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-khmer font-bold text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{isEn ? 'Back to Profiles' : 'ត្រឡប់ក្រោយ'}</span>
                </button>
              )}

              <button
                type="submit"
                className="flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-khmer font-bold text-base sm:text-lg shadow-xl shadow-sky-500/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99]"
              >
                <span>{isEn ? 'Save & Start Typing' : 'រក្សាទុក & ចូលហាត់វាយ'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}

        {/* Bottom Feature Badges */}
        <div className="mt-8 pt-6 border-t border-slate-200/70 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs font-khmer text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>🛡️</span>
            <span>{isEn ? '100% Offline' : 'ដំណើរការ Offline ១០០%'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>👥</span>
            <span>{isEn ? 'Multi-User Profiles' : 'គាំទ្រអ្នករៀនច្រើននាក់'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🔓</span>
            <span>{isEn ? 'No password required' : 'មិនត្រូវការ Password'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
