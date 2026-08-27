import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  max?: number;
  variant?: "onDark" | "onLight";
}

export default function StarRating({
  rating,
  max = 5,
  variant = "onDark",
}: StarRatingProps) {
  const emptyClass = variant === "onLight" ? "text-[#e8e0d8]" : "text-white/30";

  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, index) => (
        <FaStar
          key={index}
          className={`h-4 w-4 ${index < rating ? "text-gold" : emptyClass}`}
        />
      ))}
    </div>
  );
}
