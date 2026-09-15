import { SEED_EQUIPMENT } from '../constants/equipment';
import { buildFrequency } from '../constants/frequencies';
import { SEED_LAWN_AREA_NAMES } from '../constants/lawnAreas';
import { SEED_PEOPLE } from '../constants/people';
import type { Equipment, LawnArea, MowRecord, Person } from '../types';
import { addDays, todayIso } from '../utils/date';

/**
 * In-memory local fallback "repository" used when the real .NET API isn't
 * reachable yet (e.g. during early development). It's seeded with realistic
 * demo data so screens aren't empty, and supports the same create operations
 * the UI needs so the app is fully usable offline-first during this phase.
 *
 * This is intentionally simple (no persistence across app restarts, no sync
 * engine) - see the "Out of scope" notes in the project README for the real
 * offline-sync work planned for a later phase.
 */

let people: Person[] = [...SEED_PEOPLE];
let equipment: Equipment[] = [...SEED_EQUIPMENT];
let lawnAreas: LawnArea[] = buildSeedLawnAreas();
let mowRecords: MowRecord[] = buildSeedMowRecords(lawnAreas, people, equipment);

function buildSeedLawnAreas(): LawnArea[] {
  const frequencyCycle = ['7-10', '10-14', '14-21', '21-25'] as const;
  return SEED_LAWN_AREA_NAMES.map((name, index) => {
    const preset = frequencyCycle[index % frequencyCycle.length];
    return {
      id: `lawn-area-${index + 1}`,
      name,
      frequency: buildFrequency(preset),
      defaultMowHeight: '30-35',
      notes: undefined,
      lastMowedDate: undefined,
    } satisfies LawnArea;
  });
}

function buildSeedMowRecords(areas: LawnArea[], ppl: Person[], equip: Equipment[]): MowRecord[] {
  const today = todayIso();
  const records: MowRecord[] = [];

  // Give each lawn area a small, varied mow history so the dashboard and
  // reports have something meaningful to show out of the box: some overdue,
  // some due soon, some recently mowed.
  areas.forEach((area, index) => {
    const daysAgoOptions = [1, 3, 6, 9, 13, 20, 27];
    const daysAgo = daysAgoOptions[index % daysAgoOptions.length];
    const lastMowedDate = addDays(today, -daysAgo);
    const person = ppl[index % ppl.length];
    const equipmentItem = equip[index % equip.length];

    records.push({
      id: `mow-${area.id}-1`,
      lawnAreaId: area.id,
      date: lastMowedDate,
      mowHeight: area.defaultMowHeight,
      direction: 'N',
      personId: person.id,
      equipmentId: equipmentItem.id,
      notes: undefined,
      createdAt: lastMowedDate,
    });

    // A second, older record for a bit of history depth on most areas.
    if (index % 2 === 0) {
      const olderDate = addDays(lastMowedDate, -14);
      records.push({
        id: `mow-${area.id}-2`,
        lawnAreaId: area.id,
        date: olderDate,
        mowHeight: area.defaultMowHeight,
        direction: 'E',
        personId: ppl[(index + 1) % ppl.length].id,
        equipmentId: equip[(index + 1) % equip.length].id,
        notes: undefined,
        createdAt: olderDate,
      });
    }

    area.lastMowedDate = lastMowedDate;
  });

  return records;
}

function recomputeLastMowedDate(lawnAreaId: string) {
  const areaRecords = mowRecords
    .filter(r => r.lawnAreaId === lawnAreaId)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const area = lawnAreas.find(a => a.id === lawnAreaId);
  if (area) {
    area.lastMowedDate = areaRecords[0]?.date ?? undefined;
  }
}

let idCounter = 1000;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export const localRepo = {
  // --- People ---
  listPeople(): Person[] {
    return people;
  },
  addPerson(name: string): Person {
    const person: Person = { id: nextId('person'), name };
    people = [...people, person];
    return person;
  },

  // --- Equipment ---
  listEquipment(): Equipment[] {
    return equipment;
  },
  addEquipment(name: string): Equipment {
    const item: Equipment = { id: nextId('equip'), name };
    equipment = [...equipment, item];
    return item;
  },

  // --- Lawn areas ---
  listLawnAreas(): LawnArea[] {
    return lawnAreas;
  },
  getLawnArea(id: string): LawnArea | undefined {
    return lawnAreas.find(a => a.id === id);
  },
  addLawnArea(input: Omit<LawnArea, 'id'>): LawnArea {
    const area: LawnArea = { ...input, id: nextId('lawn-area') };
    lawnAreas = [...lawnAreas, area];
    return area;
  },

  // --- Mow records ---
  listMowRecords(): MowRecord[] {
    return [...mowRecords].sort((a, b) => (a.date < b.date ? 1 : -1));
  },
  listMowRecordsForLawnArea(lawnAreaId: string): MowRecord[] {
    return this.listMowRecords().filter(r => r.lawnAreaId === lawnAreaId);
  },
  addMowRecord(input: Omit<MowRecord, 'id'>): MowRecord {
    const record: MowRecord = { ...input, id: nextId('mow') };
    mowRecords = [...mowRecords, record];
    recomputeLastMowedDate(record.lawnAreaId);
    return record;
  },
};
