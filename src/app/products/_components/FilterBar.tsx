"use client";

import { SlidersHorizontal } from "lucide-react";
import { ROOM_FILTERS } from "./filters";

export function RoomFilterPills({
  active,
  onChange,
}: {
  active: string | null;
  onChange: (key: string | null) => void;
}) {
  return (
    <>
      {ROOM_FILTERS.map((f) => (
        <button
          key={f.label}
          onClick={() => onChange(f.key)}
          className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            active === f.key
              ? "border-accent bg-accent text-accent-foreground"
              : "border-border bg-background text-foreground/70 hover:border-foreground/30 hover:text-foreground"
          }`}
        >
          {f.label}
        </button>
      ))}
    </>
  );
}

export function FilterSortButton({
  activeCount,
  onClick,
}: {
  activeCount: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative shrink-0 inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors ${
        activeCount > 0
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-background text-foreground/70 hover:border-foreground/30 hover:text-foreground"
      }`}
    >
      <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={2} />
      Filter & Sort
      {activeCount > 0 && (
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent-foreground text-[10px] font-bold text-accent">
          {activeCount}
        </span>
      )}
    </button>
  );
}
