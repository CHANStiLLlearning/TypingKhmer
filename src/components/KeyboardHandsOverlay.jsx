import React, { useMemo } from 'react';
import { FINGER_CONFIG } from '../data/khmerKeyMap.js';

/**
 * Creates a natural 2D tapered finger silhouette connecting knuckle to fingertip
 */
function createFingerPath(bx, by, tx, ty, knuckleWidth = 32, tipWidth = 26) {
  const dx = tx - bx;
  const dy = ty - by;
  const len = Math.hypot(dx, dy) || 1;

  // Unit normal vector perpendicular to finger line
  const nx = -dy / len;
  const ny = dx / len;

  const halfKnuckle = knuckleWidth / 2;
  const halfTip = tipWidth / 2;

  // Knuckle base points
  const p1x = bx - nx * halfKnuckle;
  const p1y = by - ny * halfKnuckle;
  const p4x = bx + nx * halfKnuckle;
  const p4y = by + ny * halfKnuckle;

  // Fingertip points (prior to the rounded arc)
  const p2x = tx - nx * halfTip;
  const p2y = ty - ny * halfTip;
  const p3x = tx + nx * halfTip;
  const p3y = ty + ny * halfTip;

  return `M ${p1x.toFixed(1)} ${p1y.toFixed(1)} L ${p2x.toFixed(1)} ${p2y.toFixed(1)} A ${halfTip.toFixed(1)} ${halfTip.toFixed(1)} 0 0 1 ${p3x.toFixed(1)} ${p3y.toFixed(1)} L ${p4x.toFixed(1)} ${p4y.toFixed(1)} Z`;
}

