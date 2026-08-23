import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  max?: number;
}

export default function StarRating({ rating, max = 5 }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, index) => (
        <FaStar
          key={index}
          className={`h-4 w-4 ${
            index < rating ? "text-gold" : "text-white/30"
          }`}
        />
      ))}
    </div>
  );
}
