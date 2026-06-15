import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI();

// ---------- polygon generators (mathematically precise) ----------

function circlePolygon(n = 16): [number, number][] {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * 2 * Math.PI;
    return [0.5 + 0.5 * Math.sin(a), 0.5 - 0.5 * Math.cos(a)];
  }) as [number, number][];
}

function rectPolygon(): [number, number][] {
  return [[0, 0], [1, 0], [1, 1], [0, 1]];
}

function roundedRectPolygon(r = 0.1): [number, number][] {
  return [
    [r, 0], [1 - r, 0], [1, r], [1, 1 - r],
    [1 - r, 1], [r, 1], [0, 1 - r], [0, r],
  ];
}

// lArmW: fraction of total width for the vertical arm (0–1)
// lArmH: fraction of total depth where the horizontal bar ends (0–1)
function lShapePolygon(lArmW = 0.45, lArmH = 0.5): [number, number][] {
  const w = Math.min(Math.max(lArmW, 0.1), 0.9);
  const h = Math.min(Math.max(lArmH, 0.1), 0.9);
  return [[0, 0], [1, 0], [1, h], [w, h], [w, 1], [0, 1]];
}

// armThickness: fraction of total width/depth for each arm (0–1)
function uShapePolygon(armThickness = 0.3): [number, number][] {
  const a = Math.min(Math.max(armThickness, 0.1), 0.45);
  return [
    [0, 0], [1, 0], [1, 1], [1 - a, 1],
    [1 - a, a], [a, a], [a, 1], [0, 1],
  ];
}

type ShapeType = "rectangle" | "rounded-rectangle" | "circle" | "oval" | "l-shape" | "u-shape";

interface AIPiece {
  id: string;
  label: string;
  widthM: number;
  depthM: number;
  shapeType: ShapeType;
  lArmWidthRatio?: number;
  lArmDepthRatio?: number;
  uArmThicknessRatio?: number;
  offsetXm: number;
  offsetYm: number;
}

function buildVertices(piece: AIPiece): [number, number][] {
  switch (piece.shapeType) {
    case "circle":
    case "oval":
      return circlePolygon(16);
    case "rounded-rectangle":
      return roundedRectPolygon(0.1);
    case "l-shape":
      return lShapePolygon(piece.lArmWidthRatio, piece.lArmDepthRatio);
    case "u-shape":
      return uShapePolygon(piece.uArmThicknessRatio);
    default:
      return rectPolygon();
  }
}

// ---------- helpers ----------

function extractJson(text: string): string {
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
  if (codeBlock) return codeBlock[1];
  const start = text.indexOf("{");
  return start === -1 ? text : text.slice(start);
}

function defaultResponse(productName: string, widthM: number, depthM: number) {
  return NextResponse.json({
    pieces: [
      {
        id: "1",
        label: productName,
        widthM,
        depthM,
        vertices: rectPolygon(),
        offsetXm: 0,
        offsetYm: 0,
      },
    ],
  });
}

// ---------- route ----------

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, widthM, depthM, productName } = await req.json();
    if (!imageUrl || !widthM || !depthM || !productName) {
      return defaultResponse(productName ?? "Item", widthM ?? 1, depthM ?? 1);
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1024,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageUrl, detail: "auto" },
            },
            {
              type: "text",
              text: `Classify the floor footprint of this furniture piece.

Product: "${productName}"
Total bounding box: ${widthM}m wide × ${depthM}m deep

For each physical piece, choose ONE shapeType:
- "rectangle"          → standard flat-edged footprint (sofa, bed, bookshelf, console, side table)
- "rounded-rectangle"  → mostly rectangular but with noticeably soft corners (armchair, ottoman, padded bench)
- "circle"             → fully round top (round dining table, round ottoman, barrel chair, round stool)
- "oval"               → elliptical top (oval dining table, oval coffee table)
- "l-shape"            → L-shaped or corner sectional sofa — provide lArmWidthRatio and lArmDepthRatio (where the inner corner is, as fractions 0–1 of the bounding box)
- "u-shape"            → U-shaped or horseshoe sofa — provide uArmThicknessRatio (arm width as fraction 0–1)

Multi-piece rules:
- Nesting tables (e.g. "nesting coffee table", "nest of 2") → 2 pieces; larger one at offset 0,0; smaller one beside it
- Dining set with chairs → 1 table piece + 4 chair pieces (~0.45m × 0.45m each) arranged around the table
- Sofa + ottoman set → 2 separate pieces
- Single furniture items → 1 piece

Return ONLY valid JSON:
{
  "pieces": [
    {
      "id": "1",
      "label": "name shown on floor plan",
      "widthM": number,
      "depthM": number,
      "shapeType": "rectangle" | "rounded-rectangle" | "circle" | "oval" | "l-shape" | "u-shape",
      "lArmWidthRatio": number,       // l-shape only (0.1–0.9)
      "lArmDepthRatio": number,       // l-shape only (0.1–0.9)
      "uArmThicknessRatio": number,   // u-shape only (0.1–0.45)
      "offsetXm": number,
      "offsetYm": number
    }
  ]
}

All pieces must fit within the ${widthM}m × ${depthM}m bounding box.`,
            },
          ],
        },
      ],
    });

    const raw = response.choices[0]?.message?.content ?? "";
    try {
      const result = JSON.parse(extractJson(raw.trim()));
      if (!Array.isArray(result.pieces) || result.pieces.length === 0) {
        return defaultResponse(productName, widthM, depthM);
      }

      const validShapes = new Set(["rectangle", "rounded-rectangle", "circle", "oval", "l-shape", "u-shape"]);
      const valid = result.pieces.every(
        (p: AIPiece) =>
          typeof p.widthM === "number" && p.widthM > 0 &&
          typeof p.depthM === "number" && p.depthM > 0 &&
          validShapes.has(p.shapeType),
      );
      if (!valid) return defaultResponse(productName, widthM, depthM);

      // Convert AI classification → mathematically precise polygon vertices
      const pieces = result.pieces.map((p: AIPiece) => ({
        id: p.id,
        label: p.label,
        widthM: p.widthM,
        depthM: p.depthM,
        vertices: buildVertices(p),
        offsetXm: p.offsetXm ?? 0,
        offsetYm: p.offsetYm ?? 0,
      }));

      return NextResponse.json({ pieces });
    } catch {
      return defaultResponse(productName, widthM, depthM);
    }
  } catch (err) {
    console.error("[generate-footprint]", err);
    return defaultResponse("Item", 1, 1);
  }
}
