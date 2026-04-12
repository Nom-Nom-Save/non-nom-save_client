import { apiRequest } from './client';
import type { UpdateUserInput, User } from '@/types/user.types';
import type { RawSubscription } from '@/types/subscription.types';
import { parseSubscription } from '@/utils/subscription.utils';

type RawUser = Omit<User, 'subscription'> & { subscription: RawSubscription | null };

interface GetUserInfoResponse {
  message: string;
  user: RawUser;
}

const parseUser = (raw: RawUser): User => ({
  ...raw,
  subscription: parseSubscription(raw.subscription),
});

export const getUserInfo = async () => {
  const response = await apiRequest<GetUserInfoResponse>('/users/me');
  return parseUser(response.user);
};

export const updateUserProfile = async (userId: string, data: UpdateUserInput) => {
  const response = await apiRequest<GetUserInfoResponse>(`/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

  return parseUser(response.user);
};
