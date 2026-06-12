"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, RotateCw, Minus, Plus, Trash2, Crosshair, ZoomIn, ZoomOut } from "lucide-react";

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

type CalibPhase =
  | { phase: "idle" }
  | { phase: "pick1" }
  | { phase: "pick2"; p1: { x: number; y: number } }
  | { phase: "input"; p1: { x: number; y: number }; p2: { x: number; y: number }; pxDist: number };

export interface RoomPlannerModalProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  widthM: number;
  depthM: number;
}

const PX_DEFAULT = 80;
const PX_STEP = 10;
const PX_MIN = 20;
const PX_MAX = 400;

const ZOOM_MIN = 0.25;
const ZOOM_MAX = 4;
const ZOOM_STEP = 1.2;

let _id = 0;

export function RoomPlannerModal({
  open,
  onClose,
  productName,
  widthM,
  depthM,
}: RoomPlannerModalProps) {
  const [floorPlan, setFloorPlan] = useState<string | null>(null);
  const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null);
  const [scale, setScale] = useState(PX_DEFAULT);
  const [zoom, setZoom] = useState(1);
  const [items, setItems] = useState<PlacedItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [calib, setCalib] = useState<CalibPhase>({ phase: "idle" });
  const [calibMm, setCalibMm] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const planRef = useRef<HTMLDivElement>(null);
  const imgLoadedRef = useRef(false);

  // Non-passive wheel listener for zoom (passive:false needed to preventDefault)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handler = (e: WheelEvent) => {
      if (!imgLoadedRef.current) return;
      e.preventDefault();
      const factor = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
      setZoom((z) => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z * factor)));
    };
    canvas.addEventListener("wheel", handler, { passive: false });
    return () => canvas.removeEventListener("wheel", handler);
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFloorPlan((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setImgSize(null);
    setItems([]);
    setSelectedId(null);
    setCalib({ phase: "idle" });
    setZoom(1);
    imgLoadedRef.current = false;
    e.target.value = "";
  };

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const container = canvasRef.current;
    if (!container) return;
    const pad = 48;
    const maxW = container.clientWidth - pad;
    const maxH = container.clientHeight - pad;
    const ratio = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
    setImgSize({
      w: Math.round(img.naturalWidth * ratio),
      h: Math.round(img.naturalHeight * ratio),
    });
    imgLoadedRef.current = true;
  };

  const addItem = () => {
    const id = `fp-${++_id}`;
    setItems((prev) => [
      ...prev,
      { id, label: productName, widthM, depthM, x: 32, y: 32, rotated: false },
    ]);
    setSelectedId(id);
  };

  // Base pixel size of a furniture item (zoom-independent; zoom applied at render)
  const pxSize = (item: PlacedItem) => ({
    w: (item.rotated ? item.depthM : item.widthM) * scale,
    h: (item.rotated ? item.widthM : item.depthM) * scale,
  });

  const startDrag = (e: React.MouseEvent, id: string) => {
    if (calib.phase !== "idle") return;
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(id);
    const item = items.find((i) => i.id === id)!;
    setDrag({ id, ox: e.clientX, oy: e.clientY, ix: item.x, iy: item.y });
  };

  // Drag deltas are divided by zoom so item positions stay in base (zoom=1) coordinates
  const moveDrag = (e: React.MouseEvent) => {
    if (!drag) return;
    setItems((prev) =>
      prev.map((it) =>
        it.id === drag.id
          ? {
              ...it,
              x: drag.ix + (e.clientX - drag.ox) / zoom,
              y: drag.iy + (e.clientY - drag.oy) / zoom,
            }
          : it
      )
    );
  };

  const startTouchDrag = (e: React.TouchEvent, id: string) => {
    if (calib.phase !== "idle") return;
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
          ? {
              ...it,
              x: drag.ix + (t.clientX - drag.ox) / zoom,
              y: drag.iy + (t.clientY - drag.oy) / zoom,
            }
          : it
      )
    );
  };

  const stopDrag = () => setDrag(null);

  const rotateSelected = () => {
    if (!selectedId) return;
    setItems((prev) =>
      prev.map((it) => (it.id === selectedId ? { ...it, rotated: !it.rotated } : it))
    );
  };

  const removeSelected = () => {
    if (!selectedId) return;
    setItems((prev) => prev.filter((it) => it.id !== selectedId));
    setSelectedId(null);
  };

  // Calibration clicks: convert screen coords to base (zoom=1) plan coordinates
  const handlePlanClick = (e: React.MouseEvent) => {
    if (calib.phase === "idle") {
      setSelectedId(null);
      return;
    }
    e.stopPropagation();
    const rect = planRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    if (calib.phase === "pick1") {
      setCalib({ phase: "pick2", p1: { x, y } });
    } else if (calib.phase === "pick2") {
      const dx = x - calib.p1.x;
      const dy = y - calib.p1.y;
      const pxDist = Math.sqrt(dx * dx + dy * dy);
      setCalib({ phase: "input", p1: calib.p1, p2: { x, y }, pxDist });
      setCalibMm("");
    }
  };

  const applyCalibration = () => {
    if (calib.phase !== "input") return;
    const mm = parseFloat(calibMm);
    if (!mm || mm <= 0) return;
    setScale(calib.pxDist / (mm / 1000));
    setCalib({ phase: "idle" });
    setCalibMm("");
  };

  const cancelCalib = () => {
    setCalib({ phase: "idle" });
    setCalibMm("");
  };

  const selected = items.find((it) => it.id === selectedId);
  const isCalibrating = calib.phase !== "idle";
  const zoomPct = Math.round(zoom * 100);

  const footerHint = !floorPlan
    ? "Upload a floor plan image to begin."
    : calib.phase === "pick1"
    ? "Click the first end of a known dimension on your floor plan."
    : calib.phase === "pick2"
    ? "Now click the other end of that same dimension."
    : calib.phase === "input"
    ? "Type the dimension label from the plan (mm). e.g. \"3600\" = 3.6 m."
    : items.length === 0
    ? `Calibrate the scale, then click "+ Add to Plan" to place the ${productName}.`
    : "Click a piece to select it. Drag to reposition. Scroll to zoom.";

  const scaleDisplay = Number.isInteger(scale) ? `${scale}` : scale.toFixed(1);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="flex h-[92vh] w-[min(1100px,95vw)] max-w-none flex-col gap-0 p-0">

        {/* Header */}
        <DialogHeader className="flex-shrink-0 border-b border-border px-6 py-4">
          <DialogTitle className="font-display text-xl">Room Planner</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Upload your floor plan, calibrate the scale, then drag furniture to preview.
          </p>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex flex-shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-border bg-secondary/40 px-5 py-3">
          <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload className="mr-1.5 h-3.5 w-3.5" />
            {floorPlan ? "Replace Floor Plan" : "Upload Floor Plan"}
          </Button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

          {floorPlan && (
            <>
              <div className="hidden h-5 w-px bg-border sm:block" />
              {isCalibrating ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={cancelCalib}
                  className="border-destructive/40 text-destructive hover:text-destructive"
                >
                  Cancel Calibration
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setCalib({ phase: "pick1" })}>
                  <Crosshair className="mr-1.5 h-3.5 w-3.5" />
                  Calibrate Scale
                </Button>
              )}
            </>
          )}

          <div className="hidden h-5 w-px bg-border sm:block" />

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Scale:</span>
            <button
              onClick={() => setScale((s) => Math.max(PX_MIN, s - PX_STEP))}
              disabled={isCalibrating}
              className="grid h-6 w-6 place-items-center rounded border border-border bg-background hover:bg-secondary disabled:opacity-40"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-[5.5rem] text-center text-[11px] tabular-nums text-foreground/70">
              {scaleDisplay} px = 1 m
            </span>
            <button
              onClick={() => setScale((s) => Math.min(PX_MAX, s + PX_STEP))}
              disabled={isCalibrating}
              className="grid h-6 w-6 place-items-center rounded border border-border bg-background hover:bg-secondary disabled:opacity-40"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="hidden h-5 w-px bg-border sm:block" />

          <Button size="sm" onClick={addItem} disabled={!floorPlan || isCalibrating}>
            + Add to Plan
          </Button>

          {selected && !isCalibrating && (
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
              style={{
                cursor:
                  isCalibrating && calib.phase !== "input"
                    ? "crosshair"
                    : drag
                    ? "grabbing"
                    : "default",
              }}
              onClick={handlePlanClick}
            >
              {/* Hidden img to trigger onLoad and compute base fit dimensions */}
              {!imgSize && (
                <img
                  src={floorPlan}
                  alt=""
                  className="invisible absolute"
                  draggable={false}
                  onLoad={handleImgLoad}
                />
              )}

              {imgSize && (
                <>
                  {/* Floor plan image: rendered at base size × zoom */}
                  <img
                    src={floorPlan}
                    alt="Floor plan"
                    draggable={false}
                    className="block"
                    style={{ width: imgSize.w * zoom, height: imgSize.h * zoom }}
                  />

                  {/* Calibration overlay: SVG viewBox in base coords, rendered at zoomed size */}
                  {calib.phase !== "idle" && (
                    <svg
                      className="pointer-events-none absolute inset-0"
                      viewBox={`0 0 ${imgSize.w} ${imgSize.h}`}
                      style={{ width: imgSize.w * zoom, height: imgSize.h * zoom }}
                    >
                      {calib.phase === "input" && (
                        <line
                          x1={calib.p1.x}
                          y1={calib.p1.y}
                          x2={calib.p2.x}
                          y2={calib.p2.y}
                          stroke="#ef4444"
                          strokeWidth={2 / zoom}
                          strokeDasharray={`${6 / zoom} ${3 / zoom}`}
                        />
                      )}
                      {(calib.phase === "pick2" || calib.phase === "input") && (
                        <>
                          <circle cx={calib.p1.x} cy={calib.p1.y} r={6 / zoom} fill="#ef4444" fillOpacity={0.9} />
                          <text x={calib.p1.x + 9 / zoom} y={calib.p1.y + 4 / zoom} fontSize={11 / zoom} fill="#ef4444" fontWeight="bold">1</text>
                        </>
                      )}
                      {calib.phase === "input" && (
                        <>
                          <circle cx={calib.p2.x} cy={calib.p2.y} r={6 / zoom} fill="#ef4444" fillOpacity={0.9} />
                          <text x={calib.p2.x + 9 / zoom} y={calib.p2.y + 4 / zoom} fontSize={11 / zoom} fill="#ef4444" fontWeight="bold">2</text>
                        </>
                      )}
                    </svg>
                  )}

                  {/* Calibration input card: positioned in zoomed pixel space */}
                  {calib.phase === "input" && (() => {
                    const midX = (calib.p1.x + calib.p2.x) / 2 * zoom;
                    const midY = (calib.p1.y + calib.p2.y) / 2 * zoom;
                    const cardW = 268;
                    const left = Math.max(4, Math.min(imgSize.w * zoom - cardW - 4, midX - cardW / 2));
                    const top = Math.min(imgSize.h * zoom - 170, midY + 16);
                    return (
                      <div
                        className="pointer-events-auto absolute z-10 rounded-xl border border-border bg-background p-4 shadow-xl"
                        style={{ left, top, width: cardW }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className="mb-1 text-xs font-semibold text-foreground">
                          What is this distance?
                        </p>
                        <p className="mb-3 text-[11px] leading-relaxed text-muted-foreground">
                          Find the dimension label on your floor plan between those two points. Singapore plans use mm — e.g. "3600" = 3.6 m.
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={calibMm}
                            onChange={(e) => setCalibMm(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") applyCalibration();
                              if (e.key === "Escape") cancelCalib();
                            }}
                            placeholder="e.g. 3600"
                            autoFocus
                            className="h-8 flex-1 rounded-md border border-border bg-background px-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                          <span className="shrink-0 text-xs text-muted-foreground">mm</span>
                        </div>
                        <div className="mt-3 flex justify-end gap-2">
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={cancelCalib}>
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="h-7 px-3 text-xs"
                            onClick={applyCalibration}
                            disabled={!calibMm || parseFloat(calibMm) <= 0}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Furniture items: position and size in zoomed pixel space */}
                  {items.map((item) => {
                    const { w, h } = pxSize(item);
                    const isSel = item.id === selectedId;
                    return (
                      <div
                        key={item.id}
                        style={{
                          position: "absolute",
                          left: item.x * zoom,
                          top: item.y * zoom,
                          width: w * zoom,
                          height: h * zoom,
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
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isCalibrating) setSelectedId(item.id);
                        }}
                      >
                        <span
                          className="block w-full truncate px-1 text-center font-bold leading-tight"
                          style={{ fontSize: Math.max(8, Math.min(12, (w * zoom) / 10)) }}
                        >
                          {item.label}
                        </span>
                        <span
                          className="mt-0.5 text-foreground/55"
                          style={{ fontSize: Math.max(7, Math.min(10, (w * zoom) / 13)) }}
                        >
                          {item.rotated
                            ? `${item.depthM}m × ${item.widthM}m`
                            : `${item.widthM}m × ${item.depthM}m`}
                        </span>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}

          {/* Floating zoom controls */}
          {floorPlan && imgSize && (
            <div className="absolute bottom-4 right-4 z-10 flex flex-col items-center gap-1">
              <button
                onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z * ZOOM_STEP))}
                className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background shadow-sm hover:bg-secondary"
                title="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background text-[11px] tabular-nums shadow-sm hover:bg-secondary"
                title="Reset zoom"
              >
                {zoomPct}%
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z / ZOOM_STEP))}
                className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background shadow-sm hover:bg-secondary"
                title="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
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
