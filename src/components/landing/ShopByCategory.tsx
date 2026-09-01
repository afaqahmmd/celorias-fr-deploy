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
    <section className="bg-cream py-16 md:py-11">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <SectionBadge label={badge} />
          <h2 className="mt-5 font-serif text-[32px] leading-tight text-foreground md:mt-6 md:text-[42px] lg:text-[46px]">
            {title} <span className="text-rose">{titleAccent}</span>
          </h2>
        </div>

        <div className="mt-12 flex flex-wrap items-start justify-center gap-x-5 gap-y-8 sm:gap-x-8 sm:gap-y-10 md:mt-9 md:gap-x-10 lg:flex-nowrap lg:gap-x-8 xl:gap-x-14">
          {items.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group flex w-[42%] max-w-36 flex-col items-center sm:w-44 sm:max-w-none md:w-50"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-full">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 144px, (max-width: 768px) 176px, 208px"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="flex h-[50%] w-[50%] items-center justify-center rounded-full bg-dark-green/85 px-2 text-center font-serif text-[13px] whitespace-nowrap text-white opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:text-sm">
                    View
                  </span>
                </div>
              </div>
              <span className="mt-4 text-center font-serif text-[15px] text-rose md:mt-5 md:text-lg">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
