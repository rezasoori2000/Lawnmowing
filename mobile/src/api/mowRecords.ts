import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import { localRepo } from './localRepo';
import { lawnAreaKeys } from './lawnAreas';
import {
  directionToApi,
  mowHeightToApi,
  mowRecordFromApi,
  type ApiMowRecordDto,
  type ApiPagedResult,
} from './mappers';
import type { MowRecord } from '../types';

export const mowRecordKeys = {
  all: ['mow-records'] as const,
  forLawnArea: (lawnAreaId: string) => ['mow-records', 'lawn-area', lawnAreaId] as const,
};

export async function fetchMowRecords(): Promise<MowRecord[]> {
  try {
    const { data } = await apiClient.get<ApiPagedResult<ApiMowRecordDto>>('/mow-records', {
      params: { pageSize: 500 },
    });
    return data.items.map(mowRecordFromApi);
  } catch {
    return localRepo.listMowRecords();
  }
}

export function useMowRecords() {
  return useQuery({ queryKey: mowRecordKeys.all, queryFn: fetchMowRecords });
}

export function useMowRecordsForLawnArea(lawnAreaId: string | undefined) {
  return useQuery({
    queryKey: mowRecordKeys.forLawnArea(lawnAreaId ?? ''),
    queryFn: async () => {
      if (!lawnAreaId) {return [];}
      try {
        const { data } = await apiClient.get<ApiPagedResult<ApiMowRecordDto>>('/mow-records', {
          params: { lawnAreaId, pageSize: 500 },
        });
        return data.items.map(mowRecordFromApi);
      } catch {
        return localRepo.listMowRecordsForLawnArea(lawnAreaId);
      }
    },
    enabled: !!lawnAreaId,
  });
}

export type CreateMowRecordInput = Omit<MowRecord, 'id' | 'createdAt'>;

export function useCreateMowRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateMowRecordInput): Promise<MowRecord> => {
      try {
        const { data } = await apiClient.post<ApiMowRecordDto>('/mow-records', {
          lawnAreaId: Number(input.lawnAreaId),
          date: input.date,
          mowHeight: mowHeightToApi(input.mowHeight),
          direction: directionToApi(input.direction),
          personId: Number(input.personId),
          equipmentId: Number(input.equipmentId),
          notes: input.notes,
        });
        return mowRecordFromApi(data);
      } catch {
        return localRepo.addMowRecord(input);
      }
    },
    onSuccess: (record: MowRecord) => {
      queryClient.invalidateQueries({ queryKey: mowRecordKeys.all });
      queryClient.invalidateQueries({ queryKey: mowRecordKeys.forLawnArea(record.lawnAreaId) });
      queryClient.invalidateQueries({ queryKey: lawnAreaKeys.all });
      queryClient.invalidateQueries({ queryKey: lawnAreaKeys.detail(record.lawnAreaId) });
    },
  });
}
