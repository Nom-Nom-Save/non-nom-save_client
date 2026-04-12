export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PENDING = 'pending',
}

export enum PlanName {
  Free = 'Free',
  Pro = 'Pro',
  Sponsor = 'Sponsor',
}

export interface RawSubscription {
  status: SubscriptionStatus;
  planName: string;
  endDate: string;
}

export interface Subscription {
  status: SubscriptionStatus;
  planName: PlanName;
  endDate: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  durationDays: number;
  isActive: boolean;
  targetType: string;
}

export interface CreateOrderRequest {
  subscriptionPlanId: string;
}

export interface CreateOrderResponse {
  id: string;
}

export interface CaptureOrderRequest {
  orderId: string;
}

export interface CaptureOrderResponse {
  status: string;
  id: string;
}
