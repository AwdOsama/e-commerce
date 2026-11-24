export interface ReviewUser {
  _id?: string;
  name?: string;
  email?: string;
}

export interface ProductReview {
  _id: string;
  review: string;
  rating: number;
  user?: ReviewUser;
  createdAt?: string;
}

export interface ProductReviewsResult {
  reviews: ProductReview[];
  total: number;
}
