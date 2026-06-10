"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container-page flex items-center justify-between gap-4 py-2.5">
        <div className="w-6 shrink-0" />
        <p className="flex-1 text-center text-sm font-medium">
          <span className="font-semibold">Opening Sale Live</span>
          {" — "}
          Furniture from{" "}
          <span className="font-semibold">$189</span>
          {" · "}
          <span className="hidden sm:inline">
            Free delivery, assembly and disposal included.{" "}
          </span>
          <a
            href="#opening-sale"
            className="font-semibold underline underline-offset-2 hover:no-underline"
          >
            Shop Now
          </a>
        </p>
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
