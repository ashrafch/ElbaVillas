import { z } from "zod"

export const leadSchema = z.object({
  firstName: z.string().trim().min(2, "Inserisci il nome"),
  lastName: z.string().trim().min(2, "Inserisci il cognome"),
  email: z.string().trim().email("Inserisci un'email valida"),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^[+()\d\s.-]{7,20}$/.test(value), "Inserisci un telefono plausibile"),
  budget: z.string().trim().optional(),
  interest: z.enum(["acquisto", "investimento", "informazioni", "visita"], {
    message: "Seleziona il tipo di interesse",
  }),
  message: z.string().trim().max(1200, "Messaggio troppo lungo").optional(),
  privacyAccepted: z.boolean().refine((value) => value, "Il consenso privacy e obbligatorio"),
  website: z.string().optional(),
})
