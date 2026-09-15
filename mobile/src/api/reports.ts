import { useMemo } from 'react';
import type { CountByKey, MowRecord, ReportDateRange } from '../types';
import { useEquipment } from './equipment';
import { useLawnAreas } from './lawnAreas';
import { useMowRecords } from './mowRecords';
import { usePeople } from './people';

/**
 * Phase 1 reports are simple aggregate counts computed client-side from the
 * cached mow-record/lookup data. Structured as plain data (CountByKey[]) so a
 * charting library can be dropped in later without reshaping this layer -
 * see the Reports screen for where that would plug in.
 */

function isWithinRange(dateIso: string, range: ReportDateRange): boolean {
  return dateIso >= range.from && dateIso <= range.to;
}

function countBy(
  records: MowRecord[],
  range: ReportDateRange,
  keyOf: (r: MowRecord) => string,
  labelFor: (key: string) => string,
): CountByKey[] {
  const counts = new Map<string, number>();
  records
    .filter(r => isWithinRange(r.date, range))
    .forEach(r => {
      const key = keyOf(r);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
  return Array.from(counts.entries())
    .map(([key, count]) => ({ key, label: labelFor(key), count }))
    .sort((a, b) => b.count - a.count);
}

export function useMowReports(range: ReportDateRange) {
  const mowRecordsQuery = useMowRecords();
  const lawnAreasQuery = useLawnAreas();
  const peopleQuery = usePeople();
  const equipmentQuery = useEquipment();

  const isLoading =
    mowRecordsQuery.isLoading ||
    lawnAreasQuery.isLoading ||
    peopleQuery.isLoading ||
    equipmentQuery.isLoading;

  const data = useMemo(() => {
    const records = mowRecordsQuery.data ?? [];
    const lawnAreaNameById = new Map((lawnAreasQuery.data ?? []).map(a => [a.id, a.name]));
    const personNameById = new Map((peopleQuery.data ?? []).map(p => [p.id, p.name]));
    const equipmentNameById = new Map((equipmentQuery.data ?? []).map(e => [e.id, e.name]));

    const mowsPerLawnArea = countBy(
      records,
      range,
      r => r.lawnAreaId,
      key => lawnAreaNameById.get(key) ?? 'Unknown area',
    );
    const mowsPerPerson = countBy(
      records,
      range,
      r => r.personId,
      key => personNameById.get(key) ?? 'Unknown person',
    );
    const mowsPerEquipment = countBy(
      records,
      range,
      r => r.equipmentId,
      key => equipmentNameById.get(key) ?? 'Unknown equipment',
    );
    const totalMows = records.filter(r => isWithinRange(r.date, range)).length;

    return { mowsPerLawnArea, mowsPerPerson, mowsPerEquipment, totalMows };
  }, [
    mowRecordsQuery.data,
    lawnAreasQuery.data,
    peopleQuery.data,
    equipmentQuery.data,
    range,
  ]);

  return { ...data, isLoading };
}
