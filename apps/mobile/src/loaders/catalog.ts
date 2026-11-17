// The twenty loaders, in the order the owner listed them, and where each one is used in the app (the Loading animations screen shows this text).
// Plain data, so a Node test can check it.

export const LOADERS = [
  { id: 'spinner-arc', name: 'Spinner Arc', usedIn: 'Every button while it works' },
  { id: 'bouncing-dots', name: 'Bouncing Dots', usedIn: 'Welcome: loading your history' },
  { id: 'pulse-rings', name: 'Pulse Rings', usedIn: 'Reading lens: the glow around the orb' },
  { id: 'indeterminate-bar', name: 'Indeterminate Bar', usedIn: 'Top of Home and History while they load' },
  { id: 'skeleton-shimmer', name: 'Skeleton Shimmer', usedIn: 'Home tiles and History rows while they load' },
  { id: 'orbit', name: 'Orbit', usedIn: 'Reading lens for symptoms' },
  { id: 'equalizer-bars', name: 'Equalizer Bars', usedIn: 'Welcome: syncing your settings' },
  { id: 'square-morph', name: 'Square Morph', usedIn: 'Welcome: preparing your dashboard' },
  { id: 'liquid-fill', name: 'Liquid Fill', usedIn: 'Reading lens for lab reports' },
  { id: 'dot-grid-wave', name: 'Dot Grid Wave', usedIn: 'Reading lens for scans' },
  { id: 'infinity-trail', name: 'Infinity Trail', usedIn: 'Reading lens: the path of the orb' },
  { id: 'flipping-square', name: 'Flipping Square', usedIn: 'This screen only (no real wait needs it yet)' },
  { id: 'gradient-ring', name: 'Gradient Ring', usedIn: 'Loading a saved analysis' },
  { id: 'typing-dots', name: 'Typing Dots', usedIn: 'Reading lens: while the answer is written' },
  { id: 'spoke-spinner', name: 'Spoke Spinner', usedIn: 'Link buttons while they work' },
  { id: 'percent-bar', name: 'Percent Bar', usedIn: 'Scan files added and report characters used' },
  { id: 'chasing-squares', name: 'Chasing Squares', usedIn: 'Pull to refresh on Home and History' },
  { id: 'text-shimmer', name: 'Text Shimmer', usedIn: 'Titles of the waiting screens' },
  { id: 'battery-charge', name: 'Battery Charge', usedIn: 'Welcome: how ready your account is' },
  { id: 'bouncing-ball', name: 'Bouncing Ball', usedIn: 'Empty lists while they load' },
] as const;

export type LoaderId = (typeof LOADERS)[number]['id'];
