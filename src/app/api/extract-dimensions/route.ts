import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI();

export async function POST(req: NextRequest) {
  try {
    const { title, productType, description, metafieldText } = await req.json();

    const sections: string[] = [];
    if (productType) sections.push(`Product type: ${productType}`);
    if (title)       sections.push(`Title: ${title}`);
    if (metafieldText?.trim()) sections.push(`Specifications:\n${metafieldText.trim()}`);
    if (description?.trim())   sections.push(`Description:\n${description.trim().slice(0, 3000)}`);

    const productInfo = sections.join("\n\n");

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      max_tokens: 60,
      messages: [
        {
          role: "system",
          content:
            "You extract furniture floor-plan footprint dimensions for a room planning tool. " +
            "Return only a JSON object with widthM and depthM in metres. No explanation.",
        },
        {
          role: "user",
          content: `Extract the floor footprint (width × depth, NOT height) from this product information.

${productInfo}

Rules:
- Width = left-to-right measurement. Depth = front-to-back measurement.
- Convert cm → metres (÷100). Convert mm → metres (÷1000).
- If a value exceeds 5 m it is almost certainly in mm mislabelled as cm — divide by 10 again.
- For ranges like "120–180 cm" use the larger value (extended size).
- For multi-size listings (Single / Queen / King) use the largest size.
- For round or circular items, width and depth are both equal to the diameter.
- Use your knowledge of typical furniture proportions as a sanity check.

Return ONLY valid JSON: {"widthM": number, "depthM": number}
If you genuinely cannot determine dimensions from the available text, return: {"widthM": null, "depthM": null}`,
        },
      ],
    });

    const raw = (response.choices[0]?.message?.content ?? "").trim();
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start === -1 || end === -1) return NextResponse.json({ widthM: null, depthM: null });

    const result = JSON.parse(raw.slice(start, end + 1));

    if (
      typeof result.widthM === "number" && result.widthM > 0 &&
      typeof result.depthM === "number" && result.depthM > 0
    ) {
      return NextResponse.json({ widthM: result.widthM, depthM: result.depthM });
    }

    return NextResponse.json({ widthM: null, depthM: null });
  } catch (err) {
    console.error("[extract-dimensions]", err);
    return NextResponse.json({ widthM: null, depthM: null });
  }
}
