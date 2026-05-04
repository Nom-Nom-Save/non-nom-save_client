import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import {
  getSubscriptionPlans,
  createSubscriptionOrder,
  captureSubscriptionOrder,
  cancelSubscription,
} from '@/api/subscriptions.api';
import type { CreateOrderRequest, CaptureOrderRequest } from '@/types/subscription.types';
import { establishmentKeys } from '@/queries/establishment.queries';
import { userKeys } from '@/queries/user.queries';

export const subscriptionKeys = {
  plans: () => ['subscription', 'plans'] as const,
};

export const useSubscriptionPlansQuery = () =>
  useQuery({
    queryKey: subscriptionKeys.plans(),
    queryFn: () => getSubscriptionPlans(),
  });

export const useCreateSubscriptionOrderMutation = () =>
  useMutation({
    mutationFn: (data: CreateOrderRequest) => createSubscriptionOrder(data),
  });

export const useCaptureSubscriptionOrderMutation = () =>
  useMutation({
    mutationFn: (data: CaptureOrderRequest) => captureSubscriptionOrder(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: establishmentKeys.profile() });
      void queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });

export const useCancelSubscriptionMutation = () =>
  useMutation({
    mutationFn: () => cancelSubscription(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: establishmentKeys.profile() });
      void queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
