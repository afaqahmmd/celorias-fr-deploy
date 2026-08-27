import AnnouncementBar from "@/components/landing/AnnouncementBar";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import { landingMock } from "@/data/mock/landing";

interface SiteChromeProps {
  children: React.ReactNode;
}

export default function SiteChrome({ children }: SiteChromeProps) {
  const { announcement, navLinks, footer } = landingMock;

  return (
    <>
      <AnnouncementBar message={announcement} />
      <Header navLinks={navLinks} />
      <main className="flex-1">{children}</main>
      <Footer
        tagline={footer.tagline}
        customerCareLinks={footer.customerCareLinks}
        companyLinks={footer.companyLinks}
        contact={footer.contact}
        socials={footer.socials}
        copyright={footer.copyright}
        paymentLabel={footer.paymentLabel}
      />
    </>
  );
}
