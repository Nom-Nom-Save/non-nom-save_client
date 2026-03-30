import { apiRequest } from './client';
import type { UpdateUserInput, User } from '@/types/user.types';

interface GetUserInfoResponse {
  message: string;
  user: User;
}

export const getUserInfo = async () => {
  const response = await apiRequest<GetUserInfoResponse>('/users/me');
  return response.user;
};

export const updateUserProfile = async (userId: string, data: UpdateUserInput) => {
  const response = await apiRequest<GetUserInfoResponse>(`/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

  return response.user;
};
