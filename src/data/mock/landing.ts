import type { LandingData } from "@/types/landing";
import { siteAssets } from "@/config/assets";

export const landingMock: LandingData = {
  announcement: "Exclusive Engagement Rings - Your Perfect Choice",
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/products" },
    { label: "Collection", href: "/collection" },
    { label: "Contact Us", href: "/contact" },
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
          "https://plus.unsplash.com/premium_photo-1681276170092-446cd1b5b32d?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        href: "/products/pendants",
      },
      {
        id: "earrings",
        name: "Earrings",
        image:
          "https://images.unsplash.com/photo-1590166223826-12dee1677420?q=80&w=689&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        href: "/products/earrings",
      },
      {
        id: "bracelets",
        name: "Bracelets",
        image:
          "https://images.unsplash.com/photo-1721206624492-3d05631471ea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YnJhY2VsZXRzfGVufDB8fDB8fHww",
        href: "/products/bracelets",
      },
      {
        id: "sets",
        name: "Sets",
        image:
          "https://plus.unsplash.com/premium_photo-1681276169939-5ad54d5de5fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDl8fGpld2VsbGVyeSUyMHNldHN8ZW58MHx8MHx8fDA%3D",
        href: "/products/sets",
      },
      {
        id: "ethnic-jewellery",
        name: "Ethnic Jewellery",
        image:
          "https://plus.unsplash.com/premium_photo-1669374216974-ae28097f1ceb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZXRobmljJTIwamV3ZWxsZXJ5JTIwaXRlbXN8ZW58MHx8MHx8fDA%3D",
        href: "/products/ethnic-jewellery",
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
