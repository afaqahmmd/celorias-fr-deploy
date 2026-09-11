import type { ApiCategory, ApiFeaturedProduct, ApiProduct } from "@/types/api";

/**
 * Static local catalog used while the backend is unavailable.
 * See src/services/products.ts, src/services/dashboard.ts and src/services/search.ts
 * for where this data replaces the live API calls.
 */

export interface MockCategory extends ApiCategory {
  description?: string;
}

export const mockCategories: MockCategory[] = [
  {
    id: "cat-pendants",
    name: "Pendants",
    slug: "pendants",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1681276170092-446cd1b5b32d?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "cat-earrings",
    name: "Earrings",
    slug: "earrings",
    imageUrl:
      "https://images.unsplash.com/photo-1590166223826-12dee1677420?q=80&w=689&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "cat-bracelets",
    name: "Bracelets",
    slug: "bracelets",
    imageUrl:
      "https://images.unsplash.com/photo-1721206624492-3d05631471ea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YnJhY2VsZXRzfGVufDB8fDB8fHww",
  },
  {
    id: "cat-sets",
    name: "Sets",
    slug: "sets",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1681276169939-5ad54d5de5fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDl8fGpld2VsbGVyeSUyMHNldHN8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "cat-ethnic-jewellery",
    name: "Ethnic Jewellery",
    slug: "ethnic-jewellery",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1669374216974-ae28097f1ceb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZXRobmljJTIwamV3ZWxsZXJ5JTIwaXRlbXN8ZW58MHx8MHx8fDA%3D",
  },
];

function findCategory(slug: string): MockCategory {
  const category = mockCategories.find((item) => item.slug === slug);
  if (!category) {
    throw new Error(`Unknown mock category slug: ${slug}`);
  }
  return category;
}

interface MockProductSeed {
  id: string;
  name: string;
  slug: string;
  price: string;
  categorySlug: string;
  images: string[];
  stoneType?: string;
  color?: string;
  isFeatured?: boolean;
  soldCount?: number;
  averageRating?: number;
  reviewCount?: number;
}

