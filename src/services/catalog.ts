import { useQuery } from '@tanstack/react-query';
import { clinics, doctors, labTests } from '@/data/catalog';

// One adapter boundary for the future SANA API. No calls to the upstream Monhealth API.
export const catalogService = {
  getCatalog: async () => ({ clinics, doctors, labTests }),
};
export const useCatalog = () =>
  useQuery({
    queryKey: ['catalog', 'demo'],
    queryFn: catalogService.getCatalog,
    staleTime: Infinity,
  });
