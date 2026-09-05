export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
}

export interface ApiFeaturedProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  images: string[];
}

export type ProductSortBy =
  | "best_sellers"
  | "price_asc"
  | "price_desc"
  | "most_reviews";

export interface ApiProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ApiProductReview {
  id: string;
  customerName: string;
  stars: number;
  description: string;
  createdAt: string;
}

export interface ApiProductReviews {
  averageRating: number;
  count: number;
  items: ApiProductReview[];
}

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  categoryId: string;
  images: string[];
  isFeatured: boolean;
  isActive: boolean;
  soldCount: number;
  additionalInfo: unknown;
  createdAt: string;
  updatedAt: string;
  category: ApiProductCategory;
  reviewCount: number;
  averageRating?: number;
}

export interface ApiProductDetail
  extends Omit<ApiProduct, "reviewCount"> {
  reviews: ApiProductReviews;
}

export interface ProductPreview {
  id: string;
  name: string;
  slug: string;
  price: string;
  images: string[];
  rating: number;
  reviewCount?: number;
}

export interface ApiProductListResponse {
  items: ApiProduct[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiSearchSuggestion {
  id: string;
  name: string;
  slug: string;
  price: string;
  thumbnail: string | null;
}

export interface ApiSearchSuggestionResponse {
  items: ApiSearchSuggestion[];
}

export interface ApiCartItem {
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
  availableStock: number;
}

export interface ApiCart {
  id: string | null;
  items: ApiCartItem[];
  itemCount: number;
  subtotal: string;
}

export type PaymentMethod = "CASH_ON_DELIVERY" | "BANK_DEPOSIT" | "JAZZCASH";

export interface PlaceOrderAddress {
  firstName: string;
  lastName: string;
  country: string;
  region: string;
  address: string;
  apartment?: string;
  city: string;
  postalCode: string;
}

export interface PlaceOrderPayload {
  contactEmail: string;
  contactPhone: string;
  firstName: string;
  lastName: string;
  country: string;
  region: string;
  address: string;
  apartment?: string;
  city: string;
  postalCode: string;
  paymentMethod: PaymentMethod;
  billingSameAsShipping: boolean;
  billing?: PlaceOrderAddress;
}

export interface ApiOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  subtotal: string;
  total: string;
}

export interface ApiTestimonial {
  id: string;
  productId?: string;
  customerName: string;
  stars: number;
  description: string;
  isActive?: boolean;
  product?: {
    id: string;
    name: string;
    images: string[];
  };
}
