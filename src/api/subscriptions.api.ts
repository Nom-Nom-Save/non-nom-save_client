import { apiRequest } from '@/api/client';
import type {
  SubscriptionPlan,
  CreateOrderRequest,
  CreateOrderResponse,
  CaptureOrderRequest,
  CaptureOrderResponse,
} from '@/types/subscription.types';

export const getSubscriptionPlans = () => apiRequest<SubscriptionPlan[]>('/subscriptions/plans');

export const createSubscriptionOrder = (data: CreateOrderRequest) =>
  apiRequest<CreateOrderResponse>('/subscriptions/create-order', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const captureSubscriptionOrder = (data: CaptureOrderRequest) =>
  apiRequest<CaptureOrderResponse>('/subscriptions/capture-order', {
    method: 'POST',
    body: JSON.stringify(data),
  });
