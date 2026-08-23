import Image from "next/image";
import Link from "next/link";
import SectionBadge from "@/components/ui/SectionBadge";
import type { ProductItem } from "@/types/landing";

interface ProductShowcaseProps {
  badge: string;
  title: string;
  titleAccent: string;
  items: ProductItem[];
  ctaLabel: string;
  ctaHref: string;
}

export default function ProductShowcase({
  badge,
  title,
  titleAccent,
  items,
  ctaLabel,
  ctaHref,
}: ProductShowcaseProps) {
  return (
    <section className="bg-white py-16 md:py-11">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <SectionBadge label={badge} />
          <h2 className="mt-6 font-serif text-3xl md:text-4xl">
            {title} <span className="text-rose">{titleAccent}</span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4 md:gap-x-8">
          {items.map((product) => (
            <Link
              key={product.id}
              href={product.href}
              className="group flex min-w-0 flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-[#f3f3f3]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <h3 className="mt-4 truncate font-serif text-sm text-foreground md:text-[15px]">
                {product.name}
              </h3>
              <p className="mt-1 text-sm font-semibold">
                {product.currency} {product.price.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={ctaHref}
            className="inline-block rounded-sm bg-rose px-7 py-3.5 font-serif text-sm tracking-wide text-white transition-colors hover:bg-dark-green"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
