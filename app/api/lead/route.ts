import { NextResponse } from "next/server"

import { sendLeadEmail } from "@/lib/email"
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

    // TODO: add IP-based rate limiting before production campaigns.
    await sendLeadEmail(parsed.data)

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
