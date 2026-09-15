import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import { localRepo } from './localRepo';
import { lawnAreaFromApi, frequencyToApi, mowHeightToApi, type ApiLawnAreaDto } from './mappers';
import { mowRecordKeys, fetchMowRecords } from './mowRecords';
import type { LawnArea } from '../types';

export const lawnAreaKeys = {
  all: ['lawn-areas'] as const,
  detail: (id: string) => ['lawn-areas', id] as const,
};

async function fetchLawnAreas(): Promise<LawnArea[]> {
  try {
    const { data } = await apiClient.get<ApiLawnAreaDto[]>('/lawn-areas');
    return data.map(lawnAreaFromApi);
  } catch {
    // API not reachable yet - fall back to local seed/demo data so the
    // screens still render something useful during development.
    return localRepo.listLawnAreas();
  }
}

export function useLawnAreas() {
  return useQuery({ queryKey: lawnAreaKeys.all, queryFn: fetchLawnAreas });
}

/**
 * Lawn areas enriched with `lastMowedDate` computed from the mow records list,
 * since the /lawn-areas endpoint itself doesn't include it. This is what
 * feeds the due/overdue maths in utils/dueDate.ts.
 */
export function useLawnAreasWithLastMowed() {
  return useQuery({
    queryKey: [...lawnAreaKeys.all, 'with-last-mowed'],
    queryFn: async (): Promise<LawnArea[]> => {
      const [areas, records] = await Promise.all([fetchLawnAreas(), fetchMowRecords()]);
      const lastMowedByArea = new Map<string, string>();
      for (const record of records) {
        const current = lastMowedByArea.get(record.lawnAreaId);
        if (!current || record.date > current) {
          lastMowedByArea.set(record.lawnAreaId, record.date);
        }
      }
      return areas.map(area => ({
        ...area,
        lastMowedDate: area.lastMowedDate ?? lastMowedByArea.get(area.id),
      }));
    },
  });
}

export function useLawnArea(id: string | undefined) {
  return useQuery({
    queryKey: lawnAreaKeys.detail(id ?? ''),
    queryFn: async () => {
      if (!id) {return undefined;}
      try {
        const { data } = await apiClient.get<ApiLawnAreaDto>(`/lawn-areas/${id}`);
        return lawnAreaFromApi(data);
      } catch {
        return localRepo.getLawnArea(id);
      }
    },
    enabled: !!id,
  });
}

export interface CreateLawnAreaInput {
  name: string;
  frequency: LawnArea['frequency'];
  defaultMowHeight: LawnArea['defaultMowHeight'];
  notes?: string;
}

export function useCreateLawnArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateLawnAreaInput): Promise<LawnArea> => {
      try {
        const { data } = await apiClient.post<ApiLawnAreaDto>('/lawn-areas', {
          name: input.name,
          defaultMowHeight: mowHeightToApi(input.defaultMowHeight),
          notes: input.notes,
          ...frequencyToApi(input.frequency),
        });
        return lawnAreaFromApi(data);
      } catch {
        return localRepo.addLawnArea(input);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lawnAreaKeys.all });
      queryClient.invalidateQueries({ queryKey: mowRecordKeys.all });
    },
  });
}