const productSeeds: MockProductSeed[] = [
  // Earrings
  {
    id: "earring-1",
    name: "Classic Gold Drop Earrings",
    slug: "classic-gold-drop-earrings",
    price: "4500",
    categorySlug: "earrings",
    images: [
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWFycmluZ3N8ZW58MHx8MHx8fDA%3D",
    ],
    stoneType: "Pearl",
    color: "Yellow",
    isFeatured: true,
    soldCount: 42,
    averageRating: 4.6,
    reviewCount: 18,
  },
  {
    id: "earring-2",
    name: "Elegant Statement Earrings",
    slug: "elegant-statement-earrings",
    price: "5200",
    categorySlug: "earrings",
    images: [
      "https://images.unsplash.com/photo-1615655114865-4cc1bda5901e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZWFycmluZ3MlMjBwcm9kdWN0fGVufDB8fDB8fHww",
    ],
    stoneType: "Diamond",
    color: "White",
    isFeatured: false,
    soldCount: 27,
    averageRating: 4.4,
    reviewCount: 11,
  },
  {
    id: "earring-3",
    name: "Silver Pearl Drop Earrings",
    slug: "silver-pearl-drop-earrings",
    price: "3800",
    categorySlug: "earrings",
    images: [
      "https://media.istockphoto.com/id/2219327144/photo/elegant-silver-and-pearl-drop-earrings-on-pink-ceramic-plate-with-wooden-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=YWe3moh195inhGGjFPv0pYW-G-6GGbZhfq0kPFUolIU=",
    ],
    stoneType: "Pearl",
    color: "Silver",
    isFeatured: false,
    soldCount: 15,
    averageRating: 4.2,
    reviewCount: 6,
  },
  {
    id: "earring-4",
    name: "Boho Chic Earrings",
    slug: "boho-chic-earrings",
    price: "3200",
    categorySlug: "earrings",
    images: [
      "https://images.unsplash.com/photo-1665198134143-8c4434d3578b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGVhcnJpbmdzfGVufDB8fDB8fHww",
    ],
    stoneType: "Ruby",
    color: "Rose",
    isFeatured: false,
    soldCount: 9,
    averageRating: 4.0,
    reviewCount: 4,
  },
  {
    id: "earring-5",
    name: "Modern Hoop Earrings",
    slug: "modern-hoop-earrings",
    price: "2900",
    categorySlug: "earrings",
    images: [
      "https://images.unsplash.com/photo-1588891805983-fee12d508e31?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGVhcnJpbmdzJTIwcHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
    ],
    stoneType: "Emerald",
    color: "Green",
    isFeatured: true,
    soldCount: 33,
    averageRating: 4.7,
    reviewCount: 21,
  },

  // Pendants
  {
    id: "pendant-1",
    name: "Delicate Women's Pendant",
    slug: "delicate-womens-pendant",
    price: "5600",
    categorySlug: "pendants",
    images: [
      "https://images.unsplash.com/photo-1781901726878-24afc3bb8cbb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHdvbWVuJTIwcGVuZGFudHxlbnwwfHwwfHx8MA%3D%3D",
    ],
    stoneType: "Diamond",
    color: "White",
    isFeatured: true,
    soldCount: 38,
    averageRating: 4.5,
    reviewCount: 14,
  },
  {
    id: "pendant-2",
    name: "Signature Gold Pendant",
    slug: "signature-gold-pendant",
    price: "6200",
    categorySlug: "pendants",
    images: [
      "https://images.unsplash.com/photo-1705326452390-3ecf6070595f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGVuZGFudCUyMHByb2R1Y3R8ZW58MHx8MHx8fDA%3D",
    ],
    stoneType: "Sapphire",
    color: "Blue",
    isFeatured: false,
    soldCount: 19,
    averageRating: 4.3,
    reviewCount: 8,
  },
  {
    id: "pendant-3",
    name: "Timeless Charm Pendant",
    slug: "timeless-charm-pendant",
    price: "4900",
    categorySlug: "pendants",
    images: [
      "https://images.unsplash.com/photo-1656428361240-47e1737b7dce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHBlbmRhbnQlMjBwcm9kdWN0fGVufDB8fDB8fHww",
    ],
    stoneType: "Ruby",
    color: "Red",
    isFeatured: false,
    soldCount: 12,
    averageRating: 4.1,
    reviewCount: 5,
  },

  // Bracelets
  {
    id: "bracelet-1",
    name: "Layered Chain Bracelet",
    slug: "layered-chain-bracelet",
    price: "3500",
    categorySlug: "bracelets",
    images: [
      "https://images.unsplash.com/photo-1676120963306-8969fa6a810e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnJhY2VsZXQlMjBwcm9kdWN0fGVufDB8fDB8fHww",
    ],
    stoneType: "Kundan",
    color: "Yellow",
    isFeatured: true,
    soldCount: 29,
    averageRating: 4.5,
    reviewCount: 13,
  },
  {
    id: "bracelet-2",
    name: "Classic Tennis Bracelet",
    slug: "classic-tennis-bracelet",
    price: "7200",
    categorySlug: "bracelets",
    images: [
      "https://images.unsplash.com/photo-1723522938849-6e13ce7fde17?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJyYWNlbGV0JTIwcHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
    ],
    stoneType: "Diamond",
    color: "White",
    isFeatured: false,
    soldCount: 21,
    averageRating: 4.6,
    reviewCount: 10,
  },
  {
    id: "bracelet-3",
    name: "Minimalist Cuff Bracelet",
    slug: "minimalist-cuff-bracelet",
    price: "2800",
    categorySlug: "bracelets",
    images: [
      "https://images.unsplash.com/photo-1721034909472-390b9325f415?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJyYWNlbGV0JTIwcHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
    ],
    stoneType: "Pearl",
    color: "Silver",
    isFeatured: false,
    soldCount: 7,
    averageRating: 3.9,
    reviewCount: 3,
  },

  // Sets
  {
    id: "set-1",
    name: "Bridal Kundan Jewellery Set",
    slug: "bridal-kundan-jewellery-set",
    price: "18500",
    categorySlug: "sets",
    images: [
      "https://plus.unsplash.com/premium_photo-1681276169939-5ad54d5de5fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDl8fGpld2VsbGVyeSUyMHNldHN8ZW58MHx8MHx8fDA%3D",
    ],
    stoneType: "Kundan",
    color: "Yellow",
    isFeatured: true,
    soldCount: 24,
    averageRating: 4.8,
    reviewCount: 17,
  },
  {
    id: "set-2",
    name: "Emerald Necklace & Earring Set",
    slug: "emerald-necklace-earring-set",
    price: "15200",
    categorySlug: "sets",
    images: [
      "https://plus.unsplash.com/premium_photo-1681276170092-446cd1b5b32d?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    stoneType: "Emerald",
    color: "Green",
    isFeatured: false,
    soldCount: 11,
    averageRating: 4.4,
    reviewCount: 6,
  },
  {
    id: "set-3",
    name: "Pearl Elegance Jewellery Set",
    slug: "pearl-elegance-jewellery-set",
    price: "12800",
    categorySlug: "sets",
    images: [
      "https://images.unsplash.com/photo-1590166223826-12dee1677420?q=80&w=689&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    stoneType: "Pearl",
    color: "White",
    isFeatured: false,
    soldCount: 8,
    averageRating: 4.2,
    reviewCount: 4,
  },

  // Ethnic Jewellery
  {
    id: "ethnic-1",
    name: "Traditional Pakistani Jewellery Set",
    slug: "traditional-pakistani-jewellery-set",
    price: "16500",
    categorySlug: "ethnic-jewellery",
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGFraXN0YW4lMjBqZXdlbGxlcnl8ZW58MHx8MHx8fDA%3D",
    ],
    stoneType: "Kundan",
    color: "Yellow",
    isFeatured: true,
    soldCount: 31,
    averageRating: 4.7,
    reviewCount: 22,
  },
  {
    id: "ethnic-2",
    name: "Everyday Casual Jewellery",
    slug: "everyday-casual-jewellery",
    price: "4200",
    categorySlug: "ethnic-jewellery",
    images: [
      "https://images.unsplash.com/photo-1721103418312-b0057a8c31c2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNhc3VhbCUyMGpld2VsbGVyeXxlbnwwfHwwfHx8MA%3D%3D",
    ],
    stoneType: "Ruby",
    color: "Red",
    isFeatured: false,
    soldCount: 14,
    averageRating: 4.1,
    reviewCount: 7,
  },
  {
    id: "ethnic-3",
    name: "Indian Heritage Jewellery",
    slug: "indian-heritage-jewellery",
    price: "13900",
    categorySlug: "ethnic-jewellery",
    images: [
      "https://plus.unsplash.com/premium_photo-1681276169450-4504a2442173?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aW5kaWFuJTIwamV3ZWxsZXJ5fGVufDB8fDB8fHww",
    ],
    stoneType: "Sapphire",
    color: "Blue",
    isFeatured: false,
    soldCount: 10,
    averageRating: 4.3,
    reviewCount: 5,
  },
];

const CREATED_AT = "2026-01-01T00:00:00.000Z";

export const mockProducts: ApiProduct[] = productSeeds.map((seed) => {
  const category = findCategory(seed.categorySlug);
  return {
    id: seed.id,
    name: seed.name,
    slug: seed.slug,
    description:
      `Handcrafted ${seed.name.toLowerCase()} from our ${category.name.toLowerCase()} collection, ` +
      "designed to bring timeless elegance to any occasion.",
    price: seed.price,
    stock: 25,
    categoryId: category.id,
    images: seed.images,
    isFeatured: Boolean(seed.isFeatured),
    isActive: true,
    soldCount: seed.soldCount ?? 0,
    additionalInfo: null,
    stoneType: seed.stoneType ?? null,
    color: seed.color ?? null,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    category: {
      id: category.id,
      name: category.name,
      slug: category.slug,
    },
    reviewCount: seed.reviewCount ?? 0,
    averageRating: seed.averageRating ?? 0,
  };
});

export function getMockFeaturedProducts(): ApiFeaturedProduct[] {
  return mockProducts
    .filter((product) => product.isFeatured)
    .map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      images: product.images,
    }));
}
