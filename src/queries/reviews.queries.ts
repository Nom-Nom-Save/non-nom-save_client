import {
  createReview,
  deleteReview,
  getEstablishmentReviews,
  getEstablishmentReviewsDistribution,
  getUserReviewsForEstablishment,
  updateReview,
} from '@/api/reviews.api';
import { QueryKey } from '@/consts/query-key.consts';
import { queryClient } from '@/lib/query-client';
import { SortOrder } from '@/types/common.types';
import type {
  CreateReviewRequest,
  GetEstablishmentReviewsParams,
  GetUserReviewsForEstablishmentParams,
} from '@/types/reviews.types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetEstablishmentReviewsQuery = ({
  establishmentId,
  sortOrder = SortOrder.DESC,
  page = 1,
  limit = 5,
  ratingFilter,
}: GetEstablishmentReviewsParams) => {
  return useQuery({
    queryKey: [
      QueryKey.ESTABLISHMENT_REVIEWS,
      establishmentId,
      sortOrder,
      ratingFilter,
      page,
      limit,
    ],
    queryFn: () =>
      getEstablishmentReviews({ establishmentId, sortOrder, ratingFilter, page, limit }),
  });
};

export const useCreateReviewMutation = () => {
  return useMutation({
    mutationFn: (data: CreateReviewRequest) => createReview(data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: [QueryKey.ESTABLISHMENT_REVIEWS, variables.establishmentId],
      });

      void queryClient.invalidateQueries({
        queryKey: [QueryKey.USER_REVIEWS, variables.establishmentId],
      });
    },
  });
};

export const useUpdateReviewMutation = () => {
  return useMutation({
    mutationFn: (data: {
      reviewId: string;
      rating: number;
      comment: string;
      establishmentId: string;
    }) => updateReview(data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: [QueryKey.ESTABLISHMENT_REVIEWS, variables.establishmentId],
      });

      void queryClient.invalidateQueries({
        queryKey: [QueryKey.USER_REVIEWS, variables.establishmentId],
      });
    },
  });
};

export const useDeleteReviewMutation = () => {
  return useMutation({
    mutationFn: ({ reviewId }: { reviewId: string; establishmentId: string }) =>
      deleteReview(reviewId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: [QueryKey.ESTABLISHMENT_REVIEWS, variables.establishmentId],
      });

      void queryClient.invalidateQueries({
        queryKey: [QueryKey.USER_REVIEWS, variables.establishmentId],
      });
    },
  });
};

export const useUserReviewsForEstablishmentQuery = ({
  establishmentId,
  sortOrder = SortOrder.DESC,
  ratingFilter,
}: GetUserReviewsForEstablishmentParams) => {
  return useQuery({
    queryKey: [QueryKey.USER_REVIEWS, establishmentId, sortOrder, ratingFilter],
    queryFn: () => getUserReviewsForEstablishment({ establishmentId, sortOrder, ratingFilter }),
  });
};

export const useGetEstablishmentReviewsDistributionQuery = (establishmentId: string) => {
  return useQuery({
    queryKey: [QueryKey.ESTABLISHMENT_REVIEWS_DISTRIBUTION, establishmentId],
    queryFn: () => getEstablishmentReviewsDistribution(establishmentId),
  });
};
