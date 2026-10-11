import type { Metadata } from "next";
import ContactPageView from "@/components/contact/ContactPageView";

export const metadata: Metadata = {
  title: "Contact Us | Celoria",
  description:
    "Get in touch with Celoria. Reach us by phone or email, or send a message and our team will be happy to help.",
};

export default function ContactPage() {
  return <ContactPageView />;
}
