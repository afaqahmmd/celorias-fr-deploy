import { FiShield, FiSmile, FiTruck } from "react-icons/fi";
import type { IconType } from "react-icons";

const BADGES: { label: string; Icon: IconType }[] = [
  { label: "Free Shipping and exchanges", Icon: FiTruck },
  {
    label: "Flexible and Secure Payment, Pay on Delivery",
    Icon: FiShield,
  },
  { label: "600,000 Happy Customers", Icon: FiSmile },
];

export default function ProductTrustBadges() {
  return (
    <ul className="mt-6 space-y-3">
      {BADGES.map(({ label, Icon }) => (
        <li
          key={label}
          className="flex items-start gap-2.5 text-sm text-text-muted"
        >
          <Icon
            className="mt-0.5 h-4 w-4 shrink-0 text-foreground"
            aria-hidden="true"
          />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}
