export interface CreateProductRequest {
  name: string;
  picture?: string;
  weight?: number;
  description: string;
  recommendedPrice: number;
  typeIds?: string[];
  allergenIds?: string[];
}

export interface UpdateProductRequest {
  name?: string;
  picture?: string;
  weight?: number;
  description?: string;
  recommendedPrice?: number;
  typeIds?: string[];
  allergenIds?: string[];
}

export interface ProductResponse {
  id: string;
  name: string;
  picture: string | null;
  boundTo: string | null;
  weight: number;
  description: string;
  recommendedPrice: number;
  createdAt: string;
  types: string[];
  allergens: string[];
}

export interface ProductListResponse {
  products: ProductResponse[];
}

export interface CreateProductResponse {
  message: string;
  product: ProductResponse;
}

export interface UpdateProductResponse {
  message: string;
  product: ProductResponse;
}

export interface DeleteProductResponse {
  message: string;
}
