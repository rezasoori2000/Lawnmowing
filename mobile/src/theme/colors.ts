export const colors = {
  background: '#1d2414',
  backgroundDeep: '#0f150a',
  surface: 'rgba(18, 26, 12, 0.5)',
  surfaceStrong: 'rgba(61, 71, 43, 0.62)',
  border: 'rgba(240, 250, 225, 0.12)',
  textPrimary: '#f0f4e8',
  textSecondary: '#c3cdb2',
  textInverse: '#f5ead8',
  primary: '#c67139',
  primaryPressed: '#b2622d',
  primaryDark: '#8a4e26',
  primaryLight: '#f4bf96',
  accent: '#ccdbb2',
  danger: '#e5877e',

  // Due/overdue status colors (also used for lawn-area status badges/chips).
  statusOk: '#d6e2bd', // soft green - not due yet
  statusOkBg: 'rgba(174, 191, 146, 0.28)',
  statusDueSoon: '#e6ecd8', // pale cream - due within the next couple of days
  statusDueSoonBg: 'rgba(240, 250, 225, 0.15)',
  statusDue: '#e6ecd8', // pale cream - due today / this week
  statusDueBg: 'rgba(240, 250, 225, 0.15)',
  statusOverdue: '#f4bf96', // terracotta - overdue
  statusOverdueBg: 'rgba(214, 127, 72, 0.3)',
} as const;

export type ColorToken = keyof typeof colors;
