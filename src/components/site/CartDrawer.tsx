import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus, Trash2, Loader2, ExternalLink } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/shopify/client";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const setOpen = useCartStore((s) => s.setOpen);
  const items = useCartStore((s) => s.items);
  const isLoading = useCartStore((s) => s.isLoading);
  const isSyncing = useCartStore((s) => s.isSyncing);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getCheckoutUrl = useCartStore((s) => s.getCheckoutUrl);
  const syncCart = useCartStore((s) => s.syncCart);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode ?? "SGD";

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) {
      window.open(url, "_blank");
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="relative h-9 w-9"
        onClick={() => setOpen(true)}
        aria-label="Open cart"
      >
        <ShoppingBag className="h-4 w-4" />
        {totalItems > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
            {totalItems}
          </span>
        )}
      </Button>

      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetContent className="flex h-full w-full flex-col p-0 sm:max-w-lg">
          <SheetHeader className="border-b border-border px-6 py-5">
            <SheetTitle className="font-display text-2xl">Your Cart</SheetTitle>
            <p className="text-sm text-muted-foreground">
              {totalItems === 0
                ? "Your cart is empty"
                : `${totalItems} item${totalItems !== 1 ? "s" : ""} — delivery, assembly & disposal included`}
            </p>
          </SheetHeader>

          <div className="flex min-h-0 flex-1 flex-col">
            {items.length === 0 ? (
              <div className="flex flex-1 items-center justify-center px-6">
                <div className="text-center">
                  <ShoppingBag className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Your cart is empty.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="space-y-5">
                    {items.map((item) => (
                      <div key={item.variantId} className="flex gap-4 border-b border-border pb-5 last:border-0">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-secondary">
                          {item.product.node.images?.edges?.[0]?.node && (
                            <img
                              src={item.product.node.images.edges[0].node.url}
                              alt={item.product.node.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-medium">{item.product.node.title}</h4>
                          {item.selectedOptions.length > 0 && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {item.selectedOptions.map((o) => o.value).join(" · ")}
                            </p>
                          )}
                          <p className="mt-1 font-display text-base">
                            {formatPrice(item.price.amount, item.price.currencyCode)}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex items-center rounded-md border border-border">
                              <button
                                className="grid h-7 w-7 place-items-center text-foreground/70 hover:text-foreground"
                                onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-7 text-center text-xs">{item.quantity}</span>
                              <button
                                className="grid h-7 w-7 place-items-center text-foreground/70 hover:text-foreground"
                                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              className="ml-auto text-muted-foreground hover:text-destructive"
                              onClick={() => removeItem(item.variantId)}
                              aria-label="Remove"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4 border-t border-border bg-cream px-6 py-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="font-display text-2xl">{formatPrice(totalPrice, currency)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Delivery, assembly and packaging disposal included islandwide.
                  </p>
                  <Button
                    onClick={handleCheckout}
                    className="h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={items.length === 0 || isLoading || isSyncing}
                  >
                    {isLoading || isSyncing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Secure Checkout
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
