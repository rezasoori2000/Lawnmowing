import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import { localRepo } from './localRepo';
import type { Equipment } from '../types';

export const equipmentKeys = { all: ['equipment'] as const };

interface ApiEquipmentDto {
  id: number;
  name: string;
  isActive: boolean;
}

function equipmentFromApi(dto: ApiEquipmentDto): Equipment {
  return { id: String(dto.id), name: dto.name };
}

export function useEquipment() {
  return useQuery({
    queryKey: equipmentKeys.all,
    queryFn: async (): Promise<Equipment[]> => {
      try {
        const { data } = await apiClient.get<ApiEquipmentDto[]>('/equipment');
        return data.map(equipmentFromApi);
      } catch {
        return localRepo.listEquipment();
      }
    },
  });
}

export function useCreateEquipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string): Promise<Equipment> => {
      try {
        const { data } = await apiClient.post<ApiEquipmentDto>('/equipment', { name });
        return equipmentFromApi(data);
      } catch {
        return localRepo.addEquipment(name);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: equipmentKeys.all }),
  });
}
