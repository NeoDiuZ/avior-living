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
    default:   return value; // already meters
  }
}

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType } = await req.json();
    if (!imageBase64) return NextResponse.json({ detected: false });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 512,
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
              text: `This is an architectural floor plan. Find the overall room dimensions.

STEP 1 — HORIZONTAL WIDTH:
Look at the TOP and BOTTOM outer edges. There may be TWO levels of numbers:
- An OUTER total (one large number spanning the full width, e.g. 12350)
- INNER segments below/above it (multiple smaller numbers e.g. 3300, 2800, 2825, 3425)

If you see a single outermost total number spanning the full width → use it as "horizontalTotal".
Also list any inner segment numbers as "horizontalSegments".

STEP 2 — VERTICAL DEPTH:
Same logic for LEFT and RIGHT outer edges.
If you see a single outermost total → use "verticalTotal".
Also list inner segments as "verticalSegments".

STEP 3 — UNIT: identify "mm", "cm", "m", or "ft".

Return ONLY valid JSON (include all fields you found, omit ones not present):
{
  "detected": true,
  "unit": "mm",
  "horizontalTotal": 12350,
  "horizontalSegments": [3300, 2800, 2825, 3425],
  "verticalTotal": 9450,
  "verticalSegments": [4800, 3200, 1450]
}

If you cannot read any dimension numbers clearly:
{"detected": false}`,
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

      // Prefer the outermost total annotation; fall back to summing segments
      let widthM = 0;
      if (typeof result.horizontalTotal === "number" && result.horizontalTotal > 0) {
        widthM = toMeters(result.horizontalTotal, unit);
      } else if (Array.isArray(result.horizontalSegments) && result.horizontalSegments.length > 0) {
        widthM = (result.horizontalSegments as number[]).reduce((s, n) => s + toMeters(Number(n), unit), 0);
      }

      let depthM = 0;
      if (typeof result.verticalTotal === "number" && result.verticalTotal > 0) {
        depthM = toMeters(result.verticalTotal, unit);
      } else if (Array.isArray(result.verticalSegments) && result.verticalSegments.length > 0) {
        depthM = (result.verticalSegments as number[]).reduce((s, n) => s + toMeters(Number(n), unit), 0);
      }

      if (!(widthM > 0)) return NextResponse.json({ detected: false });

      return NextResponse.json({
        detected: true,
        widthM: Math.round(widthM * 10) / 10,
        depthM: depthM > 0 ? Math.round(depthM * 10) / 10 : null,
      });
    } catch {
      return NextResponse.json({ detected: false });
    }
  } catch (err) {
    console.error("[calibrate-floor-plan]", err);
    return NextResponse.json({ detected: false });
  }
}