export default function KeyboardHandsOverlay({
  keyPositions = {},
  containerDimensions = { width: 1000, height: 320 },
  activeKeyInfo = null,
  preferredShiftCode = null,
  opacity = 0.55,
  theme = 'dark',
}) {
  const isLight = theme === 'light';
  const width = containerDimensions.width || 1000;
  const height = containerDimensions.height || 320;

  // Helper to safely get center coordinates of any key, or fallback
  const getKeyCoord = (keyCode, defaultXRatio, defaultYRatio) => {
    if (keyPositions[keyCode]) {
      return {
        x: keyPositions[keyCode].x,
        y: keyPositions[keyCode].y,
        width: keyPositions[keyCode].width,
        height: keyPositions[keyCode].height,
      };
    }
    return {
      x: width * defaultXRatio,
      y: height * defaultYRatio,
      width: width * 0.065,
      height: height * 0.18,
    };
  };

  // 1. Home Key Centers (Where fingers rest by default)
  const homeA = getKeyCoord('KeyA', 0.16, 0.50);
  const homeS = getKeyCoord('KeyS', 0.23, 0.50);
  const homeD = getKeyCoord('KeyD', 0.30, 0.50);
  const homeF = getKeyCoord('KeyF', 0.37, 0.50);
  const homeSpace = getKeyCoord('Space', 0.50, 0.88);
  const homeJ = getKeyCoord('KeyJ', 0.60, 0.50);
  const homeK = getKeyCoord('KeyK', 0.67, 0.50);
  const homeL = getKeyCoord('KeyL', 0.74, 0.50);
  const homeSemi = getKeyCoord('Semicolon', 0.81, 0.50);

  // Responsive finger widths based on key size
  const keyWidth = homeA.width || 80;
  const knuckleW = Math.max(24, Math.min(36, keyWidth * 0.40));
  const tipW = Math.max(20, Math.min(30, keyWidth * 0.34));

  // 2. Active Targets: Dynamically place fingers on target keys based on the active character
  const isShiftNeeded = activeKeyInfo?.modifier === 'Shift';
  const activeCode = activeKeyInfo?.code;
  const activeFinger = activeKeyInfo?.finger;

  // Determine which finger is currently active
  const isLeftPinkyActive =
    activeFinger === 'left-pinky' || (isShiftNeeded && preferredShiftCode === 'ShiftLeft');
  const isLeftRingActive = activeFinger === 'left-ring';
  const isLeftMiddleActive = activeFinger === 'left-middle';
  const isLeftIndexActive = activeFinger === 'left-index';
  const isLeftThumbActive = activeFinger === 'thumb';

  const isRightThumbActive = activeFinger === 'thumb';
  const isRightIndexActive = activeFinger === 'right-index';
  const isRightMiddleActive = activeFinger === 'right-middle';
  const isRightRingActive = activeFinger === 'right-ring';
  const isRightPinkyActive =
    activeFinger === 'right-pinky' || (isShiftNeeded && preferredShiftCode === 'ShiftRight');

  // Fingertip Targets:
  // If finger is active, reach DIRECTLY to the target key (center coordinates).
  // Otherwise, rest in the home key center.
  const leftPinkyTarget = useMemo(() => {
    if (isShiftNeeded && preferredShiftCode === 'ShiftLeft') {
      return getKeyCoord('ShiftLeft', 0.10, 0.72);
    }
    if (activeFinger === 'left-pinky' && activeCode) {
      return getKeyCoord(activeCode, 0.16, 0.50);
    }
    return homeA;
  }, [isShiftNeeded, preferredShiftCode, activeFinger, activeCode, homeA, keyPositions]);

  const leftRingTarget = useMemo(() => {
    if (activeFinger === 'left-ring' && activeCode) {
      return getKeyCoord(activeCode, 0.23, 0.50);
    }
    return homeS;
  }, [activeFinger, activeCode, homeS, keyPositions]);

  const leftMiddleTarget = useMemo(() => {
    if (activeFinger === 'left-middle' && activeCode) {
      return getKeyCoord(activeCode, 0.30, 0.50);
    }
    return homeD;
  }, [activeFinger, activeCode, homeD, keyPositions]);

  const leftIndexTarget = useMemo(() => {
    if (activeFinger === 'left-index' && activeCode) {
      return getKeyCoord(activeCode, 0.37, 0.50);
    }
    return homeF;
  }, [activeFinger, activeCode, homeF, keyPositions]);

  const leftThumbTarget = useMemo(() => {
    const spaceOffset = homeSpace.width * 0.15;
    return { x: homeSpace.x - spaceOffset, y: homeSpace.y };
  }, [homeSpace]);

  const rightThumbTarget = useMemo(() => {
    const spaceOffset = homeSpace.width * 0.15;
    return { x: homeSpace.x + spaceOffset, y: homeSpace.y };
  }, [homeSpace]);

  const rightIndexTarget = useMemo(() => {
    if (activeFinger === 'right-index' && activeCode) {
      return getKeyCoord(activeCode, 0.60, 0.50);
    }
    return homeJ;
  }, [activeFinger, activeCode, homeJ, keyPositions]);

  const rightMiddleTarget = useMemo(() => {
    if (activeFinger === 'right-middle' && activeCode) {
      return getKeyCoord(activeCode, 0.67, 0.50);
    }
    return homeK;
  }, [activeFinger, activeCode, homeK, keyPositions]);

  const rightRingTarget = useMemo(() => {
    if (activeFinger === 'right-ring' && activeCode) {
      return getKeyCoord(activeCode, 0.74, 0.50);
    }
    return homeL;
  }, [activeFinger, activeCode, homeL, keyPositions]);

  const rightPinkyTarget = useMemo(() => {
    if (isShiftNeeded && preferredShiftCode === 'ShiftRight') {
      return getKeyCoord('ShiftRight', 0.90, 0.72);
    }
    if (activeFinger === 'right-pinky' && activeCode) {
      return getKeyCoord(activeCode, 0.81, 0.50);
    }
    return homeSemi;
  }, [isShiftNeeded, preferredShiftCode, activeFinger, activeCode, homeSemi, keyPositions]);

  // Knuckles (Base of fingers on the palm, situated naturally just below the home row)
  const keyHeight = homeA.height || 64;
  const knuckleYOffset = keyHeight * 0.65;
  const palmBaseY = Math.min(height + 30, height * 0.98);

  const leftKnuckles = {
    pinky: { x: homeA.x - 4, y: homeA.y + knuckleYOffset },
    ring: { x: homeS.x - 2, y: homeS.y + knuckleYOffset + 2 },
    middle: { x: homeD.x, y: homeD.y + knuckleYOffset + 4 },
    index: { x: homeF.x + 3, y: homeF.y + knuckleYOffset + 2 },
    thumb: { x: homeF.x + 18, y: homeF.y + knuckleYOffset + 18 },
    wristLeft: { x: homeA.x - 25, y: palmBaseY },
    wristRight: { x: homeF.x + 28, y: palmBaseY },
  };

  const rightKnuckles = {
    thumb: { x: homeJ.x - 18, y: homeJ.y + knuckleYOffset + 18 },
    index: { x: homeJ.x - 3, y: homeJ.y + knuckleYOffset + 2 },
    middle: { x: homeK.x, y: homeK.y + knuckleYOffset + 4 },
    ring: { x: homeL.x + 2, y: homeL.y + knuckleYOffset + 2 },
    pinky: { x: homeSemi.x + 4, y: homeSemi.y + knuckleYOffset },
    wristLeft: { x: homeJ.x - 28, y: palmBaseY },
    wristRight: { x: homeSemi.x + 25, y: palmBaseY },
  };

  // Color theme setup
  const defaultFill = isLight ? '#94a3b8' : '#334155';
  const defaultStroke = isLight ? '#cbd5e1' : '#475569';
  const watermarkFill = isLight ? '#475569' : '#94a3b8';

  // Smooth contoured palm SVG paths
  const leftPalmPath = `
    M ${leftKnuckles.wristLeft.x} ${leftKnuckles.wristLeft.y}
    C ${leftKnuckles.wristLeft.x - 20} ${leftKnuckles.pinky.y + 30},
      ${leftKnuckles.pinky.x - 18} ${leftKnuckles.pinky.y + 10},
      ${leftKnuckles.pinky.x} ${leftKnuckles.pinky.y}
    L ${leftKnuckles.ring.x} ${leftKnuckles.ring.y}
    L ${leftKnuckles.middle.x} ${leftKnuckles.middle.y}
    L ${leftKnuckles.index.x} ${leftKnuckles.index.y}
    L ${leftKnuckles.thumb.x} ${leftKnuckles.thumb.y}
    C ${leftKnuckles.thumb.x + 20} ${palmBaseY - 20},
      ${leftKnuckles.wristRight.x + 5} ${palmBaseY - 10},
      ${leftKnuckles.wristRight.x} ${leftKnuckles.wristRight.y}
    Z
  `;

  const rightPalmPath = `
    M ${rightKnuckles.wristRight.x} ${rightKnuckles.wristRight.y}
    C ${rightKnuckles.wristRight.x + 20} ${rightKnuckles.pinky.y + 30},
      ${rightKnuckles.pinky.x + 18} ${rightKnuckles.pinky.y + 10},
      ${rightKnuckles.pinky.x} ${rightKnuckles.pinky.y}
    L ${rightKnuckles.ring.x} ${rightKnuckles.ring.y}
    L ${rightKnuckles.middle.x} ${rightKnuckles.middle.y}
    L ${rightKnuckles.index.x} ${rightKnuckles.index.y}
    L ${rightKnuckles.thumb.x} ${rightKnuckles.thumb.y}
    C ${rightKnuckles.thumb.x - 20} ${palmBaseY - 20},
      ${rightKnuckles.wristLeft.x - 5} ${palmBaseY - 10},
      ${rightKnuckles.wristLeft.x} ${rightKnuckles.wristLeft.y}
    Z
  `;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-200 overflow-hidden"
      style={{ opacity, willChange: 'opacity' }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Subtle realistic palm gradients */}
          <linearGradient id="palmGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity={isLight ? '0.25' : '0.22'} />
            <stop offset="100%" stopColor={isLight ? '#64748b' : '#1e293b'} stopOpacity="0.45" />
          </linearGradient>

          <linearGradient id="palmGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity={isLight ? '0.25' : '0.22'} />
            <stop offset="100%" stopColor={isLight ? '#64748b' : '#1e293b'} stopOpacity="0.45" />
          </linearGradient>
        </defs>

        {/* ======================================================== */}
        {/* 1. LEFT HAND (ដៃឆ្វេង)                                    */}
        {/* ======================================================== */}
        <g id="left-hand" className="transition-all duration-200">
          {/* Left Palm Base */}
          <path
            d={leftPalmPath}
            fill="url(#palmGradLeft)"
            stroke={defaultStroke}
            strokeWidth="1.5"
            strokeDasharray="4 2"
            opacity="0.65"
          />

          {/* Left Pinky -> Target key */}
          <FingerComponent
            knuckle={leftKnuckles.pinky}
            target={leftPinkyTarget}
            isActive={isLeftPinkyActive}
            fingerConfig={FINGER_CONFIG['left-pinky']}
            defaultFill={defaultFill}
            defaultStroke={defaultStroke}
            isLight={isLight}
            knuckleWidth={knuckleW * 0.88}
            tipWidth={tipW * 0.85}
          />

          {/* Left Ring -> Target key */}
          <FingerComponent
            knuckle={leftKnuckles.ring}
            target={leftRingTarget}
            isActive={isLeftRingActive}
            fingerConfig={FINGER_CONFIG['left-ring']}
            defaultFill={defaultFill}
            defaultStroke={defaultStroke}
            isLight={isLight}
            knuckleWidth={knuckleW * 0.95}
            tipWidth={tipW * 0.95}
          />

          {/* Left Middle -> Target key */}
          <FingerComponent
            knuckle={leftKnuckles.middle}
            target={leftMiddleTarget}
            isActive={isLeftMiddleActive}
            fingerConfig={FINGER_CONFIG['left-middle']}
            defaultFill={defaultFill}
            defaultStroke={defaultStroke}
            isLight={isLight}
            knuckleWidth={knuckleW}
            tipWidth={tipW}
          />

          {/* Left Index -> Target key */}
          <FingerComponent
            knuckle={leftKnuckles.index}
            target={leftIndexTarget}
            isActive={isLeftIndexActive}
            fingerConfig={FINGER_CONFIG['left-index']}
            defaultFill={defaultFill}
            defaultStroke={defaultStroke}
            isLight={isLight}
            knuckleWidth={knuckleW * 0.95}
            tipWidth={tipW * 0.95}
          />

          {/* Left Thumb -> Spacebar */}
          <FingerComponent
            knuckle={leftKnuckles.thumb}
            target={leftThumbTarget}
            isActive={isLeftThumbActive}
            fingerConfig={FINGER_CONFIG['thumb']}
            defaultFill={defaultFill}
            defaultStroke={defaultStroke}
            isLight={isLight}
            knuckleWidth={knuckleW * 1.05}
            tipWidth={tipW * 1.05}
          />
        </g>

        {/* ======================================================== */}
        {/* 2. RIGHT HAND (ដៃស្តាំ)                                   */}
        {/* ======================================================== */}
        <g id="right-hand" className="transition-all duration-200">
          {/* Right Palm Base */}
          <path
            d={rightPalmPath}
            fill="url(#palmGradRight)"
            stroke={defaultStroke}
            strokeWidth="1.5"
            strokeDasharray="4 2"
            opacity="0.65"
          />

          {/* Right Thumb -> Spacebar */}
          <FingerComponent
            knuckle={rightKnuckles.thumb}
            target={rightThumbTarget}
            isActive={isRightThumbActive}
            fingerConfig={FINGER_CONFIG['thumb']}
            defaultFill={defaultFill}
            defaultStroke={defaultStroke}
            isLight={isLight}
            knuckleWidth={knuckleW * 1.05}
            tipWidth={tipW * 1.05}
          />

          {/* Right Index -> Target key */}
          <FingerComponent
            knuckle={rightKnuckles.index}
            target={rightIndexTarget}
            isActive={isRightIndexActive}
            fingerConfig={FINGER_CONFIG['right-index']}
            defaultFill={defaultFill}
            defaultStroke={defaultStroke}
            isLight={isLight}
            knuckleWidth={knuckleW * 0.95}
            tipWidth={tipW * 0.95}
          />

          {/* Right Middle -> Target key */}
          <FingerComponent
            knuckle={rightKnuckles.middle}
            target={rightMiddleTarget}
            isActive={isRightMiddleActive}
            fingerConfig={FINGER_CONFIG['right-middle']}
            defaultFill={defaultFill}
            defaultStroke={defaultStroke}
            isLight={isLight}
            knuckleWidth={knuckleW}
            tipWidth={tipW}
          />

          {/* Right Ring -> Target key */}
          <FingerComponent
            knuckle={rightKnuckles.ring}
            target={rightRingTarget}
            isActive={isRightRingActive}
            fingerConfig={FINGER_CONFIG['right-ring']}
            defaultFill={defaultFill}
            defaultStroke={defaultStroke}
            isLight={isLight}
            knuckleWidth={knuckleW * 0.95}
            tipWidth={tipW * 0.95}
          />

          {/* Right Pinky -> Target key */}
          <FingerComponent
            knuckle={rightKnuckles.pinky}
            target={rightPinkyTarget}
            isActive={isRightPinkyActive}
            fingerConfig={FINGER_CONFIG['right-pinky']}
            defaultFill={defaultFill}
            defaultStroke={defaultStroke}
            isLight={isLight}
            knuckleWidth={knuckleW * 0.88}
            tipWidth={tipW * 0.85}
          />
        </g>
      </svg>
    </div>
  );
}

