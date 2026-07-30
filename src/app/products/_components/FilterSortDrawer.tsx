"use client";

import { Check } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SORT_OPTIONS, PRICE_RANGES } from "./filters";

export function FilterSortDrawer({
  open,
  onOpenChange,
  pendingSort,
  setPendingSort,
  pendingPrice,
  setPendingPrice,
  onClear,
  onApply,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingSort: number;
  setPendingSort: (i: number) => void;
  pendingPrice: number;
  setPendingPrice: (i: number) => void;
  onClear: () => void;
  onApply: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-sm">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="text-left font-display text-lg">Filter & Sort</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-8">
          {/* Sort */}
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Sort by
            </p>
            <div className="space-y-1">
              {SORT_OPTIONS.map((opt, i) => (
                <button
                  key={opt.label}
                  onClick={() => setPendingSort(i)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    pendingSort === i
                      ? "bg-accent/10 text-accent"
                      : "hover:bg-secondary text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {opt.label}
                  {pendingSort === i && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Price
            </p>
            <div className="space-y-1">
              {PRICE_RANGES.map((range, i) => (
                <button
                  key={range.label}
                  onClick={() => setPendingPrice(i)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    pendingPrice === i
                      ? "bg-accent/10 text-accent"
                      : "hover:bg-secondary text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {range.label}
                  {pendingPrice === i && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer footer */}
        <div className="border-t border-border pt-4 flex gap-3">
          <button
            onClick={onClear}
            className="flex-1 h-11 rounded-xl border border-border text-sm font-semibold text-foreground/70 transition hover:bg-secondary"
          >
            Clear all
          </button>
          <button
            onClick={onApply}
            className="flex-1 h-11 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Show results
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
