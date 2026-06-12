"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, RotateCw, Minus, Plus, Trash2, Info } from "lucide-react";

interface PlacedItem {
  id: string;
  label: string;
  widthM: number;
  depthM: number;
  x: number;
  y: number;
  rotated: boolean;
}

interface DragState {
  id: string;
  ox: number;
  oy: number;
  ix: number;
  iy: number;
}

export interface RoomPlannerModalProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  widthM: number;
  depthM: number;
}

const PX_DEFAULT = 80;
const PX_STEP = 10;
const PX_MIN = 30;
const PX_MAX = 220;

let _id = 0;

export function RoomPlannerModal({
  open,
  onClose,
  productName,
  widthM,
  depthM,
}: RoomPlannerModalProps) {
  const [floorPlan, setFloorPlan] = useState<string | null>(null);
  const [scale, setScale] = useState(PX_DEFAULT);
  const [items, setItems] = useState<PlacedItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFloorPlan((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setItems([]);
    setSelectedId(null);
    e.target.value = "";
  };

  const addItem = () => {
    const id = `fp-${++_id}`;
    setItems((prev) => [
      ...prev,
      { id, label: productName, widthM, depthM, x: 32, y: 32, rotated: false },
    ]);
    setSelectedId(id);
  };

  const pxSize = (item: PlacedItem) => ({
    w: (item.rotated ? item.depthM : item.widthM) * scale,
    h: (item.rotated ? item.widthM : item.depthM) * scale,
  });

  const startDrag = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(id);
    const item = items.find((i) => i.id === id)!;
    setDrag({ id, ox: e.clientX, oy: e.clientY, ix: item.x, iy: item.y });
  };

  const moveDrag = (e: React.MouseEvent) => {
    if (!drag) return;
    const dx = e.clientX - drag.ox;
    const dy = e.clientY - drag.oy;
    setItems((prev) =>
      prev.map((it) =>
        it.id === drag.id ? { ...it, x: drag.ix + dx, y: drag.iy + dy } : it
      )
    );
  };

  const startTouchDrag = (e: React.TouchEvent, id: string) => {
    e.stopPropagation();
    setSelectedId(id);
    const t = e.touches[0];
    const item = items.find((i) => i.id === id)!;
    setDrag({ id, ox: t.clientX, oy: t.clientY, ix: item.x, iy: item.y });
  };

  const moveTouchDrag = (e: React.TouchEvent) => {
    if (!drag) return;
    const t = e.touches[0];
    const dx = t.clientX - drag.ox;
    const dy = t.clientY - drag.oy;
    setItems((prev) =>
      prev.map((it) =>
        it.id === drag.id ? { ...it, x: drag.ix + dx, y: drag.iy + dy } : it
      )
    );
  };

  const stopDrag = () => setDrag(null);

  const rotateSelected = () => {
    if (!selectedId) return;
    setItems((prev) =>
      prev.map((it) =>
        it.id === selectedId ? { ...it, rotated: !it.rotated } : it
      )
    );
  };

  const removeSelected = () => {
    if (!selectedId) return;
    setItems((prev) => prev.filter((it) => it.id !== selectedId));
    setSelectedId(null);
  };

  const selected = items.find((it) => it.id === selectedId);

  const footerHint = !floorPlan
    ? "Upload a floor plan image to begin."
    : items.length === 0
    ? `Click "+ Add to Plan" in the toolbar to place the ${productName}.`
    : "Click a piece to select it. Drag to reposition, rotate to change orientation.";

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="flex h-[92vh] w-[min(1100px,95vw)] max-w-none flex-col gap-0 p-0">

        {/* Header */}
        <DialogHeader className="flex-shrink-0 border-b border-border px-6 py-4">
          <DialogTitle className="font-display text-xl">Room Planner</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Upload your floor plan and drag furniture to preview placement.
          </p>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex flex-shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-border bg-secondary/40 px-5 py-3">
          <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload className="mr-1.5 h-3.5 w-3.5" />
            {floorPlan ? "Replace Floor Plan" : "Upload Floor Plan"}
          </Button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

          <div className="hidden h-5 w-px bg-border sm:block" />

          {/* Scale control */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Scale:</span>
            <button
              onClick={() => setScale((s) => Math.max(PX_MIN, s - PX_STEP))}
              className="grid h-6 w-6 place-items-center rounded border border-border bg-background hover:bg-secondary"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-[5.5rem] text-center text-[11px] tabular-nums text-foreground/70">
              {scale} px = 1 m
            </span>
            <button
              onClick={() => setScale((s) => Math.min(PX_MAX, s + PX_STEP))}
              className="grid h-6 w-6 place-items-center rounded border border-border bg-background hover:bg-secondary"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="hidden h-5 w-px bg-border sm:block" />

          <Button size="sm" onClick={addItem} disabled={!floorPlan}>
            + Add to Plan
          </Button>

          {selected && (
            <>
              <div className="hidden h-5 w-px bg-border sm:block" />
              <Button size="sm" variant="outline" onClick={rotateSelected}>
                <RotateCw className="mr-1.5 h-3.5 w-3.5" />
                Rotate 90°
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={removeSelected}
                className="border-destructive/30 text-destructive hover:border-destructive/60 hover:text-destructive"
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Remove
              </Button>
            </>
          )}

          {/* Demo notice */}
          <div className="ml-auto flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Info className="h-3 w-3 shrink-0" />
            Using demo dimensions — real sizes from Shopify soon
          </div>
        </div>

        {/* Canvas */}
        <div
          className="relative flex-1 overflow-auto bg-[#ede9e3]"
          onMouseMove={moveDrag}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onTouchMove={moveTouchDrag}
          onTouchEnd={stopDrag}
          onClick={() => setSelectedId(null)}
        >
          {!floorPlan ? (
            /* Upload prompt */
            <div
              className="flex h-full min-h-[280px] cursor-pointer items-center justify-center p-8"
              onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
            >
              <div className="rounded-2xl border-2 border-dashed border-border bg-background px-14 py-12 text-center">
                <Upload className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                <p className="font-semibold text-foreground">Click to upload your floor plan</p>
                <p className="mt-1 text-sm text-muted-foreground">PNG or JPG</p>
              </div>
            </div>
          ) : (
            /* Floor plan + draggable items */
            <div
              className="relative inline-block select-none"
              style={{ cursor: drag ? "grabbing" : "default" }}
            >
              <img
                src={floorPlan}
                alt="Floor plan"
                draggable={false}
                className="block max-w-none"
              />

              {items.map((item) => {
                const { w, h } = pxSize(item);
                const isSel = item.id === selectedId;
                return (
                  <div
                    key={item.id}
                    style={{
                      position: "absolute",
                      left: item.x,
                      top: item.y,
                      width: w,
                      height: h,
                      cursor: drag?.id === item.id ? "grabbing" : "grab",
                      touchAction: "none",
                    }}
                    className={`flex flex-col items-center justify-center overflow-hidden border-2 transition-shadow ${
                      isSel
                        ? "border-accent bg-accent/25 shadow-[0_0_0_3px_oklch(var(--accent)/0.25)]"
                        : "border-foreground/50 bg-white/70 hover:border-accent hover:bg-accent/10"
                    }`}
                    onMouseDown={(e) => { e.stopPropagation(); startDrag(e, item.id); }}
                    onTouchStart={(e) => { e.stopPropagation(); startTouchDrag(e, item.id); }}
                    onClick={(e) => { e.stopPropagation(); setSelectedId(item.id); }}
                  >
                    <span
                      className="block w-full truncate px-1 text-center font-bold leading-tight"
                      style={{ fontSize: Math.max(8, Math.min(12, w / 10)) }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="mt-0.5 text-foreground/55"
                      style={{ fontSize: Math.max(7, Math.min(10, w / 13)) }}
                    >
                      {item.rotated
                        ? `${item.depthM}m × ${item.widthM}m`
                        : `${item.widthM}m × ${item.depthM}m`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 items-center justify-between gap-4 border-t border-border bg-cream px-6 py-4">
          <p className="text-xs text-muted-foreground">{footerHint}</p>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
