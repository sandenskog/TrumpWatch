"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PartyPopperIcon from "@/icons/party-popper-icon";
import SendIcon from "@/icons/send-icon";
import MailFilledIcon from "@/icons/mail-filled-icon";

export function EmailSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setState("success");
        setEmail("");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <div className="bg-[var(--color-crimson-dark)] text-white py-8 px-6 sm:px-10">
      <div className="max-w-xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <MailFilledIcon size={22} color="white" />
          <h2 className="font-playfair text-xl sm:text-2xl font-bold">
            Never Miss a Day of Chaos
          </h2>
        </div>
        <p className="text-red-200/80 text-sm mb-5 font-serif">
          Get the daily digest delivered to your inbox. It&apos;s free, funny,
          and slightly terrifying.
        </p>

        <AnimatePresence mode="wait">
          {state === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-3"
            >
              <span className="inline-flex text-green-300">
                <PartyPopperIcon size={36} color="currentColor" />
              </span>
              <p className="font-bold mt-2 font-playfair text-lg">
                You&apos;re in!
              </p>
              <p className="text-sm text-red-200/70 font-serif">
                Daily dose of democracy watch, straight to your inbox.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="flex gap-0 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state === "error") setState("idle");
                }}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white text-sm placeholder:text-red-200/50 focus:outline-none focus:bg-white/15 focus:border-white/40 transition-colors"
              />
              <button
                type="submit"
                disabled={state === "loading"}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[var(--color-crimson-dark)] text-sm font-bold uppercase tracking-wider hover:bg-red-50 disabled:opacity-50 transition-colors whitespace-nowrap"
              >
                {state === "loading" ? (
                  "..."
                ) : (
                  <>
                    <SendIcon size={14} color="currentColor" />
                    Subscribe
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
        {state === "error" && (
          <p className="text-xs text-red-300 mt-3">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
