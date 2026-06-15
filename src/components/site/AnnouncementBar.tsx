"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const SALE_END = new Date("2026-07-31T23:59:59+08:00");

function useCountdown(target: Date) {
  const [ms, setMs] = useState(() => Math.max(0, target.getTime() - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setMs(Math.max(0, target.getTime() - Date.now())), 1000);
    return () => clearInterval(id);
  }, [target]);
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms % 86_400_000) / 3_600_000),
    minutes: Math.floor((ms % 3_600_000) / 60_000),
    seconds: Math.floor((ms % 60_000) / 1000),
    expired: ms === 0,
  };
}

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const { days, hours, minutes, seconds, expired } = useCountdown(SALE_END);

  if (dismissed) return null;

  return (
    <div className="bg-accent text-accent-foreground">
      <div className="container-page flex items-center gap-3 py-2">
        {/* Pulsing live badge */}
        <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-accent-foreground/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] sm:flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-foreground opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-foreground" />
          </span>
          Opening Sale
        </span>

        {/* Offer copy */}
        <p className="flex-1 text-center text-sm font-medium">
          From{" "}
          <span className="font-bold">$189</span>
          <span className="hidden sm:inline">
            {" "}· Free delivery, assembly &amp; disposal.
          </span>{" "}
          <a
            href="#opening-sale"
            className="font-bold underline underline-offset-2 hover:no-underline"
          >
            Shop Now
          </a>
        </p>

        {/* Countdown */}
        {!expired && (
          <div className="hidden shrink-0 items-center gap-1 text-xs font-medium sm:flex">
            <span className="opacity-70">Ends in</span>
            {days > 0 && (
              <span className="font-bold tabular-nums">{days}d</span>
            )}
            <span className="font-bold tabular-nums">
              {String(hours).padStart(2, "0")}h
            </span>
            <span className="font-bold tabular-nums">
              {String(minutes).padStart(2, "0")}m
            </span>
            <span className="font-bold tabular-nums">
              {String(seconds).padStart(2, "0")}s
            </span>
          </div>
        )}

        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded p-1 opacity-60 transition hover:opacity-100"
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
