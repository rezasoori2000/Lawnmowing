import { buildFrequency } from '../constants/frequencies';
import type { Frequency, FrequencyPreset, LawnArea, MowDirection, MowHeight, MowRecord } from '../types';

/**
 * The .NET API serialises its enums as their underlying integer ordinals
 * (no JsonStringEnumConverter is configured). These arrays are ordered to
 * exactly match the C# enum definitions in TurfOps.Domain.Enums, so the
 * array index *is* the wire value - keep them in sync with the API if either
 * side's enum ordering ever changes.
 */
const API_MOW_HEIGHTS: MowHeight[] = [
  '15-20', '20-25', '25-30', '30-35', '35-40',
  '40-45', '45-50', '50-55', '55-60', '60-65', '65+',
];

const API_DIRECTIONS: MowDirection[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

const API_FREQUENCY_PRESETS: FrequencyPreset[] = ['7-10', '10-14', '14-21', '21-25', 'custom'];

export function mowHeightFromApi(value: number): MowHeight {
  return API_MOW_HEIGHTS[value] ?? API_MOW_HEIGHTS[0];
}

export function mowHeightToApi(value: MowHeight): number {
  const index = API_MOW_HEIGHTS.indexOf(value);
  return index === -1 ? 0 : index;
}

export function directionFromApi(value: number): MowDirection {
  return API_DIRECTIONS[value] ?? API_DIRECTIONS[0];
}

export function directionToApi(value: MowDirection): number {
  const index = API_DIRECTIONS.indexOf(value);
  return index === -1 ? 0 : index;
}

export function frequencyFromApi(defaultFrequency: number, customFrequencyDays: number | null | undefined): Frequency {
  const preset = API_FREQUENCY_PRESETS[defaultFrequency] ?? API_FREQUENCY_PRESETS[0];
  return buildFrequency(preset, customFrequencyDays ?? undefined);
}

export function frequencyToApi(frequency: Frequency): { defaultFrequency: number; customFrequencyDays?: number } {
  const index = API_FREQUENCY_PRESETS.indexOf(frequency.preset);
  return {
    defaultFrequency: index === -1 ? 0 : index,
    customFrequencyDays: frequency.preset === 'custom' ? frequency.customDays : undefined,
  };
}

/** Trims a .NET `DateTime` ISO string (e.g. "2026-09-14T00:00:00") down to yyyy-MM-dd. */
export function apiDateToIso(value: string): string {
  return value.slice(0, 10);
}

export interface ApiLawnAreaDto {
  id: number;
  name: string;
  defaultMowHeight: number;
  defaultFrequency: number;
  customFrequencyDays?: number | null;
  notes?: string | null;
  isActive: boolean;
  createdAt: string;
}

export function lawnAreaFromApi(dto: ApiLawnAreaDto): LawnArea {
  return {
    id: String(dto.id),
    name: dto.name,
    frequency: frequencyFromApi(dto.defaultFrequency, dto.customFrequencyDays),
    defaultMowHeight: mowHeightFromApi(dto.defaultMowHeight),
    notes: dto.notes ?? undefined,
    // Not provided by /lawn-areas - enriched client-side from mow records
    // (see useLawnAreasWithLastMowed) so the existing due/overdue maths in
    // utils/dueDate.ts can keep working unchanged.
    lastMowedDate: undefined,
    createdAt: dto.createdAt,
  };
}

export interface ApiMowRecordDto {
  id: number;
  lawnAreaId: number;
  lawnAreaName: string;
  date: string;
  mowHeight: number;
  direction: number;
  personId: number;
  personName: string;
  equipmentId: number;
  equipmentName: string;
  notes?: string | null;
  photoUrl?: string | null;
  createdByUserId: number;
  createdByUserName: string;
  createdAt: string;
}

export interface ApiPagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export function mowRecordFromApi(dto: ApiMowRecordDto): MowRecord {
  return {
    id: String(dto.id),
    lawnAreaId: String(dto.lawnAreaId),
    date: apiDateToIso(dto.date),
    mowHeight: mowHeightFromApi(dto.mowHeight),
    direction: directionFromApi(dto.direction),
    personId: String(dto.personId),
    equipmentId: String(dto.equipmentId),
    notes: dto.notes ?? undefined,
    photoUri: dto.photoUrl ?? undefined,
    loggedByUserId: dto.createdByUserId != null ? String(dto.createdByUserId) : undefined,
    createdAt: dto.createdAt,
  };
}
