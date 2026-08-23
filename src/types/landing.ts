export interface NavLink {
  label: string;
  href: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  subtitle: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  image: string;
  href: string;
}

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  href: string;
}

export interface PromiseItem {
  icon: string;
  title: string;
}

export interface TestimonialItem {
  id: string;
  rating: number;
  quote: string;
  author: string;
  role: string;
  productImage?: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: "instagram" | "tiktok" | "youtube" | "pinterest";
  href: string;
}

export interface LandingData {
  announcement: string;
  navLinks: NavLink[];
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    images: string[];
  };
  features: FeatureItem[];
  categories: {
    badge: string;
    title: string;
    titleAccent: string;
    items: CategoryItem[];
  };
  products: {
    badge: string;
    title: string;
    titleAccent: string;
    items: ProductItem[];
    ctaLabel: string;
    ctaHref: string;
  };
  promise: {
    badge: string;
    title: string;
    titleAccent: string;
    items: PromiseItem[];
  };
  testimonials: {
    badge: string;
    title: string;
    titleAccent: string;
    titleSuffix: string;
    backgroundImage: string;
    items: TestimonialItem[];
  };
  footer: {
    tagline: string;
    customerCareLinks: FooterLink[];
    companyLinks: FooterLink[];
    contact: {
      phone: string;
      email: string;
      address: string;
    };
    socials: SocialLink[];
    copyright: string;
    paymentLabel: string;
  };
}
