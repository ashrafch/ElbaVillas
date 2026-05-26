"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { leadSchema } from "@/lib/validations"
import type { LeadFormValues } from "@/types/lead"

const interests = [
  { value: "acquisto", label: "Acquisto" },
  { value: "investimento", label: "Investimento" },
  { value: "informazioni", label: "Informazioni generali" },
  { value: "visita", label: "Visita" },
] as const

export function LeadForm() {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { website: "", privacyAccepted: false },
  })

  async function onSubmit(values: LeadFormValues) {
    setStatus(null)
    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    const payload = (await response.json()) as { success: boolean; message: string }

    if (!response.ok || !payload.success) {
      setStatus({ type: "error", message: payload.message || "Invio non riuscito." })
      return
    }

    setStatus({ type: "success", message: payload.message })
    reset({ website: "", privacyAccepted: false })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <input tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...register("website")} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nome" error={errors.firstName?.message}>
          <Input className="h-11 rounded-none bg-white/70" {...register("firstName")} />
        </Field>
        <Field label="Cognome" error={errors.lastName?.message}>
          <Input className="h-11 rounded-none bg-white/70" {...register("lastName")} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" className="h-11 rounded-none bg-white/70" {...register("email")} />
        </Field>
        <Field label="Telefono" error={errors.phone?.message}>
          <Input className="h-11 rounded-none bg-white/70" {...register("phone")} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Budget indicativo" error={errors.budget?.message}>
          <Input className="h-11 rounded-none bg-white/70" placeholder="Es. 1M - 2M" {...register("budget")} />
        </Field>
        <Field label="Interesse" error={errors.interest?.message}>
          <select className="h-11 w-full border border-input bg-white/70 px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" {...register("interest")}>
            <option value="">Seleziona</option>
            {interests.map((interest) => (
              <option key={interest.value} value={interest.value}>
                {interest.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Messaggio" error={errors.message?.message}>
        <Textarea className="min-h-32 rounded-none bg-white/70" {...register("message")} />
      </Field>
      <div className="flex items-start gap-3">
        <input
          id="privacyAccepted"
          type="checkbox"
          className="mt-1 size-4 accent-[#2f6754]"
          {...register("privacyAccepted")}
        />
        <Label htmlFor="privacyAccepted" className="text-sm leading-6 text-foreground/75">
          Acconsento al trattamento dei dati per ricevere informazioni sul progetto.
          {errors.privacyAccepted?.message ? <span className="block text-destructive">{errors.privacyAccepted.message}</span> : null}
        </Label>
      </div>
      {status ? (
        <div className={status.type === "success" ? "border border-accent/30 bg-accent/10 p-4 text-sm text-primary" : "border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"}>
          {status.message}
        </div>
      ) : null}
      <Button type="submit" disabled={isSubmitting} className="min-h-12 rounded-none bg-primary px-5 py-3 text-xs uppercase tracking-[0.12em] text-primary-foreground hover:bg-primary/90 sm:px-6 sm:text-sm sm:tracking-[0.18em]">
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        Richiedi informazioni riservate
      </Button>
    </form>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
