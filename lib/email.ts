import { Resend } from "resend"

import type { LeadFormValues } from "@/types/lead"

let resendClient: Resend | null = null

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    return null
  }

  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }

  return resendClient
}

function renderLeadText(data: LeadFormValues) {
  return [
    "Nuova richiesta informazioni - Elba Luce Villas",
    "",
    `Nome: ${data.firstName} ${data.lastName}`,
    `Email: ${data.email}`,
    `Telefono: ${data.phone || "Non indicato"}`,
    `Budget: ${data.budget || "Non indicato"}`,
    `Interesse: ${data.interest}`,
    `Messaggio: ${data.message || "Non indicato"}`,
    `Origine: ${process.env.NEXT_PUBLIC_SITE_URL || "Sito web"}`,
    `Data: ${new Date().toISOString()}`,
  ].join("\n")
}

function renderLeadHtml(data: LeadFormValues) {
  return `
    <div style="font-family:Arial,sans-serif;color:#24302f;line-height:1.6">
      <h1 style="font-family:Georgia,serif;font-weight:500">Nuova richiesta informazioni</h1>
      <p>Un contatto ha compilato il form di Elba Luce Villas.</p>
      <table style="border-collapse:collapse;width:100%;max-width:640px">
        ${[
          ["Nome", `${data.firstName} ${data.lastName}`],
          ["Email", data.email],
          ["Telefono", data.phone || "Non indicato"],
          ["Budget", data.budget || "Non indicato"],
          ["Interesse", data.interest],
          ["Messaggio", data.message || "Non indicato"],
          ["Origine", process.env.NEXT_PUBLIC_SITE_URL || "Sito web"],
          ["Data", new Date().toLocaleString("it-IT")],
        ]
          .map(
            ([label, value]) =>
              `<tr><td style="padding:10px;border-bottom:1px solid #ddd;font-weight:bold">${label}</td><td style="padding:10px;border-bottom:1px solid #ddd">${value}</td></tr>`
          )
          .join("")}
      </table>
    </div>
  `
}

export async function sendLeadEmail(data: LeadFormValues) {
  const resend = getResend()
  const receiver = process.env.LEAD_RECEIVER_EMAIL

  if (!resend || !receiver) {
    console.log("[lead:mock]", renderLeadText(data))
    return { mocked: true }
  }

  await resend.emails.send({
    from: "Elba Luce Villas <onboarding@resend.dev>",
    to: receiver,
    subject: `Nuovo lead: ${data.firstName} ${data.lastName}`,
    html: renderLeadHtml(data),
    text: renderLeadText(data),
    replyTo: data.email,
  })

  return { mocked: false }
}
