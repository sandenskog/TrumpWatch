"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PartyPopperIcon from "@/icons/party-popper-icon";
import SendIcon from "@/icons/send-icon";

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
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {state === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <span className="inline-flex text-green-600">
              <PartyPopperIcon size={36} />
            </span>
            <p className="font-semibold mt-2">You&apos;re in!</p>
            <p className="text-sm text-neutral-500">
              Daily dose of democracy watch, straight to your inbox.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="flex gap-2"
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
              className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-shadow"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {state === "loading" ? (
                "..."
              ) : (
                <>
                  <SendIcon size={14} color="currentColor" />
                  Get Daily Digest
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      {state === "error" && (
        <p className="text-xs text-red-500 mt-2 text-center">
          Something went wrong. Try again?
        </p>
      )}
    </div>
  );
}
