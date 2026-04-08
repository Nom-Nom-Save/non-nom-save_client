import type { PaginationMeta } from '@/types/pagination.types';
import { apiRequest } from './client';
import type {
  CreateReviewRequest,
  RatingDistribution,
  Review,
  MyReview,
  GetEstablishmentReviewsParams,
  GetUserReviewsForEstablishmentParams,
} from '@/types/reviews.types';
import { SortOrder } from '@/types/common.types';

export const getEstablishmentReviews = async ({
  establishmentId,
  sortOrder,
  page,
  limit,
  ratingFilter,
}: GetEstablishmentReviewsParams) => {
  const params = new URLSearchParams();

  if (page) {
    params.set('page', String(page));
  }
  if (limit) {
    params.set('limit', String(limit));
  }
  if (ratingFilter) {
    params.set('ratingFilter', String(ratingFilter));
  }
  params.set('sort', sortOrder as string);

  const response = await apiRequest<{
    reviews: Review[];
    ratingDistribution: RatingDistribution[];
    myReview: MyReview | null;
    meta: PaginationMeta;
    rating: number;
  }>(`/reviews/establishment/${establishmentId}?${params.toString()}`);
  return response;
};

export const createReview = async (data: CreateReviewRequest) => {
  return await apiRequest('/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateReview = async ({
  reviewId,
  rating,
  comment,
}: {
  reviewId: string;
  rating: number;
  comment: string;
}) => {
  return await apiRequest(`/reviews/${reviewId}`, {
    method: 'PATCH',
    body: JSON.stringify({ rating, comment }),
  });
};

export const deleteReview = async (reviewId: string) => {
  return await apiRequest(`/reviews/${reviewId}`, {
    method: 'DELETE',
  });
};

export const getUserReviewsForEstablishment = async ({
  establishmentId,
  sortOrder = SortOrder.DESC,
  ratingFilter,
}: GetUserReviewsForEstablishmentParams) => {
  const params = new URLSearchParams();

  if (ratingFilter) {
    params.set('ratingFilter', String(ratingFilter));
  }
  params.set('sort', sortOrder as string);

  const response = await apiRequest<{ reviews: MyReview[] }>(
    `/reviews/establishment/${establishmentId}/my?${params.toString()}`
  );

  return response.reviews;
};

export const getEstablishmentReviewsDistribution = async (establishmentId: string) => {
  return await apiRequest<{
    ratingDistribution: RatingDistribution[];
    rating: string;
  }>(`/reviews/establishment/${establishmentId}/distribution`);
};
