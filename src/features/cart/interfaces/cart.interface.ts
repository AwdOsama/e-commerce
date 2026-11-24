export interface CartProduct {
  _id: string;
  title: string;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  quantity: number;
  availableColors?: string[];
  category?: {
    _id: string;
    name: string;
    slug?: string;
    image?: string;
  };
  brand?: {
    _id: string;
    name: string;
    slug?: string;
    image?: string;
  };
}

export interface CartLine {
  _id: string;
  count: number;
  price?: number;
  product: CartProduct;
}

export interface CartData {
  _id: string;
  cartOwner: string;
  products: CartLine[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalCartPrice: number;
}

export interface CartPayload {
  status: string;
  numOfCartItems: number;
  cartId: string;
  data: CartData;
}

export interface CartResponse {
  payload: CartPayload;
}
