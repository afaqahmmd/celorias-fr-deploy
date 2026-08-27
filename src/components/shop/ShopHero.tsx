import Image from "next/image";
import Link from "next/link";
import { siteAssets } from "@/config/assets";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ShopHeroProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
}

export default function ShopHero({ title, breadcrumbs }: ShopHeroProps) {
  return (
    <section className="relative flex h-[220px] items-center justify-center overflow-hidden md:h-[200px] lg:h-[420px]">
      <Image
        src={siteAssets.productBg}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 z-1 bg-[#1c1410]/55" />

      <div className="relative z-10 px-6 text-center">
        <h1 className="font-serif text-4xl font-normal text-white md:text-5xl lg:text-[56px]">
          {title}
        </h1>
        <nav
          aria-label="Breadcrumb"
          className="mt-3 text-sm text-white/90 md:mt-4"
        >
          <ol className="flex flex-wrap items-center justify-center gap-x-2">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <li
                  key={`${crumb.label}-${index}`}
                  className="flex items-center gap-x-2"
                >
                  {index > 0 && <span aria-hidden="true">/</span>}
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      className="transition-colors hover:text-white"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={isLast ? "text-white" : undefined}>
                      {crumb.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </section>
  );
}
