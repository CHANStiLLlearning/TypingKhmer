import React, { useState } from 'react';
import { Maximize2, ChevronDown, ChevronUp, Sparkles, X } from 'lucide-react';
import handPositionImg from '../assets/hand-position.jpg';
import { HAND_FINGER_SPOTS } from './HandGuideModal.jsx';

export default function HandGuideInline({
  isOpen,
  onToggle,
  onOpenModal,
  activeFinger = null,
  language = 'km',
}) {
  const isEn = language === 'en';
  if (!isOpen) return null;

  return (
    <div className="w-full mb-2 p-2.5 sm:p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-300/90 dark:border-slate-800 shadow-md backdrop-blur-md transition-all animate-fade-in font-khmer">
      {/* Banner Header with Quick Controls */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-sm">🤲</span>
          <span className="font-bold text-slate-800 dark:text-slate-100">
            {isEn ? 'Home Row Hand Placement Reference' : 'រូបភាពណែនាំរបៀបដាក់ម្រាមដៃ (Home Row: A S D F - J K L ;)'}
          </span>
          <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
            {isEn ? 'Rest hands like this' : 'ដាក់ដៃតាមរូបភាពនេះ'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenModal}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/80 border border-sky-200 dark:border-sky-800 text-[11px] font-semibold text-sky-700 dark:text-sky-300 transition-colors"
            title="ពង្រីកមើលលម្អិត (Open Full Guide)"
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden sm:inline">ពង្រីកធំ</span>
          </button>
          <button
            onClick={onToggle}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="បិទ (Close)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Image with Spotlights */}
      <div className="relative w-full rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700/80 bg-slate-950 max-h-[220px] sm:max-h-[260px] flex items-center justify-center">
        <img
          src={handPositionImg}
          alt="Keyboard Hand Placement"
          className="w-full h-full object-cover object-center select-none"
        />

        {/* Dynamic Finger Hotspots on Image */}
        {HAND_FINGER_SPOTS.map((spot) => {
          const isActive =
            activeFinger &&
            (spot.id === activeFinger || (spot.fingerKey && spot.fingerKey === activeFinger));

          return (
            <div
              key={spot.id}
              style={{
                left: `${spot.x}%`,
                top: `${spot.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
            >
              {isActive && (
                <span
                  style={{ borderColor: spot.color }}
                  className="absolute inset-0 -m-2 rounded-full border-2 animate-ping opacity-90"
                />
              )}
              <div
                style={{
                  backgroundColor: isActive ? spot.color : `${spot.color}bb`,
                  boxShadow: isActive ? `0 0 14px ${spot.color}` : 'none',
                }}
                className={`flex items-center justify-center px-1.5 py-0.5 rounded-full text-white font-mono text-[9px] sm:text-[11px] font-black border border-white/90 shadow transition-transform ${
                  isActive ? 'scale-125 ring-2 ring-white' : 'scale-95'
                }`}
              >
                <span>{spot.homeKey}</span>
              </div>
            </div>
          );
        })}

        {/* Bottom Floating Tip */}
        <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between pointer-events-none">
          <div className="px-2 py-0.5 rounded-md bg-slate-950/70 backdrop-blur-sm text-[10px] sm:text-[11px] text-white">
            <span className="text-sky-400 font-bold">ដៃឆ្វេង៖</span> A S D F | <span className="text-sky-400 font-bold">ដៃស្តាំ៖</span> J K L ; | <span className="text-purple-400 font-bold">មេដៃ៖</span> Spacebar
          </div>
        </div>
      </div>
    </div>
  );
}