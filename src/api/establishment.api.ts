import { apiRequest } from '@/api/client';
import type {
  UpdateEstablishmentRequest,
  EstablishmentProfile,
  EstablishmentProfileResponse,
  UpdateEstablishmentResponse,
} from '@/types/establishment.types';

export const getEstablishmentProfile = async (): Promise<EstablishmentProfile> => {
  const data = await apiRequest<EstablishmentProfileResponse>('/establishments/profile');
  return data.establishment;
};

export const getEstablishmentById = async (
  establishmentId: string
): Promise<EstablishmentProfile> => {
  const data = await apiRequest<EstablishmentProfileResponse>(`/establishments/${establishmentId}`);
  return data.establishment;
};

export const updateEstablishmentProfile = async (
  establishmentId: string,
  data: UpdateEstablishmentRequest
): Promise<EstablishmentProfile> => {
  const response = await apiRequest<UpdateEstablishmentResponse>(
    `/establishments/${establishmentId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  );
  return response.establishment;
};
