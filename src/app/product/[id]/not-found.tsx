import Link from "next/link";
import SiteChrome from "@/components/layout/SiteChrome";

export default function ProductNotFound() {
  return (
    <SiteChrome>
      <section className="bg-white py-24">
        <div className="mx-auto max-w-xl px-6 text-center">
          <h1 className="font-serif text-3xl text-foreground">
            Product not found
          </h1>
          <p className="mt-3 text-sm text-text-muted">
            This product is unavailable or the link may be incorrect.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-block bg-rose px-7 py-3.5 font-serif text-sm tracking-wide text-white transition-colors hover:bg-dark-green"
          >
            Back to Shop
          </Link>
        </div>
      </section>
    </SiteChrome>
  );
}