/**
 * Individual Finger SVG Component with dynamic position and active pulse effects
 */
function FingerComponent({
  knuckle,
  target,
  isActive,
  fingerConfig,
  defaultFill,
  defaultStroke,
  isLight,
  knuckleWidth = 32,
  tipWidth = 26,
}) {
  const fingerPath = useMemo(() => {
    return createFingerPath(knuckle.x, knuckle.y, target.x, target.y, knuckleWidth, tipWidth);
  }, [knuckle.x, knuckle.y, target.x, target.y, knuckleWidth, tipWidth]);

  const color = fingerConfig.color;
  const padRadius = tipWidth * 0.55;

  return (
    <g className="transition-all duration-200">
      {/* 1. Finger Body Silhouette */}
      <path
        d={fingerPath}
        fill={isActive ? color : defaultFill}
        fillOpacity={isActive ? 0.85 : 0.28}
        stroke={isActive ? '#ffffff' : defaultStroke}
        strokeWidth={isActive ? 2.5 : 1.2}
        className="transition-all duration-150"
      />

      {/* 2. Fingertip Resting or Active Spotlight */}
      {isActive ? (
        <g className="transition-all duration-150">
          {/* Animated Radial Pulse Ripples on the Target Key */}
          <circle
            cx={target.x}
            cy={target.y}
            r={padRadius * 1.8}
            fill="none"
            stroke={color}
            strokeWidth="3"
            opacity="0.9"
            className="animate-ping"
          />
          <circle
            cx={target.x}
            cy={target.y}
            r={padRadius * 1.3}
            fill={color}
            fillOpacity="0.45"
            stroke="#ffffff"
            strokeWidth="2"
          />

          {/* Direct Fingertip Pad sitting directly in the center of the Key */}
          <circle
            cx={target.x}
            cy={target.y}
            r={padRadius}
            fill={color}
            stroke="#ffffff"
            strokeWidth="2.5"
          />
          <circle cx={target.x} cy={target.y} r={padRadius * 0.35} fill="#ffffff" />
        </g>
      ) : (
        /* Resting Fingertip Pad directly over Home Key */
        <circle
          cx={target.x}
          cy={target.y}
          r={padRadius * 0.7}
          fill={isLight ? '#64748b' : '#1e293b'}
          fillOpacity="0.4"
          stroke={isLight ? '#cbd5e1' : '#475569'}
          strokeWidth="1"
        />
      )}
    </g>
  );
}
