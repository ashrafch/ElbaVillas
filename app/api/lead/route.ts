import { NextResponse } from "next/server"

import { sendLeadEmail } from "@/lib/email"
import { checkRateLimit } from "@/lib/rate-limit"
import { leadSchema } from "@/lib/validations"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = leadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Controlla i campi e riprova." },
        { status: 400 }
      )
    }

    if (parsed.data.website) {
      return NextResponse.json({
        success: true,
        message: "Richiesta ricevuta. Ti ricontatteremo a breve.",
      })
    }

    const forwardedFor = request.headers.get("x-forwarded-for") || "unknown"
    const ipHint = forwardedFor.split(",")[0]?.trim() || "unknown"
    const rateLimit = checkRateLimit(ipHint)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, message: "Troppe richieste ravvicinate. Riprova tra qualche minuto." },
        { status: 429 }
      )
    }

    await sendLeadEmail(parsed.data, {
      source: request.headers.get("referer") || process.env.NEXT_PUBLIC_SITE_URL || "Sito web",
      userAgent: request.headers.get("user-agent") || "Non disponibile",
      ipHint,
      receivedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: "Richiesta ricevuta. Ti ricontatteremo con materiali e disponibilita.",
    })
  } catch (error) {
    console.error("[lead:error]", error)
    return NextResponse.json(
      { success: false, message: "Non siamo riusciti a inviare la richiesta. Riprova tra poco." },
      { status: 500 }
    )
  }
}
