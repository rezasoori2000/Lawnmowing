import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import { localRepo } from './localRepo';
import type { Person } from '../types';

export const peopleKeys = { all: ['people'] as const };

interface ApiPersonDto {
  id: number;
  name: string;
  isActive: boolean;
}

function personFromApi(dto: ApiPersonDto): Person {
  return { id: String(dto.id), name: dto.name };
}

export function usePeople() {
  return useQuery({
    queryKey: peopleKeys.all,
    queryFn: async (): Promise<Person[]> => {
      try {
        const { data } = await apiClient.get<ApiPersonDto[]>('/people');
        return data.map(personFromApi);
      } catch {
        return localRepo.listPeople();
      }
    },
  });
}

export function useCreatePerson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string): Promise<Person> => {
      try {
        const { data } = await apiClient.post<ApiPersonDto>('/people', { name });
        return personFromApi(data);
      } catch {
        return localRepo.addPerson(name);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: peopleKeys.all }),
  });
}
