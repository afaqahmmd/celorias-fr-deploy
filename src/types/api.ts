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
