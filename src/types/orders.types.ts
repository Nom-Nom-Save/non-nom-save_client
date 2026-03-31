export interface OrderDetail {
  id: string;
  orderId: string;
  menuPriceId: string;
  quantity: number;
  price: number;
  originalPrice: number;
  discountPrice: number;
  itemName: string;
  itemType: string;
  weight: number;
  minWeight: number;
  maxWeight: number;
  itemPicture: string;
}

export enum OrderStatus {
  RESERVED = 'Reserved',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  PENDING = 'Pending',
  EXPIRED = 'Expired',
}

export interface Order {
  id: string;
  userId: string;
  totalPrice: number;
  orderStatus: OrderStatus;
  qrCodeData: string;
  reservedAt: string;
  expiresAt: string;
  completedAt: string;
  details: OrderDetail[];
  establishmentName: string;
  establishmentAddress: string;
  establishmentLogo: string;
  establishmentBanner: string;
  allergens: string[];
  totalOrderWeight: number;
}
