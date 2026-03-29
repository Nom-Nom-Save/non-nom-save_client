export enum ItemType {
  PRODUCT = 'Product',
  BOX = 'Box',
}

export enum MenuStatus {
  ACTIVE = 'Active',
  SOLD_OUT = 'SoldOut',
  INACTIVE = 'Inactive',
}

export interface MenuPriceData {
  id: string;
  menuItemId: string;
  totalQuantity: number;
  availableQuantity: number;
  originalPrice: number;
  discountPrice: number;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface MenuItemDetails {
  name: string;
  description: string;
  types: string[];
  allergens: string[];
}

export interface MenuItemResponse {
  id: string;
  establishmentId: string;
  itemId: string;
  itemType: ItemType;
  status: MenuStatus;
  priceData: MenuPriceData;
  itemDetails: MenuItemDetails;
}

export interface CreateMenuItemRequest {
  itemId: string;
  itemType: ItemType;
  totalQuantity: number;
  originalPrice: number;
  discountPrice: number;
  startTime: string;
  endTime: string;
}

export interface CreateMenuItemResponse {
  message: string;
  menuEntry: Omit<MenuItemResponse, 'itemDetails'>;
}

export interface UpdateMenuItemRequest {
  totalQuantity?: number;
  originalPrice?: number;
  discountPrice?: number;
  startTime?: string;
  endTime?: string;
}

export interface UpdateMenuStatusRequest {
  status: MenuStatus;
}

export interface MenuListResponse {
  menu: MenuItemResponse[];
}

export interface MenuItemDetailResponse {
  menuItem: MenuItemResponse;
}

export interface MessageResponse {
  message: string;
}
