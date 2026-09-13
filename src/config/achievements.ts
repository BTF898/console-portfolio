/* ==========================================================================
   achievements.ts — the unlockables config.
   Visitors earn achievements as they explore (open the palette, toggle the
   theme, reach the footer…). Progress shows in the footer meter and is
   saved per-browser via localStorage.

   Edit labels/hints freely. The `id`s are matched by src/scripts/achievements.ts
   — keep them stable or the saved progress won't line up. Set
   features.achievements to false in site.ts to hide the whole system.
   ========================================================================== */

export interface Achievement {
  id: string;
  label: string;
  hint: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'boot', label: 'Hello, World', hint: 'Loaded the portfolio' },
  { id: 'tour', label: 'Cartographer', hint: 'Scrolled through every section' },
  { id: 'depth', label: 'Deep Diver', hint: 'Reached the bottom of the page' },
  { id: 'palette', label: 'Commander', hint: 'Opened the ⌘K command palette' },
  { id: 'theme', label: 'Day Shift', hint: 'Switched color modes' },
  { id: 'search', label: 'Researcher', hint: 'Filtered the lab' },
  { id: 'copy', label: 'Fast Fingers', hint: 'Copied the email address' },
  { id: 'terminal', label: 'Shell Game', hint: 'Watched a full terminal cycle' },
  { id: 'konami', label: 'Cheat Code', hint: '↑ ↑ ↓ ↓ ← → ← → B A' },
  { id: 'all', label: 'Completionist', hint: 'Unlocked everything else' },
];
