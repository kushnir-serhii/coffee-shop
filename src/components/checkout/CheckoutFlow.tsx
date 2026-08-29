"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useCart } from "@/lib/cart";
import { orderReference, saveOrder } from "@/lib/order";
import { formatPrice } from "@/lib/types";

/* ---------------------------------------------------------------------- *
 * Shipping options. Standard inherits the cart's free-over-threshold rule;
 * express is always paid, so the choice stays legible at any basket size.
 * ---------------------------------------------------------------------- */

const EXPRESS_CENTS = 1200;

type Method = "standard" | "express";

const methods: Record<Method, { label: string; eta: string }> = {
  standard: { label: "Standard", eta: "3–5 working days" },
  express: { label: "Express", eta: "Next working day" },
};

/* ---------------------------------------------------------------------- *
 * Validation. Deliberately forgiving — this is a demo, not a payment form.
 * ---------------------------------------------------------------------- */

type Errors = Record<string, string>;

const digitsOnly = (v: string) => v.replace(/\D/g, "");

function validateContact(v: { name: string; email: string }): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Enter the name for the delivery.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
    e.email = "Enter a valid email address.";
  return e;
}

function validateDelivery(v: {
  address: string;
  city: string;
  postcode: string;
  country: string;
}): Errors {
  const e: Errors = {};
  if (v.address.trim().length < 4) e.address = "Enter a street and number.";
  if (v.city.trim().length < 2) e.city = "Enter a city.";
  if (!/^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/.test(v.postcode.trim()))
    e.postcode = "Enter a valid postcode.";
  if (v.country.trim().length < 2) e.country = "Enter a country.";
  return e;
}

function validatePayment(v: {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}): Errors {
  const e: Errors = {};
  if (v.cardName.trim().length < 2) e.cardName = "Enter the name on the card.";
  if (digitsOnly(v.cardNumber).length !== 16)
    e.cardNumber = "Card numbers are 16 digits.";

  const [mm, yy] = v.expiry.split("/");
  const month = Number(mm);
  const year = Number(yy);
  const now = new Date();
  const thisYear = now.getFullYear() % 100;
  if (!mm || !yy || Number.isNaN(month) || Number.isNaN(year)) {
    e.expiry = "Use MM/YY.";
  } else if (month < 1 || month > 12) {
    e.expiry = "That month does not exist.";
  } else if (year < thisYear || (year === thisYear && month < now.getMonth() + 1)) {
    e.expiry = "That card has expired.";
  }

  if (digitsOnly(v.cvc).length < 3) e.cvc = "Three digits, on the back.";
  return e;
}

/* ---------------------------------------------------------------------- */

