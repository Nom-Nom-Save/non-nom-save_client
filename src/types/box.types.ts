export interface CreateBoxRequest {
  name: string;
  picture?: string;
  boundTo?: string;
  description: string;
  recommendedPrice: number;
  quantityOfItems?: number;
  typeIds?: string[];
  productIds?: string[];
}

export interface UpdateBoxRequest {
  name?: string;
  picture?: string;
  description?: string;
  recommendedPrice?: number;
  quantityOfItems?: number;
  typeIds?: string[];
  productIds?: string[];
}

export interface BoxResponse {
  id: string;
  name: string;
  picture: string | null;
  boundTo: string | null;
  description: string;
  recommendedPrice: number;
  quantityOfItems: number;
  createdAt: string;
  types: string[];
  productIds: string[];
}

export interface BoxListResponse {
  boxes: BoxResponse[];
}

export interface CreateBoxResponse {
  message: string;
  box: BoxResponse;
}

export interface UpdateBoxResponse {
  message: string;
  box: BoxResponse;
}

export interface DeleteBoxResponse {
  message: string;
}
