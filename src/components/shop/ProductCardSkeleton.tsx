export default function ProductCardSkeleton() {
  return (
    <article className="flex min-w-0 flex-col" aria-hidden="true">
      <div className="aspect-square animate-pulse bg-[#f3f3f3]" />
      <div className="mt-4 h-4 w-3/4 animate-pulse rounded-sm bg-[#ececec]" />
      <div className="mt-1 h-4 w-16 animate-pulse rounded-sm bg-[#ececec]" />
      <div className="mt-2 flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className="h-4 w-4 animate-pulse rounded-sm bg-[#ececec]"
          />
        ))}
      </div>
    </article>
  );
}
