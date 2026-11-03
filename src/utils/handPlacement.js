// Contact points in original image pixels, including each finger's vertical offset.
export const HAND_LANDMARKS = {
  left: {
    width: 468, height: 503,
    tips: { 'left-pinky': [125, 100], 'left-ring': [250, 32],
      'left-middle': [340, 20], 'left-index': [402, 47], 'left-thumb': [441, 190] },
    start: 'KeyA', end: 'KeyF', anchor: 'left-index',
  },
  right: {
    width: 471, height: 502,
    tips: { 'right-index': [65, 47], 'right-middle': [128, 20],
      'right-ring': [220, 32], 'right-pinky': [346, 100], 'right-thumb': [28, 190] },
    start: 'KeyJ', end: 'Semicolon', anchor: 'right-index',
  },
};

export function getHandPlacement(hand, keyPositions, target) {
  const model = HAND_LANDMARKS[hand];
  const start = keyPositions[model.start];
  const end = keyPositions[model.end];
  if (!start || !end) return null;
  const span = Math.abs(model.tips[`${hand}-index`][0] - model.tips[`${hand}-pinky`][0]);
  const scale = Math.abs(end.x - start.x) / span;
  const finger = target?.finger || model.anchor;
  const key = keyPositions[target?.code || (hand === 'left' ? 'KeyF' : 'KeyJ')];
  const tip = model.tips[finger];
  if (!key || !tip) return null;
  return { width: model.width * scale, height: model.height * scale,
    left: key.x - tip[0] * scale, top: key.y - tip[1] * scale,
    tipX: key.x, tipY: key.y };
}
