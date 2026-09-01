"use client";

import Image from "next/image";
import { FormEvent, useState, type ReactNode } from "react";
import {
  FaApplePay,
  FaInstagram,
  FaPinterest,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { SiVisa } from "react-icons/si";
import { FiArrowRight, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import CeloriaLogo from "@/components/ui/CeloriaLogo";
import { siteAssets } from "@/config/assets";
import type { FooterLink, SocialLink } from "@/types/landing";
interface FooterProps {
  tagline: string;
  customerCareLinks: FooterLink[];
  companyLinks: FooterLink[];
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  socials: SocialLink[];
  copyright: string;
  paymentLabel: string;
}

const socialIcons = {
  instagram: FaInstagram,
  tiktok: FaTiktok,
  youtube: FaYoutube,
  pinterest: FaPinterest,
} as const;

function FooterLinkList({ links }: { links: FooterLink[] }) {
  return (
    <ul className="mt-5 space-y-2.5">
      {links.map((link) => (
        <li key={link.href} className="flex items-start gap-2.5">
          <span
            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/80"
            aria-hidden="true"
          />
          <a
            href={link.href}
            className="text-[13px] leading-snug text-foreground transition-colors hover:text-rose"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function ContactRow({
  icon: Icon,
  children,
}: {
  icon: typeof FiPhone;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-1">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mauve text-white">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <p className="pt-0.5 text-[13px] leading-snug text-text-muted">
        {children}
      </p>
    </div>
  );
}

const paymentIconSlot =
  "inline-flex h-8 w-18 shrink-0 items-center justify-center";
const paymentIconImage = "h-full w-full object-contain text-white";

function MastercardBadge() {
  return (
    <span className={paymentIconSlot} aria-label="Mastercard">
      <svg viewBox="0 0 38 24" className={paymentIconImage} role="img">
        <circle cx="15" cy="12" r="7.5" fill="#EB001B" />
        <circle cx="23" cy="12" r="7.5" fill="#F79E1B" />
        <path
          d="M19 6.7a7.5 7.5 0 0 0 0 10.6 7.5 7.5 0 0 0 0-10.6Z"
          fill="#FF5F00"
        />
      </svg>
    </span>
  );
}

function VisaBadge() {
  return (
    <span className={paymentIconSlot} aria-label="Visa">
      <SiVisa className={paymentIconImage} />
    </span>
  );
}

function PayPalBadge() {
  return (
    <span className={paymentIconSlot}>
      <Image
        src={siteAssets.paypal}
        alt="PayPal"
        width={120}
        height={32}
        className={paymentIconImage}
      />
    </span>
  );
}

function JazzCashBadge() {
  return (
    <span className={paymentIconSlot}>
      <Image
        src={siteAssets.jazzcash}
        alt="JazzCash"
        width={72}
        height={42}
        className={paymentIconImage}
      />
    </span>
  );
}

function ApplePayBadge() {
  return (
    <span className={`${paymentIconSlot} text-white`} aria-label="Apple Pay">
      <FaApplePay className={paymentIconImage} />
    </span>
  );
}

export default function Footer({
  tagline,
  customerCareLinks,
  companyLinks,
  contact,
  socials,
  copyright,
  paymentLabel,
}: FooterProps) {
  const [email, setEmail] = useState("");

  function handleSubscribe(e: FormEvent) {
    e.preventDefault();
    setEmail("");
  }

  return (
    <footer className="bg-cream">
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-8 lg:px-10">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <CeloriaLogo height={68} width={300} />
            <p className="mt-4 max-w-70 text-[13px] leading-relaxed text-text-muted">
              {tagline}
            </p>

            <form onSubmit={handleSubscribe} className="relative mt-5 max-w-70">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your email"
                required
                className="w-full rounded-full border border-rose/70 bg-white py-2.5 pr-14 pl-5 text-sm text-foreground outline-none placeholder:text-rose/60 focus:border-rose"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="absolute top-1/2 right-1 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-dark-green text-white transition-colors hover:bg-dark-green/90"
              >
                <FiArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div>
            <h3 className="font-serif text-[13px] tracking-[0.12em] text-foreground uppercase">
              Customer Care
            </h3>
            <FooterLinkList links={customerCareLinks} />
          </div>

          <div>
            <h3 className="font-serif text-[13px] tracking-[0.12em] text-foreground uppercase">
              Company
            </h3>
            <FooterLinkList links={companyLinks} />
          </div>

          <div>
            <h3 className="font-serif text-[13px] tracking-[0.12em] text-foreground uppercase">
              Contact Information
            </h3>
            <div className="mt-5 space-y-3.5">
              <ContactRow icon={FiPhone}>{contact.phone}</ContactRow>
              <ContactRow icon={FiMail}>{contact.email}</ContactRow>
              <ContactRow icon={FiMapPin}>{contact.address}</ContactRow>
            </div>

            <div className="mt-6">
              <p className="text-[11px] tracking-wider text-foreground uppercase">
                Socials :
              </p>
              <div className="mt-3 flex gap-2">
                {socials.map((social) => {
                  const Icon = socialIcons[social.platform];
                  return (
                    <a
                      key={social.platform}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.platform}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-dark-green text-white transition-colors hover:bg-dark-green/90"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <hr className="mt-10 border-gray-300/50" />

        <p className="mt-6 text-center text-[13px] text-text-muted">
          {copyright}
        </p>
      </div>

      <div className="bg-dark-green">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-6 py-4 lg:px-10">
          <p className="text-[13px] text-white/90">{paymentLabel}</p>
          <div className="flex flex-wrap items-center gap-4">
            <MastercardBadge />
            <VisaBadge />
            <PayPalBadge />
            <JazzCashBadge />
            <ApplePayBadge />
          </div>
        </div>
      </div>
    </footer>
  );
}
