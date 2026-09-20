import Image from "next/image";
import Link from "next/link";
import SectionBadge from "@/components/ui/SectionBadge";
import type { CategoryItem } from "@/types/landing";

interface ShopByCategoryProps {
  badge: string;
  title: string;
  titleAccent: string;
  items: CategoryItem[];
}

export default function ShopByCategory({
  badge,
  title,
  titleAccent,
  items,
}: ShopByCategoryProps) {
  return (
    <section className="overflow-x-hidden bg-cream py-16 md:py-11">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <SectionBadge label={badge} />
          <h2 className="mt-5 font-serif text-[32px] leading-tight text-foreground md:mt-6 md:text-[42px] lg:text-[46px]">
            {title} <span className="text-rose">{titleAccent}</span>
          </h2>
        </div>

        <div className="-mx-6 mt-12 flex min-w-0 snap-x snap-proximity gap-x-4 overflow-x-auto overscroll-x-contain scroll-smooth px-6 pb-1 scrollbar-none sm:gap-x-5 md:mx-0 md:mt-9 md:flex-wrap md:items-start md:justify-center md:gap-x-10 md:gap-y-10 md:px-0 md:pb-0 lg:flex-nowrap lg:justify-start lg:gap-x-8 xl:gap-x-14">
          {items.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group flex w-24 shrink-0 snap-start flex-col items-center md:w-50 md:snap-align-none lg:snap-start"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-full">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 767px) 96px, 208px"
                />
                <div className="pointer-events-none absolute inset-0 hidden items-center justify-center md:flex">
                  <span className="flex h-[50%] w-[50%] items-center justify-center rounded-full bg-dark-green/85 px-2 text-center font-serif text-sm whitespace-nowrap text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    View
                  </span>
                </div>
              </div>
              <span className="mt-3 text-center font-serif text-[13px] text-rose md:mt-5 md:text-lg">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
