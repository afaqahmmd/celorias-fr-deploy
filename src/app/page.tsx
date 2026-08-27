import AnnouncementBar from "@/components/landing/AnnouncementBar";
import FeaturesBar from "@/components/landing/FeaturesBar";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import ProductShowcase from "@/components/landing/ProductShowcase";
import PromiseSection from "@/components/landing/PromiseSection";
import ShopByCategory from "@/components/landing/ShopByCategory";
import Testimonials from "@/components/landing/Testimonials";
import { getLandingData } from "@/services/landing";

export default async function Home() {
  const data = await getLandingData();

  return (
    <>
      <AnnouncementBar message={data.announcement} />
      <Header navLinks={data.navLinks} />
      <Hero
        badge={data.hero.badge}
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        images={data.hero.images}
      />
      <FeaturesBar features={data.features} />
      <ShopByCategory
        badge={data.categories.badge}
        title={data.categories.title}
        titleAccent={data.categories.titleAccent}
        items={data.categories.items}
      />
      <ProductShowcase
        badge={data.products.badge}
        title={data.products.title}
        titleAccent={data.products.titleAccent}
        items={data.products.items}
        ctaLabel={data.products.ctaLabel}
        ctaHref={data.products.ctaHref}
      />
      <Testimonials
        badge={data.testimonials.badge}
        title={data.testimonials.title}
        titleAccent={data.testimonials.titleAccent}
        titleSuffix={data.testimonials.titleSuffix}
        backgroundImage={data.testimonials.backgroundImage}
        items={data.testimonials.items}
      />
      <PromiseSection
        badge={data.promise.badge}
        title={data.promise.title}
        titleAccent={data.promise.titleAccent}
        items={data.promise.items}
      />
      <Footer
        tagline={data.footer.tagline}
        customerCareLinks={data.footer.customerCareLinks}
        companyLinks={data.footer.companyLinks}
        contact={data.footer.contact}
        socials={data.footer.socials}
        copyright={data.footer.copyright}
        paymentLabel={data.footer.paymentLabel}
      />
    </>
  );
}
