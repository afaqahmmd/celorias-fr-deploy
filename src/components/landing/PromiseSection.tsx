import Image from "next/image";
import SectionBadge from "@/components/ui/SectionBadge";
import { siteAssets } from "@/config/assets";
import type { PromiseItem } from "@/types/landing";

interface PromiseSectionProps {
  badge: string;
  title: string;
  titleAccent: string;
  items: PromiseItem[];
}

const promiseIcons: Record<string, string> = {
  "fair-policy": siteAssets.fairPolicy,
  transparency: siteAssets.transparency,
  "gold-purity": siteAssets.goldPurity,
};

function PromiseIcon({ icon }: { icon: string }) {
  const src = promiseIcons[icon] ?? siteAssets.fairPolicy;

  return (
    <Image
      src={src}
      alt=""
      width={64}
      height={64}
      className="h-16 w-16 object-contain transition-[filter] duration-200 group-hover:brightness-0 group-hover:invert"
    />
  );
}

export default function PromiseSection({
  badge,
  title,
  titleAccent,
  items,
}: PromiseSectionProps) {
  return (
    <section className="bg-[#F2E3DF] py-16 md:py-13">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <SectionBadge label={badge} />
          <h2 className="mt-6 font-serif text-3xl text-[#443934] md:text-4xl">
            {title} <span className="text-[#B18384]">{titleAccent}</span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 divide-y divide-black/10 md:grid-cols-3 md:divide-x md:divide-y-0">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center px-6 py-10 text-center md:py-2"
            >
              <div className="group flex h-34 w-34 items-center justify-center rounded-md bg-[#F7EFEB] hover:bg-dark-green">
                <PromiseIcon icon={item.icon} />
              </div>
              <p className="mt-6 font-serif text-lg text-[#443934] md:text-lg">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
