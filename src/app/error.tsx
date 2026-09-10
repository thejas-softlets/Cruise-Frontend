"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[80svh] max-w-2xl flex-col items-center justify-center px-5 py-32 text-center sm:px-8">
      <p className="font-script text-4xl text-gold-bright">oops</p>
      <h1 className="font-display mt-4 text-5xl font-medium">Something went wrong.</h1>
      <p className="mt-4 max-w-md text-text-muted">
        An unexpected error occurred. Please try again, or reach us on WhatsApp.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-9 inline-flex min-h-12 items-center rounded-full bg-obsidian px-8 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-500 hover:bg-gold-bright"
      >
        Try again
      </button>
    </section>
  );
}
