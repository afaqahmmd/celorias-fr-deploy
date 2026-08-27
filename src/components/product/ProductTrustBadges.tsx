import { FiShield, FiTruck, FiUsers } from "react-icons/fi";

const BADGES = [
  {
    icon: FiTruck,
    label: "Free Shipping and exchanges",
  },
  {
    icon: FiShield,
    label: "Flexible and Secure Payment, Pay on Delivery",
  },
  {
    icon: FiUsers,
    label: "600,000 Happy Customers",
  },
] as const;

export default function ProductTrustBadges() {
  return (
    <ul className="mt-8 space-y-3.5">
      {BADGES.map((badge) => {
        const Icon = badge.icon;

        return (
          <li
            key={badge.label}
            className="flex items-center gap-3 text-sm text-text-muted"
          >
            <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            <span>{badge.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
