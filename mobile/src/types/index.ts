/**
 * Shared domain types for the TurfOps mobile app.
 * These are intended to mirror the DTOs exposed by the .NET 8 Web API
 * (see /api/lawn-areas, /api/mow-records, /api/people, /api/equipment, /api/reports).
 */

/** Target mowing frequency attached to a lawn area, drives due/overdue calculations. */
export type FrequencyPreset = '7-10' | '10-14' | '14-21' | '21-25' | 'custom';

export interface Frequency {
  preset: FrequencyPreset;
  /** Inclusive lower bound in days used for due-date maths. */
  minDays: number;
  /** Inclusive upper bound in days used for due-date maths. */
  maxDays: number;
  /** Only present when preset === 'custom'. */
  customDays?: number;
}

/** Mow height/length options, in millimetres. */
export type MowHeight =
  | '15-20'
  | '20-25'
  | '25-30'
  | '30-35'
  | '35-40'
  | '40-45'
  | '45-50'
  | '50-55'
  | '55-60'
  | '60-65'
  | '65+';

/** Compass mowing direction. */
export type MowDirection = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

export interface Person {
  id: string;
  name: string;
}

export interface Equipment {
  id: string;
  name: string;
}

export interface LawnArea {
  id: string;
  name: string;
  frequency: Frequency;
  defaultMowHeight: MowHeight;
  notes?: string;
  /** ISO date string (yyyy-MM-dd) of the most recent mow, if any - typically derived
   * server-side from mow records, but kept here so the dashboard can render without
   * re-aggregating on the client when the API supplies it directly. */
  lastMowedDate?: string;
  createdAt?: string;
  updatedAt?: string;

  // Phase 2/3 extension points - intentionally not implemented in this pass:
  // machineryProfileId?: string; // service/hours profiles (Phase 2)
  // turfHistoryId?: string;      // turf/spray/irrigation history (Phase 3)
}

export interface MowRecord {
  id: string;
  lawnAreaId: string;
  date: string; // ISO date string (yyyy-MM-dd)
  mowHeight: MowHeight;
  direction: MowDirection;
  personId: string;
  equipmentId: string;
  notes?: string;
  photoUri?: string;
  loggedByUserId?: string; // the authenticated user who submitted the record
  createdAt?: string;

  // TODO (Phase 2+): jobDurationMinutes / weatherSnapshot - job timers & automatic
  // weather capture are out of scope for this pass.
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export type DueStatus = 'ok' | 'due-soon' | 'due' | 'overdue';

export interface LawnAreaDueInfo {
  lawnArea: LawnArea;
  status: DueStatus;
  /** Days until due (negative if overdue). Null when there's no mow history yet. */
  daysUntilDue: number | null;
  dueDate: string | null;
}

// --- Reports ---

export interface ReportDateRange {
  from: string; // ISO date
  to: string; // ISO date
}

export interface CountByKey {
  key: string;
  label: string;
  count: number;
}
