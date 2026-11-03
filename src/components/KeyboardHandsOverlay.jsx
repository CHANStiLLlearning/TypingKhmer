import React from 'react';
import leftHandImg from '../assets/left-hand.png';
import rightHandImg from '../assets/right-hand.png';
import { FINGER_CONFIG } from '../data/khmerKeyMap.js';
import { getHandPlacement } from '../utils/handPlacement.js';

export default function KeyboardHandsOverlay({ keyPositions = {}, activeKeyInfo = null,
  preferredShiftCode = null, opacity = 0.35 }) {
  if (opacity <= 0) return null;
  const activeFinger = activeKeyInfo?.finger;
  const activeHand = activeFinger === 'thumb' ? 'right' : FINGER_CONFIG[activeFinger]?.hand;
  const targets = {};
  if (activeHand && keyPositions[activeKeyInfo.code]) {
    targets[activeHand] = { code: activeKeyInfo.code,
      finger: activeFinger === 'thumb' ? 'right-thumb' : activeFinger };
  }
  if (preferredShiftCode) {
    const hand = preferredShiftCode === 'ShiftLeft' ? 'left' : 'right';
    targets[hand] = { code: preferredShiftCode, finger: `${hand}-pinky` };
  }
  if (activeKeyInfo?.modifier === 'AltGr' && activeHand !== 'right') {
    targets.right = { code: 'AltRight', finger: 'right-thumb' };
  }
  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden" aria-hidden="true">
      {['left', 'right'].map((hand) => {
        const target = targets[hand];
        const p = getHandPlacement(hand, keyPositions, target);
        if (!p) return null;
        return (
          <React.Fragment key={hand}>
            <img src={hand === 'left' ? leftHandImg : rightHandImg} alt="" draggable={false}
              data-hand={hand} data-target-key={target?.code || ''} data-finger={target?.finger || ''}
              className="absolute select-none pointer-events-none transition-transform duration-150 motion-reduce:transition-none"
              style={{ left: 0, top: 0, width: p.width, height: p.height, opacity,
                transform: `translate(${p.left}px, ${p.top}px)`,
                filter: 'drop-shadow(0 5px 8px rgba(0,0,0,0.25))' }} />
            {target && (
              <span data-fingertip={target.finger} data-target-key={target.code}
                className="absolute rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 transition-all duration-150 motion-reduce:transition-none"
                style={{ left: p.tipX, top: p.tipY, width: 18, height: 18,
                  backgroundColor: FINGER_CONFIG[target.finger]?.color || FINGER_CONFIG.thumb.color }} />
            )}
          </React.Fragment>
        );
      })}
      {activeKeyInfo?.modifier === 'AltGr' && activeHand === 'right' && keyPositions.AltRight && (
        <span className="absolute rounded-full border-2 border-white bg-violet-500 w-4 h-4 -translate-x-1/2 -translate-y-1/2"
          style={{ left: keyPositions.AltRight.x, top: keyPositions.AltRight.y }} />
      )}
    </div>
  );
}
