import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/api/products.api';
import type { CreateProductRequest, UpdateProductRequest } from '@/types/product.types';

export const productKeys = {
  all: () => ['products'] as const,
};

export const useProductsQuery = () =>
  useQuery({
    queryKey: productKeys.all(),
    queryFn: () => getProducts(),
  });

export const useCreateProductMutation = () =>
  useMutation({
    mutationFn: (data: CreateProductRequest) => createProduct(data),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: productKeys.all() }),
  });

export const useUpdateProductMutation = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      updateProduct(id, data),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: productKeys.all() }),
  });

export const useDeleteProductMutation = () =>
  useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: productKeys.all() }),
  });
