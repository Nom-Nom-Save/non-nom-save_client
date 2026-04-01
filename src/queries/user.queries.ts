import { getUserInfo, updateUserProfile } from '@/api/user.api';
import { queryClient } from '@/lib/query-client';
import type { UpdateUserInput } from '@/types/user.types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const userKeys = {
  profile: () => ['user', 'profile'] as const,
};

export const useUserProfileQuery = () => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: () => getUserInfo(),
  });
};

export const useUpdateUserProfileMutation = () => {
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserInput }) =>
      updateUserProfile(userId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
};
