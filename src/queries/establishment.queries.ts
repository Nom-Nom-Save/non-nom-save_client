import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { getEstablishmentProfile, updateEstablishmentProfile } from '@/api/establishment.api';
import type { UpdateEstablishmentRequest } from '@/types/establishment.types';

export const establishmentKeys = {
  profile: () => ['establishment', 'profile'] as const,
};

export const useEstablishmentProfileQuery = () =>
  useQuery({
    queryKey: establishmentKeys.profile(),
    queryFn: () => getEstablishmentProfile(),
  });

export const useUpdateEstablishmentProfileMutation = () => {
  return useMutation({
    mutationFn: ({
      establishmentId,
      data,
    }: {
      establishmentId: string;
      data: UpdateEstablishmentRequest;
    }) => updateEstablishmentProfile(establishmentId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: establishmentKeys.profile() });
    },
  });
};
