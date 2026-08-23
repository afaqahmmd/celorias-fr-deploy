import Image from "next/image";
import { siteAssets } from "@/config/assets";
import type { FeatureItem } from "@/types/landing";

interface FeaturesBarProps {
  features: FeatureItem[];
}

const iconMap: Record<string, string> = {
  support: siteAssets.premiumSupport,
  payment: siteAssets.flexiblePayment,
  shipping: siteAssets.freeShipping,
  return: siteAssets.easyReturn,
};

function FeatureIcon({ icon, title }: { icon: string; title: string }) {
  const src = iconMap[icon] ?? siteAssets.premiumSupport;

  return (
    <Image
      src={src}
      alt={title}
      width={52}
      height={52}
      className="h-13 w-13 object-contain"
    />
  );
}

export default function FeaturesBar({ features }: FeaturesBarProps) {
  return (
    <section className="bg-[#F2E3DF] py-8 md:py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 sm:flex-row sm:flex-wrap sm:justify-between lg:flex-nowrap lg:px-10 xl:px-12">
        {features.map((feature) => (
          <div key={feature.title} className="flex items-center gap-4">
            <div className="shrink-0 text-[#443934]">
              <FeatureIcon icon={feature.icon} title={feature.title} />
            </div>
            <div>
              <p className="font-serif text-xl leading-snug text-[#443934]">
                {feature.title}
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-[#847875]">
                {feature.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
