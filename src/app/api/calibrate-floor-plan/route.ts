import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI();

function extractJson(text: string): string {
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
  if (codeBlock) return codeBlock[1];
  const start = text.indexOf("{");
  return start === -1 ? text : text.slice(start);
}

function toMeters(value: number, unit: string): number {
  switch (unit) {
    case "mm": return value / 1000;
    case "cm": return value / 100;
    case "ft": return value * 0.3048;
    case "in": return value * 0.0254;
    default:   return value;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType } = await req.json();
    if (!imageBase64) return NextResponse.json({ detected: false });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 600,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType ?? "image/jpeg"};base64,${imageBase64}`,
                detail: "high",
              },
            },
            {
              type: "text",
              text: `This is an architectural floor plan image. Complete four tasks:

TASK A — HORIZONTAL WIDTH:
Look at the top and bottom outer edges for dimension numbers.
Floor plans often have TWO levels: one large TOTAL spanning the full width (e.g. 12350) and smaller segments below it (e.g. 3300, 2800, 2825, 3425).
→ If you see a single outermost total, set "widthTotal".
→ Also list any inner segment numbers in "widthSegments".

TASK B — VERTICAL DEPTH:
Same for left and right outer edges → "depthTotal" and/or "depthSegments".

TASK C — UNIT:
Identify the unit used for all numbers: "mm", "cm", "m", "ft", or "in".

TASK D — DRAWING BOUNDS:
The image may have white margins around the actual floor plan drawing.
Estimate what fraction of the total image the drawing itself occupies:
→ "drawingWidthFraction": 0.0–1.0 (drawing width ÷ image width)
→ "drawingHeightFraction": 0.0–1.0 (drawing height ÷ image height)

Return ONLY valid JSON:
{
  "detected": true,
  "unit": "mm",
  "widthTotal": 12350,
  "widthSegments": [3300, 2800, 2825, 3425],
  "depthTotal": 9500,
  "depthSegments": [4800, 3200, 1500],
  "drawingWidthFraction": 0.75,
  "drawingHeightFraction": 0.82
}

If you cannot read any dimension numbers at all: {"detected": false}`,
            },
          ],
        },
      ],
    });

    const raw = response.choices[0]?.message?.content ?? "";
    try {
      const result = JSON.parse(extractJson(raw.trim()));
      if (!result.detected) return NextResponse.json({ detected: false });

      const unit = typeof result.unit === "string" ? result.unit : "mm";

      // Prefer outermost total annotation; fall back to summing segments
      let widthM = 0;
      if (typeof result.widthTotal === "number" && result.widthTotal > 0) {
        widthM = toMeters(result.widthTotal, unit);
      } else if (Array.isArray(result.widthSegments) && result.widthSegments.length > 0) {
        widthM = (result.widthSegments as number[]).reduce((s, n) => s + toMeters(Number(n), unit), 0);
      }

      let depthM = 0;
      if (typeof result.depthTotal === "number" && result.depthTotal > 0) {
        depthM = toMeters(result.depthTotal, unit);
      } else if (Array.isArray(result.depthSegments) && result.depthSegments.length > 0) {
        depthM = (result.depthSegments as number[]).reduce((s, n) => s + toMeters(Number(n), unit), 0);
      }

      if (!(widthM > 0)) return NextResponse.json({ detected: false });

      const drawingWidthFraction =
        typeof result.drawingWidthFraction === "number"
          ? Math.max(0.1, Math.min(1, result.drawingWidthFraction))
          : 1;

      const drawingHeightFraction =
        typeof result.drawingHeightFraction === "number"
          ? Math.max(0.1, Math.min(1, result.drawingHeightFraction))
          : 1;

      return NextResponse.json({
        detected: true,
        widthM: Math.round(widthM * 100) / 100,
        depthM: depthM > 0 ? Math.round(depthM * 100) / 100 : null,
        drawingWidthFraction,
        drawingHeightFraction,
      });
    } catch {
      return NextResponse.json({ detected: false });
    }
  } catch (err) {
    console.error("[calibrate-floor-plan]", err);
    return NextResponse.json({ detected: false });
  }
}
