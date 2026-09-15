import type { MowDirection, MowHeight } from '../types';

export interface Option<T extends string> {
  value: T;
  label: string;
}

export const MOW_HEIGHT_OPTIONS: Option<MowHeight>[] = [
  { value: '15-20', label: '15-20 mm' },
  { value: '20-25', label: '20-25 mm' },
  { value: '25-30', label: '25-30 mm' },
  { value: '30-35', label: '30-35 mm' },
  { value: '35-40', label: '35-40 mm' },
  { value: '40-45', label: '40-45 mm' },
  { value: '45-50', label: '45-50 mm' },
  { value: '50-55', label: '50-55 mm' },
  { value: '55-60', label: '55-60 mm' },
  { value: '60-65', label: '60-65 mm' },
  { value: '65+', label: '65+ mm' },
];

export const MOW_DIRECTION_OPTIONS: Option<MowDirection>[] = [
  { value: 'N', label: 'North' },
  { value: 'NE', label: 'North-East' },
  { value: 'E', label: 'East' },
  { value: 'SE', label: 'South-East' },
  { value: 'S', label: 'South' },
  { value: 'SW', label: 'South-West' },
  { value: 'W', label: 'West' },
  { value: 'NW', label: 'North-West' },
];
