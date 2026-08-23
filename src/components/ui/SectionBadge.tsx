interface SectionBadgeProps {
  label: string;
  variant?: "light" | "dark";
}

export default function SectionBadge({
  label,
  variant = "light",
}: SectionBadgeProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-6 py-2 ${
        isDark ? "border-white/40 text-white" : "border-[#B18384] text-[#B18384]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isDark ? "bg-white" : "bg-[#B18384]"
        }`}
      />
      <span className="font-serif text-[12px] tracking-[0.16em] uppercase">
        {label}
      </span>
    </div>
  );
}
