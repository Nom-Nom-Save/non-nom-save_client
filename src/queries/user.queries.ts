import { getUserInfo, updateUserProfile } from '@/api/user.api';
import { queryClient } from '@/lib/query-client';
import { useUserStore } from '@/store/user.store';
import type { UpdateUserInput } from '@/types/user.types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const usersKeys = {
  profile: () => ['user', 'profile'] as const,
};

export const useUserProfileQuery = () => {
  return useQuery({
    queryKey: usersKeys.profile(),
    queryFn: async () => {
      const { setUser } = useUserStore.getState();
      const profile = await getUserInfo();

      setUser(profile);
      return profile;
    },
  });
};

export const useUpdateUserProfileMutation = () => {
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserInput }) =>
      updateUserProfile(userId, data),
    onSuccess: profile => {
      const { setUser } = useUserStore.getState();
      setUser(profile);
      void queryClient.invalidateQueries({ queryKey: usersKeys.profile() });
    },
  });
};
