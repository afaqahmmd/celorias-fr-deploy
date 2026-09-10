import { FiMail, FiPhone } from "react-icons/fi";
import ContactForm from "@/components/contact/ContactForm";
import SiteChrome from "@/components/layout/SiteChrome";
import ShopHero from "@/components/shop/ShopHero";
import SectionBadge from "@/components/ui/SectionBadge";
import { landingMock } from "@/data/mock/landing";

const ABOUT_COPY =
  "Celorias was founded on a simple belief — every piece of jewellery should feel personal, timeless, and made with honest craftsmanship. We design fine jewellery that honours tradition while staying contemporary — crafted with care, priced fairly, and made to be worn, loved, and passed on.";

function SectionHeading({
  badge,
  title,
  titleAccent,
}: {
  badge: string;
  title: string;
  titleAccent: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <SectionBadge label={badge} />
      <h2 className="mt-5 font-serif text-[32px] leading-tight text-foreground md:mt-6 md:text-[42px] lg:text-[46px]">
        {title} <span className="font-serif text-[#BB7777]">{titleAccent}</span>
      </h2>
    </div>
  );
}

export default function ContactPageView() {
  const { phone, email } = landingMock.footer.contact;

  return (
    <SiteChrome>
      <ShopHero
        title="Contact Us"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
      />

      <section className="bg-cream-light py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <SectionHeading
            badge="OUR STORY"
            title="About"
            titleAccent="Celorias"
          />
          <p className="mt-6 text-sm leading-relaxed text-text-muted md:text-[15px] md:leading-7">
            {ABOUT_COPY}
          </p>
        </div>
      </section>

      <section className="bg-[#F7EFEB] py-16 md:py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge="GET IN TOUCH"
            title="Inspired Fashion"
            titleAccent="Designed For You"
          />
          <div className="mt-12">
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge="CONTACT INFORMATION"
            title="Reach Us Anytime"
            titleAccent="Anywhere Easily"
          />
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 items-stretch gap-6 sm:grid-cols-[1fr_auto_1fr] sm:gap-0">
            <article className="rounded-2xl bg-[#F2F2F247] px-8 py-10 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mauve text-white hover:bg-[#123B37] cursor-pointer">
                <FiPhone className="h-6 w-6 hover:text-white" />
              </span>
              <p className="mt-5 text-sm text-text-muted">Phone Number</p>
              <p className="mt-1 font-serif text-lg text-foreground">{phone}</p>
            </article>
            <div
              className="hidden self-stretch px-5 sm:flex"
              aria-hidden="true"
            >
              <span className="w-px bg-black/12" />
            </div>
            <article className="rounded-2xl bg-[#F2F2F247] px-8 py-10 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mauve text-white hover:bg-[#123B37] cursor-pointer">
                <FiMail className="h-6 w-6 hover:text-white" />
              </span>
              <p className="mt-5 text-sm text-text-muted">Email Address</p>
              <p className="mt-1 font-serif text-lg text-foreground">{email}</p>
            </article>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
