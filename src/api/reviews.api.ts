import type { PaginationMeta, PaginationParams } from '@/types/pagination.types';
import { apiRequest } from './client';
import type {
  CreateReviewRequest,
  RatingDistribution,
  Review,
  MyReview,
} from '@/types/reviews.types';

export const getEstablishmentReviews = async (
  establishmentId: string,
  params?: PaginationParams
) => {
  const query = params ? `?page=${params.page}&limit=${params.limit}` : '';
  const response = await apiRequest<{
    reviews: Review[];
    ratingDistribution: RatingDistribution[];
    myReview: MyReview | null;
    meta: PaginationMeta;
    rating: number;
  }>(`/reviews/establishment/${establishmentId}${query}`);
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

export const getUserReviewsForEstablishment = async (establishmentId: string) => {
  const response = await apiRequest<{ reviews: MyReview[] }>(
    `/reviews/establishment/${establishmentId}/my`
  );

  return response.reviews;
};
