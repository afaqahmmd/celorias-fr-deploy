"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { getCart } from "@/actions/cart";
import { placeOrder } from "@/actions/orders";
import OrderConfirmedModal from "@/components/orders/OrderConfirmedModal";
import OrderSummary from "@/components/orders/OrderSummary";
import { getCartAuth } from "@/lib/auth";
import {
  CHECKOUT_CITIES,
  CHECKOUT_STORAGE_KEY,
  DEFAULT_CHECKOUT,
  DEFAULT_COUNTRY,
  PAYMENT_OPTIONS,
  postalFromCity,
  readSavedCheckout,
  regionFromCity,
  subscribeCheckoutStorage,
  type SavedCheckout,
} from "@/lib/checkout";
import { notifyError, notifyFromResult } from "@/lib/notify";
import { useCartStore } from "@/stores/cart";
import type { ApiCart, PaymentMethod, PlaceOrderAddress } from "@/types/api";

const EMPTY_CART: ApiCart = {
  id: null,
  items: [],
  itemCount: 0,
  subtotal: "0",
};

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-text-muted focus:border-rose";

function RadioCard({
  name,
  value,
  checked,
  label,
  onChange,
}: {
  name: string;
  value: string;
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm ${
        checked ? "border-foreground" : "border-gray-300"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="accent-foreground"
      />
      <span>{label}</span>
    </label>
  );
}

function PaymentMethodCard({
  value,
  checked,
  label,
  description,
  details,
  onChange,
}: {
  value: PaymentMethod;
  checked: boolean;
  label: string;
  description: string;
  details?: string[];
  onChange: () => void;
}) {
  return (
    <label
      className={`block cursor-pointer rounded-md border px-4 py-3 text-sm ${
        checked ? "border-foreground bg-[#f9f9f9]" : "border-gray-300 bg-white"
      }`}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="font-medium text-foreground">{label}</span>
        <input
          type="radio"
          name="paymentMethod"
          value={value}
          checked={checked}
          onChange={onChange}
          className="accent-rose-dark"
        />
      </span>
      {checked ? (
        <span className="mt-2 block space-y-0.5 text-sm leading-6 text-text-muted">
          <span className="block">{description}</span>
          {details?.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </span>
      ) : null}
    </label>
  );
}

function FieldLabel({
  htmlFor,
  children,
  required = false,
}: {
  htmlFor: string;
  children: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm text-foreground">
      {children}
      {required ? <span className="ml-0.5 text-rose-dark">*</span> : null}
    </label>
  );
}

export default function CheckoutView() {
  const setFromCart = useCartStore((state) => state.setFromCart);
  const clearCartCount = useCartStore((state) => state.clear);
  const storedCheckout = useSyncExternalStore(
    subscribeCheckoutStorage,
    readSavedCheckout,
    () => DEFAULT_CHECKOUT,
  );
  const [form, setForm] = useState<SavedCheckout | null>(null);
  const checkout = form ?? storedCheckout;

  const [cart, setCart] = useState<ApiCart | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("CASH_ON_DELIVERY");
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const [billingFirstName, setBillingFirstName] = useState("");
  const [billingLastName, setBillingLastName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingApartment, setBillingApartment] = useState("");
  const [billingCity, setBillingCity] = useState("Islamabad");
  const [billingPostalCode, setBillingPostalCode] = useState("44000");

  useEffect(() => {
    async function loadCart() {
      try {
        const result = await getCart(getCartAuth());
        if (result.success) {
          setCart(result.cart);
          setFromCart(result.cart);
        } else {
          setCart(EMPTY_CART);
          notifyError(result.message);
        }
      } catch {
        setCart(EMPTY_CART);
        notifyError("Could not load cart.");
      }
    }

    void loadCart();
  }, [setFromCart]);

  function updateCheckout<Key extends keyof SavedCheckout>(
    key: Key,
    value: SavedCheckout[Key],
  ) {
    setForm({
      ...checkout,
      [key]: value,
    });
  }

  function handleCityChange(nextCity: string) {
    setForm({
      ...checkout,
      city: nextCity,
      postalCode: postalFromCity(nextCity),
    });
  }

  function handleBillingCityChange(nextCity: string) {
    setBillingCity(nextCity);
    setBillingPostalCode(postalFromCity(nextCity));
  }

  function resetVisibleForm() {
    setForm({
      ...DEFAULT_CHECKOUT,
      saveInfo: checkout.saveInfo,
      newsOffers: checkout.newsOffers,
    });
    setPaymentMethod("CASH_ON_DELIVERY");
    setBillingSameAsShipping(true);
    setBillingFirstName("");
    setBillingLastName("");
    setBillingAddress("");
    setBillingApartment("");
    setBillingCity("Islamabad");
    setBillingPostalCode("44000");
  }

  function persistCheckout() {
    if (!checkout.saveInfo) {
      window.localStorage.removeItem(CHECKOUT_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(checkout));
  }

  function buildAddress(values: {
    firstName: string;
    lastName: string;
    address: string;
    apartment: string;
    city: string;
    postalCode: string;
  }): PlaceOrderAddress {
    return {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      country: DEFAULT_COUNTRY,
      region: regionFromCity(values.city),
      address: values.address.trim(),
      apartment: values.apartment.trim() || undefined,
      city: values.city.trim(),
      postalCode: values.postalCode.trim(),
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || !cart || cart.items.length === 0) {
      return;
    }

    setIsSubmitting(true);

    const shipping = buildAddress({
      firstName: checkout.firstName,
      lastName: checkout.lastName,
      address: checkout.address,
      apartment: checkout.apartment,
      city: checkout.city,
      postalCode: checkout.postalCode,
    });

    try {
      const result = await placeOrder(getCartAuth(), {
        contactEmail: checkout.contactEmail.trim(),
        contactPhone: `+92 ${checkout.phone.trim()}`,
        firstName: shipping.firstName,
        lastName: shipping.lastName,
        country: shipping.country,
        region: shipping.region,
        address: shipping.address,
        apartment: shipping.apartment,
        city: shipping.city,
        postalCode: shipping.postalCode,
        paymentMethod,
        billingSameAsShipping,
        billing: billingSameAsShipping
          ? undefined
          : buildAddress({
              firstName: billingFirstName,
              lastName: billingLastName,
              address: billingAddress,
              apartment: billingApartment,
              city: billingCity,
              postalCode: billingPostalCode,
            }),
      });

      if (!result.success) {
        notifyFromResult(result);
        return;
      }

      persistCheckout();
      resetVisibleForm();
      setOrderNumber(result.order.orderNumber);
      setCart(EMPTY_CART);
      clearCartCount();
      notifyFromResult(result, { successMessage: "Order placed successfully" });
    } catch {
      notifyError("Could not place order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <>
    <div>
      <div className="lg:hidden">
        <OrderSummary cart={cart} collapsible />
      </div>
      <div className="lg:grid lg:grid-cols-5 lg:items-start">
      <form
        onSubmit={handleSubmit}
        className="space-y-8 px-4 py-8 lg:col-span-3 lg:px-16 lg:py-10"
      >
        <section>
          <h2 className="font-serif text-2xl text-foreground">Contact</h2>
          <div className="mt-4">
            <FieldLabel htmlFor="contactEmail">
              Email or mobile phone number
            </FieldLabel>
            <input
              id="contactEmail"
              type="email"
              required
              placeholder="Email or mobile phone number"
              value={checkout.contactEmail}
              onChange={(event) =>
                updateCheckout("contactEmail", event.target.value)
              }
              className={inputClass}
            />
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-foreground">Delivery</h2>
          <div className="mt-4 space-y-4">
            <div>
              <FieldLabel htmlFor="country" required>
                Country/Region
              </FieldLabel>
              <select
                id="country"
                required
                value={DEFAULT_COUNTRY}
                onChange={() => undefined}
                className={inputClass}
              >
                <option value={DEFAULT_COUNTRY}>{DEFAULT_COUNTRY}</option>
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="firstName" required>
                  First Name
                </FieldLabel>
                <input
                  id="firstName"
                  required
                  placeholder="First name"
                  value={checkout.firstName}
                  onChange={(event) =>
                    updateCheckout("firstName", event.target.value)
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <FieldLabel htmlFor="lastName" required>
                  Last Name
                </FieldLabel>
                <input
                  id="lastName"
                  required
                  placeholder="Last name"
                  value={checkout.lastName}
                  onChange={(event) =>
                    updateCheckout("lastName", event.target.value)
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="address" required>
                Address
              </FieldLabel>
              <input
                id="address"
                required
                placeholder="Address"
                value={checkout.address}
                onChange={(event) =>
                  updateCheckout("address", event.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <FieldLabel htmlFor="apartment">Apartment</FieldLabel>
              <input
                id="apartment"
                placeholder="Apartment, suite, etc."
                value={checkout.apartment}
                onChange={(event) =>
                  updateCheckout("apartment", event.target.value)
                }
                className={inputClass}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="city" required>
                  City
                </FieldLabel>
                <select
                  id="city"
                  required
                  value={checkout.city}
                  onChange={(event) => handleCityChange(event.target.value)}
                  className={inputClass}
                >
                  {CHECKOUT_CITIES.map((option) => (
                    <option key={option.city} value={option.city}>
                      {option.city}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="postalCode" required>
                  Postal Code
                </FieldLabel>
                <input
                  id="postalCode"
                  required
                  placeholder="Postal code"
                  value={checkout.postalCode}
                  onChange={(event) =>
                    updateCheckout("postalCode", event.target.value)
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="phone" required>
                Phone
              </FieldLabel>
              <div className="flex overflow-hidden rounded-md border border-gray-300 focus-within:border-rose">
                <span className="flex items-center border-r border-gray-300 bg-[#f7f7f7] px-3 text-sm text-foreground">
                  +92
                </span>
                <input
                  id="phone"
                  type="tel"
                  required
                  placeholder="300 1234567"
                  value={checkout.phone}
                  onChange={(event) =>
                    updateCheckout("phone", event.target.value)
                  }
                  className="w-full bg-white px-3 py-2.5 text-sm outline-none placeholder:text-text-muted"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={checkout.saveInfo}
                onChange={(event) =>
                  updateCheckout("saveInfo", event.target.checked)
                }
                className="accent-foreground"
              />
              Save This Information For Next Time
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={checkout.newsOffers}
                onChange={(event) =>
                  updateCheckout("newsOffers", event.target.checked)
                }
                className="accent-foreground"
              />
              Text Me With News And Offers
            </label>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-foreground">Payment</h2>
          <p className="mt-2 text-sm text-text-muted">
            All transactions are secure and encrypted.
          </p>
          <div className="mt-4 space-y-3">
            {PAYMENT_OPTIONS.map((option) => (
              <PaymentMethodCard
                key={option.value}
                value={option.value}
                checked={paymentMethod === option.value}
                label={option.label}
                description={option.description}
                details={option.details}
                onChange={() => setPaymentMethod(option.value)}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-foreground">
            Billing Address
          </h2>
          <div className="mt-4 space-y-3">
            <RadioCard
              name="billingAddress"
              value="same"
              checked={billingSameAsShipping}
              label="Same as shipping address"
              onChange={() => setBillingSameAsShipping(true)}
            />
            <RadioCard
              name="billingAddress"
              value="different"
              checked={!billingSameAsShipping}
              label="Use a different billing address"
              onChange={() => setBillingSameAsShipping(false)}
            />
          </div>

          {!billingSameAsShipping ? (
            <div className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="billingFirstName" required>
                    First Name
                  </FieldLabel>
                  <input
                    id="billingFirstName"
                    required
                    placeholder="First name"
                    value={billingFirstName}
                    onChange={(event) =>
                      setBillingFirstName(event.target.value)
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="billingLastName" required>
                    Last Name
                  </FieldLabel>
                  <input
                    id="billingLastName"
                    required
                    placeholder="Last name"
                    value={billingLastName}
                    onChange={(event) => setBillingLastName(event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="billingAddressLine" required>
                  Address
                </FieldLabel>
                <input
                  id="billingAddressLine"
                  required
                  placeholder="Address"
                  value={billingAddress}
                  onChange={(event) => setBillingAddress(event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <FieldLabel htmlFor="billingApartment">Apartment</FieldLabel>
                <input
                  id="billingApartment"
                  placeholder="Apartment, suite, etc."
                  value={billingApartment}
                  onChange={(event) => setBillingApartment(event.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="billingCity" required>
                    City
                  </FieldLabel>
                  <select
                    id="billingCity"
                    required
                    value={billingCity}
                    onChange={(event) =>
                      handleBillingCityChange(event.target.value)
                    }
                    className={inputClass}
                  >
                    {CHECKOUT_CITIES.map((option) => (
                      <option key={option.city} value={option.city}>
                        {option.city}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel htmlFor="billingPostalCode" required>
                    Postal Code
                  </FieldLabel>
                  <input
                    id="billingPostalCode"
                    required
                    placeholder="Postal code"
                    value={billingPostalCode}
                    onChange={(event) =>
                      setBillingPostalCode(event.target.value)
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <section>
          <div className="flex items-center justify-between rounded-md border border-gray-300 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Shipping method
              </p>
              <p className="mt-1 text-sm text-text-muted">
                Standard Shipping method
              </p>
            </div>
            <p className="text-sm font-semibold">Rs 200</p>
          </div>
        </section>

        <button
          type="submit"
          disabled={isEmpty || isSubmitting}
          className="w-full bg-rose-dark py-3.5 font-serif text-sm tracking-wide text-white transition-colors hover:bg-dark-green disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Placing Order..." : "Complete Order"}
        </button>
      </form>

      <div className="hidden lg:sticky lg:top-0 lg:col-span-2 lg:block lg:min-h-screen">
        <OrderSummary cart={cart} />
      </div>
      </div>
    </div>

    {orderNumber ? (
      <OrderConfirmedModal
        orderNumber={orderNumber}
        onClose={() => setOrderNumber("")}
      />
    ) : null}
    </>
  );
}
