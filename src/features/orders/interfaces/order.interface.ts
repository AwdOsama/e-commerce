export interface OrderProduct {
  _id?: string;
  title: string;
  imageCover?: string;
  price: number;
  count: number;
  brand?: string;
}

export interface OrderAddress {
  details?: string;
  city?: string;
  phone?: string;
}

export interface UserOrder {
  _id: string;
  createdAt?: string;
  totalOrderPrice: number;
  paymentMethodType?: string;
  isPaid?: boolean;
  isDelivered?: boolean;
  shippingAddress?: OrderAddress;
  products: OrderProduct[];
}

export interface OrdersResponse {
  payload: unknown;
}
