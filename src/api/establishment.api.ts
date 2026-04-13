import { apiRequest } from '@/api/client';
import type { UpdateEstablishmentRequest, EstablishmentProfile } from '@/types/establishment.types';
import type { RawSubscription } from '@/types/subscription.types';
import { parseSubscription } from '@/utils/subscription.utils';
import { parseWorkingHours } from '@/utils/working-hours.utils';

type RawEstablishmentProfile = Omit<EstablishmentProfile, 'subscription' | 'workingHours'> & {
  subscription: RawSubscription | null;
  workingHours: string | null;
};

interface RawEstablishmentProfileResponse {
  message: string;
  establishment: RawEstablishmentProfile;
}

const parseEstablishment = (raw: RawEstablishmentProfile): EstablishmentProfile => ({
  ...raw,
  subscription: parseSubscription(raw.subscription),
  workingHours: parseWorkingHours(raw.workingHours),
});

export const getEstablishmentProfile = async (): Promise<EstablishmentProfile> => {
  const data = await apiRequest<RawEstablishmentProfileResponse>('/establishments/profile');
  return parseEstablishment(data.establishment);
};

export const getEstablishmentById = async (
  establishmentId: string
): Promise<EstablishmentProfile> => {
  const data = await apiRequest<RawEstablishmentProfileResponse>(
    `/establishments/${establishmentId}`
  );
  return parseEstablishment(data.establishment);
};

export const updateEstablishmentProfile = async (
  establishmentId: string,
  data: UpdateEstablishmentRequest
): Promise<EstablishmentProfile> => {
  const response = await apiRequest<RawEstablishmentProfileResponse>(
    `/establishments/${establishmentId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  );
  return parseEstablishment(response.establishment);
};

export const getEstablishmentsCities = async () => {
  const response = await apiRequest<{ messages: string; cities: string[] }>(
    '/establishments/cities'
  );
  return response.cities;
};