export function CheckoutFlow() {
  const router = useRouter();
  const { lines, totals, ready, clear } = useCart();

  const [step, setStep] = useState(1);
  const [furthest, setFurthest] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [placing, setPlacing] = useState(false);

  const [contact, setContact] = useState({ name: "", email: "" });
  const [delivery, setDelivery] = useState({
    address: "",
    address2: "",
    city: "",
    postcode: "",
    country: "",
  });
  const [method, setMethod] = useState<Method>("standard");
  const [payment, setPayment] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const shippingCents =
    method === "express" ? EXPRESS_CENTS : totals.shippingCents;
  const totalCents = totals.subtotalCents + shippingCents;

  const goto = (next: number) => {
    setStep(next);
    setFurthest((f) => Math.max(f, next));
    setErrors({});
  };

  const advance = (found: Errors, next: number) => {
    setErrors(found);
    if (Object.keys(found).length === 0) goto(next);
  };

  const placeOrder = (event: FormEvent) => {
    event.preventDefault();
    const found = validatePayment(payment);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setPlacing(true);
    saveOrder({
      reference: orderReference(),
      placedAt: new Date().toISOString(),
      email: contact.email.trim(),
      recipient: contact.name.trim(),
      address: [
        delivery.address.trim(),
        delivery.address2.trim(),
        `${delivery.postcode.trim()} ${delivery.city.trim()}`.trim(),
        delivery.country.trim(),
      ].filter(Boolean),
      shippingLabel: methods[method].label,
      shippingEta: methods[method].eta,
      cardLast4: digitsOnly(payment.cardNumber).slice(-4),
      lines,
      subtotalCents: totals.subtotalCents,
      shippingCents,
      totalCents,
    });
    clear();
    router.push("/checkout/confirmation");
  };

  /* --- Guard states ---------------------------------------------------- */

  if (!ready) {
    return (
      <p className="py-24 text-center text-sm text-ink-muted">Loading cart…</p>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-24 text-center">
        <p className="font-display text-3xl text-ink">Nothing to check out</p>
        <p className="max-w-[34ch] text-base text-ink-body">
          Your cart is empty. Pick a coffee, or something to brew it with.
        </p>
        <div className="flex gap-3">
          <ButtonLink href="/coffee">Shop coffee</ButtonLink>
          <ButtonLink href="/equipment" variant="secondary">
            Equipment
          </ButtonLink>
        </div>
      </div>
    );
  }

  /* --- Flow ------------------------------------------------------------ */

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
      <div className="max-w-[46rem]">
        <Step
          index={1}
          title="Contact"
          step={step}
          furthest={furthest}
          onEdit={() => goto(1)}
          summary={`${contact.name} · ${contact.email}`}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="name"
              label="Full name"
              autoComplete="name"
              value={contact.name}
              error={errors.name}
              onChange={(e) =>
                setContact({ ...contact, name: e.target.value })
              }
            />
            <TextField
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              hint="Order confirmation goes here."
              value={contact.email}
              error={errors.email}
              onChange={(e) =>
                setContact({ ...contact, email: e.target.value })
              }
            />
          </div>
          <Button
            className="mt-7"
            onClick={() => advance(validateContact(contact), 2)}
          >
            Continue to delivery
          </Button>
        </Step>

        <Step
          index={2}
          title="Delivery"
          step={step}
          furthest={furthest}
          onEdit={() => goto(2)}
          summary={`${delivery.address}, ${delivery.city} · ${methods[method].label}`}
        >
          <div className="grid gap-5">
            <TextField
              id="address"
              label="Street and number"
              autoComplete="address-line1"
              value={delivery.address}
              error={errors.address}
              onChange={(e) =>
                setDelivery({ ...delivery, address: e.target.value })
              }
            />
            <TextField
              id="address2"
              label="Apartment, floor (optional)"
              autoComplete="address-line2"
              value={delivery.address2}
              onChange={(e) =>
                setDelivery({ ...delivery, address2: e.target.value })
              }
            />
            <div className="grid gap-5 sm:grid-cols-3">
              <TextField
                id="postcode"
                label="Postcode"
                autoComplete="postal-code"
                value={delivery.postcode}
                error={errors.postcode}
                onChange={(e) =>
                  setDelivery({ ...delivery, postcode: e.target.value })
                }
              />
              <TextField
                id="city"
                label="City"
                autoComplete="address-level2"
                className="sm:col-span-2"
                value={delivery.city}
                error={errors.city}
                onChange={(e) =>
                  setDelivery({ ...delivery, city: e.target.value })
                }
              />
            </div>
            <TextField
              id="country"
              label="Country"
              autoComplete="country-name"
              value={delivery.country}
              error={errors.country}
              onChange={(e) =>
                setDelivery({ ...delivery, country: e.target.value })
              }
            />
          </div>

          <fieldset className="mt-8">
            <legend className="label mb-3 text-ink-muted">Method</legend>
            <div className="grid gap-2" role="radiogroup" aria-label="Shipping method">
              {(Object.keys(methods) as Method[]).map((key) => {
                const selected = method === key;
                const cost =
                  key === "express" ? EXPRESS_CENTS : totals.shippingCents;
                return (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setMethod(key)}
                    className={`flex items-center justify-between gap-4 rounded-(--radius-card) border px-4 py-3.5 text-left transition-colors duration-200 ${
                      selected
                        ? "border-ink bg-surface"
                        : "border-line hover:border-ink-muted"
                    }`}
                  >
                    <span>
                      <span className="block text-sm text-ink">
                        {methods[key].label}
                      </span>
                      <span className="mt-0.5 block text-xs text-ink-muted">
                        {methods[key].eta}
                      </span>
                    </span>
                    <span className="font-mono text-sm text-ink tabular-nums">
                      {cost === 0 ? "Free" : formatPrice(cost)}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <Button
            className="mt-7"
            onClick={() => advance(validateDelivery(delivery), 3)}
          >
            Continue to payment
          </Button>
        </Step>

        <Step
          index={3}
          title="Payment"
          step={step}
          furthest={furthest}
          onEdit={() => goto(3)}
          summary=""
          last
        >
          <p className="mb-6 rounded-(--radius-card) border border-line bg-muted px-4 py-3 text-xs text-ink-body">
            Demo checkout — no payment is taken and nothing is sent anywhere.
            Please don&apos;t enter a real card number.
          </p>

          <form onSubmit={placeOrder} noValidate>
            <div className="grid gap-5">
              <TextField
                id="cardName"
                label="Name on card"
                autoComplete="off"
                value={payment.cardName}
                error={errors.cardName}
                onChange={(e) =>
                  setPayment({ ...payment, cardName: e.target.value })
                }
              />
              <TextField
                id="cardNumber"
                label="Card number"
                inputMode="numeric"
                autoComplete="off"
                placeholder="4242 4242 4242 4242"
                value={payment.cardNumber}
                error={errors.cardNumber}
                onChange={(e) =>
                  setPayment({
                    ...payment,
                    cardNumber: digitsOnly(e.target.value)
                      .slice(0, 16)
                      .replace(/(.{4})/g, "$1 ")
                      .trim(),
                  })
                }
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  id="expiry"
                  label="Expiry"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="MM/YY"
                  value={payment.expiry}
                  error={errors.expiry}
                  onChange={(e) => {
                    const d = digitsOnly(e.target.value).slice(0, 4);
                    setPayment({
                      ...payment,
                      expiry:
                        d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d,
                    });
                  }}
                />
                <TextField
                  id="cvc"
                  label="CVC"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="123"
                  value={payment.cvc}
                  error={errors.cvc}
                  onChange={(e) =>
                    setPayment({
                      ...payment,
                      cvc: digitsOnly(e.target.value).slice(0, 4),
                    })
                  }
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={placing}
              className="mt-8 w-full sm:w-auto sm:min-w-64"
            >
              {placing ? "Placing order…" : `Pay ${formatPrice(totalCents)}`}
            </Button>
          </form>
        </Step>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <OrderSummary
          lines={lines}
          subtotalCents={totals.subtotalCents}
          shippingCents={shippingCents}
          totalCents={totalCents}
          shippingLabel={`Shipping · ${methods[method].label}`}
        />
      </aside>
    </div>
  );
}

/* ---------------------------------------------------------------------- *
 * One accordion step. Collapsed steps keep their number and a one-line
 * summary, so the page reads as a receipt being filled in rather than a wizard.
 * ---------------------------------------------------------------------- */

function Step({
  index,
  title,
  step,
  furthest,
  summary,
  onEdit,
  last = false,
  children,
}: {
  index: number;
  title: string;
  step: number;
  furthest: number;
  summary: string;
  onEdit: () => void;
  last?: boolean;
  children: React.ReactNode;
}) {
  const open = step === index;
  const done = step > index;
  const reachable = furthest >= index;

  return (
    <section
      aria-current={open ? "step" : undefined}
      className={`border-t border-line py-8 ${last ? "border-b" : ""} ${
        reachable ? "" : "opacity-40"
      }`}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="flex items-baseline gap-4">
          <span className="font-mono text-xs text-ink-muted tabular-nums">
            {String(index).padStart(2, "0")}
          </span>
          <span className="font-display text-2xl text-ink">{title}</span>
        </h2>
        {done && (
          <button
            type="button"
            onClick={onEdit}
            className="text-xs text-ink-muted underline underline-offset-4 transition-colors hover:text-ink"
          >
            Edit<span className="sr-only"> {title}</span>
          </button>
        )}
      </div>

      {done && summary && (
        <p className="mt-3 pl-10 text-sm text-ink-body">{summary}</p>
      )}

      {open && <div className="mt-7">{children}</div>}
    </section>
  );
}
