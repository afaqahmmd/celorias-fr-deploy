import type { Metadata } from "next";
import Header from "@/components/landing/Header";
import CheckoutView from "@/components/orders/CheckoutView";
import { landingMock } from "@/data/mock/landing";

export const metadata: Metadata = {
  title: "Checkout | Celoria",
  description: "Complete your Celoria order.",
};

export default function OrdersPage() {
  return (
    <>
      <Header navLinks={landingMock.navLinks} />
      <main className="flex-1">
        <CheckoutView />
      </main>
    </>
  );
}
