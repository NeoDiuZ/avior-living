import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { JWT } from "google-auth-library";

const SHEET_ID = process.env.GOOGLE_SHEETS_ID!;

export async function POST(req: NextRequest) {
  const { name, whatsapp } = await req.json();

  if (!name?.trim() || !whatsapp?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const phone = String(whatsapp).replace(/\D/g, "");
  if (phone.length !== 8 || !/^[89]/.test(phone)) {
    return NextResponse.json({ error: "Invalid Singapore mobile number" }, { status: 400 });
  }

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  try {
    await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:+65${phone}`,
      body:
        `Hi ${name.trim()}! 👋\n\n` +
        `You're in! Here's your free express delivery code:\n\n` +
        `*${process.env.EXPRESS_DELIVERY_CODE}*\n\n` +
        `Apply it at checkout to waive the $20 express delivery fee — standard delivery remains free for everyone.\n\n` +
        `Head back to your cart and complete your order:\n` +
        `aviorliving.sg\n\n` +
        `White-glove delivery, full assembly, and packaging disposal are all included.\n\n` +
        `— The Avior Team`,
    });
  } catch (err) {
    console.error("Twilio error:", err);
    return NextResponse.json({ error: "Failed to send WhatsApp message" }, { status: 500 });
  }

  try {
    const auth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const { token } = await auth.getAccessToken();
    const range = encodeURIComponent("Sheet1!A1");
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [[new Date().toISOString(), name.trim(), `+65${phone}`, "Opening Sale", "Sent"]],
        }),
      },
    );
  } catch (err) {
    console.error("Sheets error:", err);
  }

  return NextResponse.json({ success: true });
}
