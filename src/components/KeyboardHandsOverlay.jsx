import React from 'react';
import leftHandImg from '../assets/left-hand.png';
import rightHandImg from '../assets/right-hand.png';

/**
 * Real Transparent Hands Overlay mapped with exact mathematical precision to Home Row keys:
 * Left Hand:
 *   - Pinky  -> Key A (ស្រៈ ា)
 *   - Ring   -> Key S (ស)
 *   - Middle -> Key D (ដ)
 *   - Index  -> Key F (ថ)
 *   - Thumb  -> Spacebar (ដកឃ្លា)
 *
 * Right Hand:
 *   - Thumb  -> Spacebar (ដកឃ្លា)
 *   - Index  -> Key J (្ ជើង)
 *   - Middle -> Key K (ក)
 *   - Ring   -> Key L (ល)
 *   - Pinky  -> Semicolon (ើ)
 */
export default function KeyboardHandsOverlay({
  keyPositions = {},
  containerDimensions = { width: 1000, height: 320 },
  activeKeyInfo = null,
  opacity = 0.35,
  theme = 'dark',
}) {
  if (opacity <= 0) return null;

  const width = containerDimensions.width || 1000;
  const height = containerDimensions.height || 320;

  // Safe fallback coordinates before keyPositions are measured
  const keyA = keyPositions['KeyA'] || { x: width * 0.155, y: height * 0.50, width: width * 0.065, height: height * 0.18, top: height * 0.41 };
  const keyF = keyPositions['KeyF'] || { x: width * 0.355, y: height * 0.50, width: width * 0.065, height: height * 0.18, top: height * 0.41 };
  const keyJ = keyPositions['KeyJ'] || { x: width * 0.560, y: height * 0.50, width: width * 0.065, height: height * 0.18, top: height * 0.41 };
  const keySemi = keyPositions['Semicolon'] || { x: width * 0.760, y: height * 0.50, width: width * 0.065, height: height * 0.18, top: height * 0.41 };

  // Calculate top of Home Row keys (Row 2: A S D F / J K L ;)
  const keyATop = keyA.top !== undefined ? keyA.top : (keyA.y - (keyA.height || 60) / 2);
  const keyJTop = keyJ.top !== undefined ? keyJ.top : (keyJ.y - (keyJ.height || 60) / 2);
  const keyHeight = keyA.height || 60;
  // Fingertip landing offset inside Home Row keycaps:
  // Fingers must rest inside Home Row (Row 2: A S D F and J K L ;) without going up into Row 1 (Q W E R / U I O P)
  const homeRowOffsetTop = keyHeight * 0.14;

  // =========================================================================
  // 1. LEFT HAND EXACT ALIGNMENT (ដៃឆ្វេង):
  //    Pinky ratio = 0.267 -> lands directly on Key A center (ស្រៈ ា)
  //    Ring ratio  = 0.470 -> lands directly on Key S center (ស)
  //    Middle ratio= 0.662 -> lands directly on Key D center (ដ)
  //    Index ratio = 0.844 -> lands directly on Key F center (ថ)
  //    Thumb ratio = 0.940 -> rests on Spacebar (ដកឃ្លា)
  //    Span between Pinky & Index = 0.844 - 0.267 = 0.577
  // =========================================================================
  const keySpanL = Math.max(80, keyF.x - keyA.x);
  const leftHandWidth = keySpanL / 0.577;
  const leftHandHeight = leftHandWidth * (503 / 468); // native aspect ratio
  const leftHandLeft = keyA.x - 0.267 * leftHandWidth;
  const leftHandTop = keyATop + homeRowOffsetTop;

  // =========================================================================
  // 2. RIGHT HAND EXACT ALIGNMENT (ដៃស្តាំ):
  //    Thumb ratio = 0.064 -> rests on Spacebar (ដកឃ្លា)
  //    Index ratio = 0.159 -> lands directly on Key J center (្ ជើង)
  //    Middle ratio= 0.340 -> lands directly on Key K center (ក)
  //    Ring ratio  = 0.531 -> lands directly on Key L center (ល)
  //    Pinky ratio = 0.722 -> lands directly on Semicolon center (ើ)
  //    Span between Index & Pinky = 0.722 - 0.159 = 0.563
  // =========================================================================
  const keySpanR = Math.max(80, keySemi.x - keyJ.x);
  const rightHandWidth = keySpanR / 0.563;
  const rightHandHeight = rightHandWidth * (502 / 471); // native aspect ratio
  const rightHandLeft = keyJ.x - 0.159 * rightHandWidth;
  const rightHandTop = keyJTop + homeRowOffsetTop;

  // Active key target highlight for typing feedback
  const activeCode = activeKeyInfo?.code;
  const activeCoord = activeCode && keyPositions[activeCode] ? keyPositions[activeCode] : null;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-20 overflow-hidden transition-opacity duration-200"
      style={{ opacity, willChange: 'opacity' }}
    >
      {/* 1. LEFT HAND OVERLAY (ដៃឆ្វេង) */}
      <img
        src={leftHandImg}
        alt="Left Hand on Keyboard"
        draggable={false}
        className="absolute object-contain select-none pointer-events-none filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] transition-all duration-75"
        style={{
          left: `${leftHandLeft}px`,
          top: `${leftHandTop}px`,
          width: `${leftHandWidth}px`,
          height: `${leftHandHeight}px`,
        }}
      />

      {/* 2. RIGHT HAND OVERLAY (ដៃស្តាំ) */}
      <img
        src={rightHandImg}
        alt="Right Hand on Keyboard"
        draggable={false}
        className="absolute object-contain select-none pointer-events-none filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] transition-all duration-75"
        style={{
          left: `${rightHandLeft}px`,
          top: `${rightHandTop}px`,
          width: `${rightHandWidth}px`,
          height: `${rightHandHeight}px`,
        }}
      />

      {/* 3. Glowing ripple pulse on the target key underneath the translucent finger */}
      {activeCoord && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: `${activeCoord.x}px`,
            top: `${activeCoord.y}px`,
          }}
        >
          <span
            className="block rounded-full border-2 border-sky-400 animate-ping opacity-90 shadow-[0_0_12px_#38bdf8]"
            style={{
              width: `${Math.min(activeCoord.width, activeCoord.height) * 0.85}px`,
              height: `${Math.min(activeCoord.width, activeCoord.height) * 0.85}px`,
            }}
          />
        </div>
      )}
    </div>
  );
}