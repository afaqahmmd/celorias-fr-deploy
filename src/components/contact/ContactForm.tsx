"use client";

import { FormEvent, useState } from "react";
import CeloriaLogo from "@/components/ui/CeloriaLogo";
import { notifySuccess } from "@/lib/notify";

const STANDARD_PERKS = [
  "Complimentary Sizing & Care",
  "Insured Nationwide Delivery",
];

const inputClass =
  "w-full rounded-md border border-[#6B6666] bg-[#F7EFEB] px-4 py-3 text-sm text-foreground outline-none placeholder:text-text-muted focus:border-rose";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
};

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block font-serif text-sm text-foreground"
    >
      {children}
      <span className="text-rose">*</span>
    </label>
  );
}

export default function ContactForm() {
  const [form, setForm] = useState(emptyForm);

  function updateField(field: keyof typeof emptyForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    notifySuccess("Thank you for your message. We will be in touch soon.");
    setForm(emptyForm);
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
      <div className="flex flex-col justify-center rounded-2xl bg-[#FAF6F0] px-8 py-10 shadow-[0_12px_40px_rgba(68,57,52,0.08)] md:px-7 lg:px-14">
        <div className="flex justify-center">
          <CeloriaLogo height={180} width={600} />
        </div>
        <h3 className="mt-4 text-sm font-semibold tracking-[0.14em] text-rose uppercase md:text-base">
          The Celorias Standard
        </h3>
        <p className="mt-4 font-serif text-sm leading-relaxed text-foreground md:text-[13px] md:leading-7">
          We Build Something Truly Unique in Jewellery. Our Quality, Purity, And
          Craftsmanship Are Simply The Best.
        </p>
        <ul className="mt-4 space-y-3">
          {STANDARD_PERKS.map((perk) => (
            <li key={perk} className="flex items-start gap-2.5">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground"
                aria-hidden="true"
              />
              <span className="font-serif text-[13px] text-foreground">
                {perk}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-between gap-5"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              autoComplete="given-name"
              placeholder="Enter First Name"
              value={form.firstName}
              onChange={(event) => updateField("firstName", event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              autoComplete="family-name"
              placeholder="Enter Last Name"
              value={form.lastName}
              onChange={(event) => updateField("lastName", event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Enter Email Address"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="Enter mobile phone number"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="message">Message</FieldLabel>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder="Any Additional Message"
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            className={`${inputClass} resize-y`}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-[#8E5C63] py-3.5 font-serif text-base text-white transition-colors hover:bg-mauve/90"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
