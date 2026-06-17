"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";

const SESSION_KEY = "avior_coupon_done";

export function CouponModal() {
  const couponModalOpen = useCartStore((s) => s.couponModalOpen);
  const setCouponModalOpen = useCartStore((s) => s.setCouponModalOpen);
  const pendingAddItem = useCartStore((s) => s.pendingAddItem);
  const setPendingAddItem = useCartStore((s) => s.setPendingAddItem);
  const addItem = useCartStore((s) => s.addItem);

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const dismiss = () => {
    setCouponModalOpen(false);
    setPendingAddItem(null);
  };

  const skip = async () => {
    if (!pendingAddItem) { dismiss(); return; }
    sessionStorage.setItem(SESSION_KEY, "1");
    dismiss();
    await addItem(pendingAddItem);
    setName("");
    setWhatsapp("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingAddItem) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/coupon-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), whatsapp: whatsapp.trim() }),
      });
      if (!res.ok) throw new Error("failed");
      sessionStorage.setItem(SESSION_KEY, "1");
      toast.success("Code sent! Check your WhatsApp.", { duration: 6000 });
      dismiss();
      await addItem(pendingAddItem);
      setName("");
      setWhatsapp("");
    } catch {
      toast.error("Couldn't send the code — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={couponModalOpen} onOpenChange={(open) => { if (!open && !submitting) dismiss(); }}>
      <DialogContent className="max-w-md overflow-hidden border-0 p-0 [&>button]:hidden">
        <div className="bg-primary px-8 py-9 text-primary-foreground">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
            Opening Sale
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">
            Get Free Express Delivery
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-primary-foreground/65">
            Enter your details and we'll send a free express delivery code (worth $20) straight to your WhatsApp.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-8 py-7">
          <div className="space-y-1.5">
            <Label htmlFor="coupon-name" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Your Name
            </Label>
            <Input
              id="coupon-name"
              type="text"
              placeholder="e.g. Sarah Tan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={submitting}
              className="h-11"
              autoComplete="given-name"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="coupon-wa" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              WhatsApp Number
            </Label>
            <div className="flex h-11 overflow-hidden rounded-md border border-input focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <span className="flex items-center border-r border-input bg-muted px-3 text-sm text-muted-foreground select-none">
                +65
              </span>
              <input
                id="coupon-wa"
                type="tel"
                inputMode="numeric"
                placeholder="9123 4567"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 8))}
                required
                disabled={submitting}
                pattern="[89]\d{7}"
                title="Enter a valid Singapore mobile number starting with 8 or 9"
                className="flex-1 bg-background px-3 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
                autoComplete="tel-national"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting || !name.trim() || whatsapp.length < 8}
            className="h-11 w-full bg-accent font-semibold text-accent-foreground hover:bg-accent/90"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send My Code →"}
          </Button>

          <button
            type="button"
            onClick={skip}
            disabled={submitting}
            className="w-full text-center text-xs text-muted-foreground transition hover:text-foreground disabled:pointer-events-none"
          >
            Skip, I'll pay for express delivery
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
