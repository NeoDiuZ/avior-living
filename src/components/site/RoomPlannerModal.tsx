"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, RotateCw, Minus, Plus, Trash2, ZoomIn, ZoomOut, Loader2 } from "lucide-react";

// ---------- types ----------

interface FootprintPiece {
  id: string;
  label: string;
  widthM: number;
  depthM: number;
  vertices: [number, number][];
  offsetXm: number;
  offsetYm: number;
}

interface PlacedItem {
  id: string;
  label: string;
  widthM: number;
  depthM: number;
  x: number;
  y: number;
  pieces: FootprintPiece[];
  footprintLoading: boolean;
}

interface DragState {
  id: string;
  ox: number;
  oy: number;
  ix: number;
  iy: number;
}

// "auto" = AI detected scale correctly; "fallback" = AI failed, using default 80 px/m
type CalibState =
  | { status: "idle" }
  | { status: "analyzing" }
  | { status: "done"; auto: boolean };

export interface RoomPlannerModalProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  widthM: number;
  depthM: number;
  productImageUrl?: string;
}

// ---------- constants ----------

const PX_DEFAULT = 80;
const PX_STEP = 10;
const PX_MIN = 20;
const PX_MAX = 400;
const ZOOM_MIN = 0.25;
const ZOOM_MAX = 4;
const ZOOM_STEP = 1.2;

let _id = 0;

// ---------- helpers ----------

const RECT_VERTICES: [number, number][] = [[0, 0], [1, 0], [1, 1], [0, 1]];

function makeDefaultPiece(label: string, widthM: number, depthM: number): FootprintPiece {
  return { id: "1", label, widthM, depthM, vertices: RECT_VERTICES, offsetXm: 0, offsetYm: 0 };
}

function toSvgPath(vertices: [number, number][]): string {
  return vertices.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ") + " Z";
}

async function resizeToBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1600;
      const r = Math.min(MAX / img.width, MAX / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * r);
      canvas.height = Math.round(img.height * r);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85).split(",")[1]);
    };
    img.src = url;
  });
}

// ---------- component ----------

