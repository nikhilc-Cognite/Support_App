import { NextResponse } from "next/server";
import { chatWithKapa, isKapaApiConfigured } from "@/lib/kapa-server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ configured: isKapaApiConfigured() });
}

export async function POST(request: Request) {
  if (!isKapaApiConfigured()) {
    return NextResponse.json(
      {
        error:
          "kapa.ai is not configured. Set KAPA_API_KEY and KAPA_PROJECT_ID in .env.local.",
      },
      { status: 503 },
    );
  }

  let body: { query?: unknown; threadId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const query = typeof body.query === "string" ? body.query.trim() : "";
  const threadId = typeof body.threadId === "string" ? body.threadId : null;

  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  try {
    const result = await chatWithKapa(query, threadId);
    return NextResponse.json({
      answer: result.answer,
      threadId: result.threadId,
      sources: result.sources,
      suggestEscalation: Boolean(result.isUncertain) || result.sources.length === 0,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ask AI failed";
    const status = message.toLowerCase().includes("429") ? 429 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
