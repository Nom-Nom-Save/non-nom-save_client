import { apiRequest } from '@/api/client';
import type {
  CreateBoxRequest,
  UpdateBoxRequest,
  BoxResponse,
  BoxListResponse,
  CreateBoxResponse,
  UpdateBoxResponse,
  DeleteBoxResponse,
} from '@/types/box.types';

export const getBoxes = async (type?: 'Private' | 'All'): Promise<BoxResponse[]> => {
  const query = type ? `?type=${type}` : '';
  const data = await apiRequest<BoxListResponse>(`/boxes${query}`);
  return data.boxes;
};

export const createBox = async (data: CreateBoxRequest): Promise<BoxResponse> => {
  const response = await apiRequest<CreateBoxResponse>('/boxes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.box;
};

export const updateBox = async (boxId: string, data: UpdateBoxRequest): Promise<BoxResponse> => {
  const response = await apiRequest<UpdateBoxResponse>(`/boxes/${boxId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return response.box;
};

export const deleteBox = (boxId: string) =>
  apiRequest<DeleteBoxResponse>(`/boxes/${boxId}`, { method: 'DELETE' });
