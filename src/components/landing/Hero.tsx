import Image from "next/image";

interface HeroProps {
  badge: string;
  title: string;
  subtitle: string;
  images: string[];
}

export default function Hero({ badge, title, subtitle, images }: HeroProps) {
  const slides = images.filter(Boolean);

  return (
    <section className="relative flex min-h-24rem items-center justify-center overflow-hidden sm:min-h-28rem md:min-h-36rem xl:min-h-39rem">
      {slides.map((src, index) => (
        <div
          key={src}
          className={
            slides.length > 1
              ? "hero-crossfade-slide absolute inset-0"
              : "absolute inset-0"
          }
          style={
            slides.length > 1
              ? { animationDelay: `${(-index * 8) / slides.length}s` }
              : undefined
          }
        >
          <Image
            src={src}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      ))}
      <div className="absolute inset-0 z-1 bg-[#1c1410]/80" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 text-center sm:py-24 md:py-28">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-[#3d2a24]/80 px-5 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          <span className="text-[11px] tracking-[0.18em] text-white uppercase">
            {badge}
          </span>
        </div>

        <h1 className="font-serif text-[32px] font-normal leading-[1.2] whitespace-pre-line text-white sm:text-[40px] md:text-[52px] lg:text-[56px]">
          {title}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-[1.7] font-normal text-white/80 md:text-base">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
