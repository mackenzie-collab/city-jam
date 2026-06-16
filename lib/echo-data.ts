export const FM_CHANNELS = [88.0, 90.9, 93.8, 96.7, 99.6, 102.5, 105.4, 107.9];
export const MIN_FREQ = 88.0;
export const MAX_FREQ = 107.9;

export function snapToNearestChannel(freq: number): number {
  return FM_CHANNELS.reduce((prev, curr) =>
    Math.abs(curr - freq) < Math.abs(prev - freq) ? curr : prev
  );
}

export function freqToAngle(freq: number): number {
  const pct = (freq - MIN_FREQ) / (MAX_FREQ - MIN_FREQ);
  return pct * 360 - 90;
}

export function angleToFreq(angleDeg: number): number {
  const normalized = ((angleDeg + 90) % 360 + 360) % 360;
  const pct = normalized / 360;
  return MIN_FREQ + pct * (MAX_FREQ - MIN_FREQ);
}

export const BLIND_ECHO_PROMPTS = [
  "What's the first song that made you want to play music?",
  "Describe your sound in three words — no genre labels allowed.",
  "Who would you want in the room if you could jam with anyone, dead or alive?",
  "What's a riff or melody you've had stuck in your head this week?",
  "If your music were a place, where would it be?",
];

export const SESSION_DURATION_SEC = 7 * 60;