export function RoomPlannerModal({
  open,
  onClose,
  productName,
  widthM,
  depthM,
  productImageUrl,
}: RoomPlannerModalProps) {
  const [floorPlan, setFloorPlan] = useState<string | null>(null);
  const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null);
  const [scale, setScale] = useState(PX_DEFAULT);
  const [zoom, setZoom] = useState(1);
  const [items, setItems] = useState<PlacedItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [calibState, setCalibState] = useState<CalibState>({ status: "idle" });

  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const planRef = useRef<HTMLDivElement>(null);
  const imgLoadedRef = useRef(false);
  const imgSizeRef = useRef<{ w: number; h: number } | null>(null);
  // undefined = not yet responded; null = AI failed; number = detected widthM
  const detectedWidthRef = useRef<number | null | undefined>(undefined);
  const footprintCache = useRef<Record<string, FootprintPiece[]>>({});

  // Non-passive wheel zoom
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (!imgLoadedRef.current) return;
      e.preventDefault();
      setZoom((z) => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z * (e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP))));
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  // Reset on modal close
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setFloorPlan((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
      setImgSize(null);
      setItems([]);
      setSelectedId(null);
      setCalibState({ status: "idle" });
      setScale(PX_DEFAULT);
      setZoom(1);
      imgLoadedRef.current = false;
      imgSizeRef.current = null;
      detectedWidthRef.current = undefined;
    }, 300);
    return () => clearTimeout(t);
  }, [open]);

  // Apply scale once BOTH image size and API result are available
  const tryApplyScale = () => {
    const size = imgSizeRef.current;
    const detected = detectedWidthRef.current;
    if (!size || detected === undefined) return; // one side not ready yet

    if (detected !== null && detected > 0) {
      setScale(size.w / detected);
      setCalibState({ status: "done", auto: true });
    } else {
      // AI failed — keep default 80 px/m, let user nudge with ± if needed
      setCalibState({ status: "done", auto: false });
    }
  };

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const container = canvasRef.current;
    if (!container) return;
    const pad = 48;
    const ratio = Math.min(
      (container.clientWidth - pad) / img.naturalWidth,
      (container.clientHeight - pad) / img.naturalHeight,
      1,
    );
    const size = { w: Math.round(img.naturalWidth * ratio), h: Math.round(img.naturalHeight * ratio) };
    setImgSize(size);
    imgSizeRef.current = size;
    imgLoadedRef.current = true;
    tryApplyScale();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    // Reset everything for the new plan
    setFloorPlan((prev) => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(file); });
    setImgSize(null);
    setItems([]);
    setSelectedId(null);
    setCalibState({ status: "analyzing" });
    setScale(PX_DEFAULT);
    setZoom(1);
    imgLoadedRef.current = false;
    imgSizeRef.current = null;
    detectedWidthRef.current = undefined; // mark both sides as pending

    // Fire both simultaneously: image load (handled by onLoad) + AI calibration
    try {
      const base64 = await resizeToBase64(file);
      const res = await fetch("/api/calibrate-floor-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType: "image/jpeg" }),
      });
      const data = await res.json();
      detectedWidthRef.current = data.detected && data.widthM > 0 ? data.widthM : null;
    } catch {
      detectedWidthRef.current = null;
    }

    // Try to apply now; if image hasn't loaded yet tryApplyScale will return early
    // and handleImgLoad will call it again once the image is ready
    tryApplyScale();
  };

  const addItem = async () => {
    const id = `fp-${++_id}`;
    const cacheKey = `${productName}|${widthM}|${depthM}`;
    const cached = footprintCache.current[cacheKey];

    const newItem: PlacedItem = {
      id,
      label: productName,
      widthM,
      depthM,
      x: 32,
      y: 32,
      pieces: cached ?? [makeDefaultPiece(productName, widthM, depthM)],
      footprintLoading: !cached && !!productImageUrl,
    };
    setItems((prev) => [...prev, newItem]);
    setSelectedId(id);

    if (!cached && productImageUrl) {
      try {
        const optimized = productImageUrl.includes("cdn.shopify.com")
          ? `${productImageUrl.split("?")[0]}?width=800`
          : productImageUrl;
        const res = await fetch("/api/generate-footprint", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: optimized, widthM, depthM, productName }),
        });
        const data = await res.json();
        if (Array.isArray(data.pieces) && data.pieces.length > 0) {
          footprintCache.current[cacheKey] = data.pieces;
          setItems((prev) =>
            prev.map((it) => (it.id === id ? { ...it, pieces: data.pieces, footprintLoading: false } : it)),
          );
        } else {
          setItems((prev) => prev.map((it) => (it.id === id ? { ...it, footprintLoading: false } : it)));
        }
      } catch {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, footprintLoading: false } : it)));
      }
    }
  };

  const startDrag = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(id);
    const item = items.find((i) => i.id === id)!;
    setDrag({ id, ox: e.clientX, oy: e.clientY, ix: item.x, iy: item.y });
  };

  const moveDrag = (e: React.MouseEvent) => {
    if (!drag) return;
    setItems((prev) =>
      prev.map((it) =>
        it.id === drag.id
          ? { ...it, x: drag.ix + (e.clientX - drag.ox) / zoom, y: drag.iy + (e.clientY - drag.oy) / zoom }
          : it,
      ),
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
    setItems((prev) =>
      prev.map((it) =>
        it.id === drag.id
          ? { ...it, x: drag.ix + (t.clientX - drag.ox) / zoom, y: drag.iy + (t.clientY - drag.oy) / zoom }
          : it,
      ),
    );
  };

  const stopDrag = () => setDrag(null);

  const rotateSelected = () => {
    if (!selectedId) return;
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== selectedId) return it;
        const oldH = it.depthM;
        return {
          ...it,
          widthM: it.depthM,
          depthM: it.widthM,
          pieces: it.pieces.map((p) => ({
            ...p,
            widthM: p.depthM,
            depthM: p.widthM,
            vertices: p.vertices.map(([x, y]) => [y, 1 - x] as [number, number]),
            offsetXm: oldH - p.offsetYm - p.depthM,
            offsetYm: p.offsetXm,
          })),
        };
      }),
    );
  };

  const removeSelected = () => {
    if (!selectedId) return;
    setItems((prev) => prev.filter((it) => it.id !== selectedId));
    setSelectedId(null);
  };

  const calibDone = calibState.status === "done";
  const selected = items.find((it) => it.id === selectedId);
  const zoomPct = Math.round(zoom * 100);
  const scaleDisplay = Number.isInteger(scale) ? `${scale}` : scale.toFixed(1);

  const footerHint = !floorPlan
    ? "Upload a floor plan image to begin."
    : calibState.status === "analyzing"
    ? "Detecting scale from floor plan…"
    : calibState.status === "done" && !calibState.auto
    ? `Couldn't read scale — scale is approximate. Use + / − to adjust, then click "+ Add to Plan".`
    : items.length === 0
    ? `Scale set automatically. Click "+ Add to Plan" to place the ${productName}.`
    : selected
    ? "Drag to reposition. Use the toolbar to rotate or remove. Scroll to zoom."
    : "Click a piece to select it. Drag to reposition. Scroll to zoom.";

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="flex h-[92vh] w-[min(1100px,95vw)] max-w-none flex-col gap-0 p-0">

        {/* Header */}
        <DialogHeader className="flex-shrink-0 border-b border-border px-6 py-4">
          <DialogTitle className="font-display text-xl">Room Planner</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Upload your floor plan — AI detects the scale and furniture shapes automatically.
          </p>
        </DialogHeader>

        {/* Analyzing banner — only while waiting, disappears automatically */}
        {calibState.status === "analyzing" && (
          <div className="flex flex-shrink-0 items-center gap-2.5 border-b border-border bg-blue-50/60 px-5 py-2 dark:bg-blue-950/30">
            <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0 text-blue-500" />
            <span className="text-xs text-foreground/60">Detecting floor plan scale…</span>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-border bg-secondary/40 px-5 py-3">
          <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload className="mr-1.5 h-3.5 w-3.5" />
            {floorPlan ? "Replace Floor Plan" : "Upload Floor Plan"}
          </Button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

          <div className="hidden h-5 w-px bg-border sm:block" />

          {/* Scale fine-tune — available after calibration for optional adjustment */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Scale:</span>
            <button
              onClick={() => setScale((s) => Math.max(PX_MIN, s - PX_STEP))}
              className="grid h-6 w-6 place-items-center rounded border border-border bg-background hover:bg-secondary"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-[5.5rem] text-center text-[11px] tabular-nums text-foreground/70">
              {scaleDisplay} px = 1 m
            </span>
            <button
              onClick={() => setScale((s) => Math.min(PX_MAX, s + PX_STEP))}
              className="grid h-6 w-6 place-items-center rounded border border-border bg-background hover:bg-secondary"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="hidden h-5 w-px bg-border sm:block" />

          <Button size="sm" onClick={addItem} disabled={!floorPlan || !calibDone}>
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
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="relative flex flex-1 items-center justify-center overflow-auto bg-[#ede9e3]"
          onMouseMove={moveDrag}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onTouchMove={moveTouchDrag}
          onTouchEnd={stopDrag}
          onClick={() => setSelectedId(null)}
        >
          {!floorPlan ? (
            <div
              className="cursor-pointer"
              onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
            >
              <div className="rounded-2xl border-2 border-dashed border-border bg-background px-14 py-12 text-center">
                <Upload className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                <p className="font-semibold text-foreground">Click to upload your floor plan</p>
                <p className="mt-1 text-sm text-muted-foreground">PNG or JPG</p>
              </div>
            </div>
          ) : (
            <div
              ref={planRef}
              className="relative select-none"
              style={{ cursor: drag ? "grabbing" : "default" }}
              onClick={(e) => e.stopPropagation()}
            >
              {!imgSize && (
                <img src={floorPlan} alt="" className="invisible absolute" draggable={false} onLoad={handleImgLoad} />
              )}

              {imgSize && (
                <>
                  <img
                    src={floorPlan}
                    alt="Floor plan"
                    draggable={false}
                    className="block"
                    style={{ width: imgSize.w * zoom, height: imgSize.h * zoom }}
                  />

                  {items.map((item) => {
                    const isSel = item.id === selectedId;
                    const bW = item.widthM * scale * zoom;
                    const bH = item.depthM * scale * zoom;

                    return (
                      <div
                        key={item.id}
                        style={{
                          position: "absolute",
                          left: item.x * zoom,
                          top: item.y * zoom,
                          width: bW,
                          height: bH,
                          cursor: drag?.id === item.id ? "grabbing" : "grab",
                          touchAction: "none",
                        }}
                        onMouseDown={(e) => { e.stopPropagation(); startDrag(e, item.id); }}
                        onTouchStart={(e) => { e.stopPropagation(); startTouchDrag(e, item.id); }}
                        onClick={(e) => { e.stopPropagation(); setSelectedId(item.id); }}
                      >
                        {item.footprintLoading ? (
                          <div className="flex h-full w-full flex-col items-center justify-center rounded border-2 border-dashed border-accent/60 bg-accent/10">
                            <Loader2 className="h-4 w-4 animate-spin text-accent" />
                            <span className="mt-1 text-accent/70" style={{ fontSize: 9 }}>
                              Analyzing shape…
                            </span>
                          </div>
                        ) : (
                          item.pieces.map((piece) => {
                            const pw = piece.widthM * scale * zoom;
                            const ph = piece.depthM * scale * zoom;
                            const px = piece.offsetXm * scale * zoom;
                            const py = piece.offsetYm * scale * zoom;

                            return (
                              <div
                                key={piece.id}
                                style={{ position: "absolute", left: px, top: py, width: pw, height: ph }}
                              >
                                <svg
                                  width={pw}
                                  height={ph}
                                  viewBox="0 0 1 1"
                                  preserveAspectRatio="none"
                                  className="absolute inset-0"
                                >
                                  <path
                                    d={toSvgPath(piece.vertices)}
                                    strokeWidth={2}
                                    vectorEffect="non-scaling-stroke"
                                    className={
                                      isSel
                                        ? "fill-accent/25 stroke-accent"
                                        : "fill-white/70 stroke-foreground/50"
                                    }
                                  />
                                </svg>
                                {pw > 30 && ph > 16 && (
                                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
                                    <span
                                      className="block w-full truncate px-1 text-center font-bold leading-tight"
                                      style={{ fontSize: Math.max(8, Math.min(12, pw / 8)) }}
                                    >
                                      {piece.label}
                                    </span>
                                    {pw > 50 && ph > 28 && (
                                      <span
                                        className="mt-0.5 text-foreground/55"
                                        style={{ fontSize: Math.max(7, Math.min(10, pw / 12)) }}
                                      >
                                        {piece.widthM}m × {piece.depthM}m
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}

          {/* Zoom controls */}
          {floorPlan && imgSize && (
            <div className="absolute bottom-4 right-4 z-10 flex flex-col items-center gap-1">
              <button
                onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z * ZOOM_STEP))}
                className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background shadow-sm hover:bg-secondary"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background text-[11px] tabular-nums shadow-sm hover:bg-secondary"
              >
                {zoomPct}%
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z / ZOOM_STEP))}
                className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background shadow-sm hover:bg-secondary"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 items-center justify-between gap-4 border-t border-border bg-cream px-6 py-4">
          <p className="text-xs text-muted-foreground">{footerHint}</p>
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
