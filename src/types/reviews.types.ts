import type { SortOrder } from './common.types';

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
  };
}

export interface RatingDistribution {
  rating: number;
  count: number;
  percentage: number;
}

export interface CreateReviewRequest {
  establishmentId: string;
  rating: number;
  comment: string;
}

export interface MyReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  editableUntil: string;
  isEditable: boolean;
}

export enum ReviewMode {
  LIST = 'list',
  WRITE = 'write',
  EDIT = 'edit',
}

export type RatingFilter = 1 | 2 | 3 | 4 | 5;

export interface GetEstablishmentReviewsParams {
  establishmentId: string;
  sortOrder?: SortOrder;
  page: number;
  limit?: number;
  ratingFilter?: RatingFilter | null;
}

export interface GetUserReviewsForEstablishmentParams {
  establishmentId: string;
  sortOrder: SortOrder;
  ratingFilter?: RatingFilter | null;
}
