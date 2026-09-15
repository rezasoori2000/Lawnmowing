export const colors = {
  background: '#F5F7F5',
  surface: '#FFFFFF',
  border: '#E2E8E4',
  textPrimary: '#1B2721',
  textSecondary: '#5C6B62',
  textInverse: '#FFFFFF',
  primary: '#2E7D32',
  primaryDark: '#1B5E20',
  primaryLight: '#DCEDC8',
  accent: '#0277BD',
  danger: '#C62828',

  // Due/overdue status colors (also used for lawn-area status badges/chips).
  statusOk: '#2E7D32', // green - not due yet
  statusOkBg: '#E6F4EA',
  statusDueSoon: '#F9A825', // amber - due within the next couple of days
  statusDueSoonBg: '#FFF6E0',
  statusDue: '#EF6C00', // orange - due today / this week
  statusDueBg: '#FFEFDD',
  statusOverdue: '#C62828', // red - overdue
  statusOverdueBg: '#FCE7E7',
} as const;

export type ColorToken = keyof typeof colors;
