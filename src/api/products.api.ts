import { apiRequest } from '@/api/client';
import type {
  CreateProductRequest,
  UpdateProductRequest,
  ProductResponse,
  ProductListResponse,
  CreateProductResponse,
  UpdateProductResponse,
  DeleteProductResponse,
} from '@/types/product.types';

export const getProducts = async (type?: 'Private' | 'All'): Promise<ProductResponse[]> => {
  const query = type ? `?type=${type}` : '';
  const data = await apiRequest<ProductListResponse>(`/products${query}`);
  return data.products;
};

export const createProduct = async (data: CreateProductRequest): Promise<ProductResponse> => {
  const response = await apiRequest<CreateProductResponse>('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.product;
};

export const updateProduct = async (
  productId: string,
  data: UpdateProductRequest
): Promise<ProductResponse> => {
  const response = await apiRequest<UpdateProductResponse>(`/products/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return response.product;
};

export const deleteProduct = (productId: string) =>
  apiRequest<DeleteProductResponse>(`/products/${productId}`, { method: 'DELETE' });
