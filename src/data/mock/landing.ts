import type { LandingData } from "@/types/landing";
import { siteAssets } from "@/config/assets";

export const landingMock: LandingData = {
  announcement: "Exclusive Engagement Rings - Your Perfect Choice",
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/products" },
    { label: "Collection", href: "/collection" },
  ],
  hero: {
    badge: "WHERE FASHION MEETS ELEGANCE",
    title: "Elevate Your Style With\nTimeless Fashion",
    subtitle:
      "Discover a curated collection of elegant fashion and premium jewellery designed to express your unique personality from everyday essentials to statement pieces.",
    images: [...siteAssets.heroImages],
  },
  features: [
    {
      icon: "support",
      title: "Premium Support",
      subtitle: "Outstanding Premium Support",
    },
    {
      icon: "payment",
      title: "Flexible Payment",
      subtitle: "Pay With Multiple Credit Cards",
    },
    {
      icon: "shipping",
      title: "Free Shipping",
      subtitle: "Free Shipping Over Order 1000",
    },
    {
      icon: "return",
      title: "Easy Return",
      subtitle: "Within 30 Days Of Return",
    },
  ],
  categories: {
    badge: "BEST SELLERS",
    title: "Shop By",
    titleAccent: "Category",
    items: [
      {
        id: "pendants",
        name: "Pendants",
        image:
          "https://images.unsplash.com/photo-1617038260897-41a89fa42ca6?w=400&h=400&fit=crop&q=80",
        href: "/products/pendants",
      },
      {
        id: "earrings",
        name: "Earrings",
        image:
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop&q=80",
        href: "/products/earrings",
      },
      {
        id: "rings",
        name: "Rings",
        image:
          "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&q=80",
        href: "/products/rings",
      },
      {
        id: "bracelets",
        name: "Bracelets",
        image:
          "https://images.unsplash.com/photo-1611591437281-460bfbead0ee?w=400&h=400&fit=crop&q=80",
        href: "/products/bracelets",
      },
      {
        id: "chains",
        name: "Chains",
        image:
          "https://images.unsplash.com/photo-1599643478518-a784e690c445?w=400&h=400&fit=crop&q=80",
        href: "/products/chains",
      },
    ],
  },
  products: {
    badge: "OUR PRODUCTS",
    title: "Explore Our",
    titleAccent: "Signature Jewellery Pieces",
    items: [
      {
        id: "1",
        name: "Bridal Gold Hoop Earrings",
        price: 3000,
        currency: "Rs",
        image:
          "https://images.unsplash.com/photo-1630019853434-772304ae9675?w=600&h=600&fit=crop&q=80",
        href: "/product/bridal-gold-hoop-earrings",
      },
      {
        id: "2",
        name: "Kundan Curve Necklace",
        price: 3000,
        currency: "Rs",
        image:
          "https://images.unsplash.com/photo-1599643478518-a784e690c445?w=600&h=600&fit=crop&q=80",
        href: "/product/kundan-curve-necklace",
      },
      {
        id: "3",
        name: "Diamond Gold Earrings",
        price: 3000,
        currency: "Rs",
        image:
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop&q=80",
        href: "/product/diamond-gold-earrings",
      },
      {
        id: "4",
        name: "Shining Earrings",
        price: 3000,
        currency: "Rs",
        image:
          "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop&q=80",
        href: "/product/shining-earrings",
      },
    ],
    ctaLabel: "Explore More",
    ctaHref: "/products",
  },
  promise: {
    badge: "OUR PROMISE",
    title: "The Promise Of",
    titleAccent: "Perfection",
    items: [
      { icon: "fair-policy", title: "Assured Fair Policy" },
      { icon: "transparency", title: "Absolute Transparency" },
      { icon: "gold-purity", title: "Certified 916 Gold Purity" },
    ],
  },
  testimonials: {
    badge: "TESTIMONIALS",
    title: "Trusted Reviews From",
    titleAccent: "JewelleryStyle",
    titleSuffix: "Enthusiasts",
    backgroundImage: siteAssets.testimonialsBackground,
    items: [],
  },
  footer: {
    tagline:
      "We Bring you curated collection premium fashionand elegant jewellery.",
    customerCareLinks: [
      { label: "Jewellery Care", href: "/jewellery-care" },
      { label: "Waranty & Repairs", href: "/warranty-repairs" },
      { label: "Returns & Refunds", href: "/returns-refunds" },
      { label: "After Sales Service", href: "/after-sales" },
      { label: "Our Story", href: "/our-story" },
      { label: "Contact Us", href: "/contact" },
    ],
    companyLinks: [
      { label: "About Celoria", href: "/about" },
      { label: "Quality Promise", href: "/quality-promise" },
    ],
    contact: {
      phone: "+92 300 1234567",
      email: "care@celorias.com",
      address: "3rd Floor, Gold crest mall, Lahore, Pakistan",
    },
    socials: [
      { platform: "instagram", href: "https://instagram.com" },
      { platform: "tiktok", href: "https://tiktok.com" },
      { platform: "youtube", href: "https://youtube.com" },
      { platform: "pinterest", href: "https://pinterest.com" },
    ],
    copyright: "Copyright © 2026 All Rights Reserved.",
    paymentLabel: "Payment Can Be Done Through",
  },
};
