"use client";

import { useState, type FormEvent } from "react";
import { Label } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";

/** Demo only: validates locally and confirms inline, no network request. */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setDone(true);
  };

  return (
    <form className="mt-8" onSubmit={onSubmit} noValidate>
      <Label as="p" className="mb-3">
        Brewing notes, monthly
      </Label>
      {done ? (
        <p role="status" className="text-sm text-ink">
          Thanks — the next brewing notes will land in your inbox.
        </p>
      ) : (
        <>
          <div className="flex gap-2">
            <label className="sr-only" htmlFor="footer-email">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "footer-email-error" : undefined}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 min-w-0 flex-1 rounded-(--radius-pill) border border-line bg-surface px-4 text-sm text-ink placeholder:text-ink-muted focus:border-roast focus:outline-none"
            />
            <Button type="submit" size="md">
              Subscribe
            </Button>
          </div>
          {error && (
            <p id="footer-email-error" className="mt-2 text-xs text-roast">
              {error}
            </p>
          )}
        </>
      )}
    </form>
  );
}
