import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function makeCaseNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.floor(Math.random() * 1296)
    .toString(36)
    .toUpperCase()
    .padStart(2, "0");
  return `TIP-${stamp}-${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as {
      name?: unknown;
      email?: unknown;
      message?: unknown;
    } | null;

    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (name.length < 2 || name.length > 80) {
      return NextResponse.json(
        { error: "Every suspect needs a name (2-80 characters)." },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(email) || email.length > 160) {
      return NextResponse.json(
        { error: "That evidence channel (email) does not look valid." },
        { status: 400 }
      );
    }
    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json(
        { error: "Your statement must be between 10 and 2000 characters." },
        { status: 400 }
      );
    }

    const tip = await db.caseTip.create({
      data: { caseNumber: makeCaseNumber(), name, email, message },
    });

    const total = await db.caseTip.count();

    return NextResponse.json({
      ok: true,
      caseNumber: tip.caseNumber,
      total,
    });
  } catch (err) {
    console.error("[case-tips POST]", err);
    return NextResponse.json(
      { error: "The evidence locker is jammed. Try again shortly." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const total = await db.caseTip.count();
    return NextResponse.json({ total });
  } catch (err) {
    console.error("[case-tips GET]", err);
    return NextResponse.json({ total: 0 });
  }
}
