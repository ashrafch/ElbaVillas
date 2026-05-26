import type { z } from "zod"

import type { leadSchema } from "@/lib/validations"

export type LeadFormValues = z.infer<typeof leadSchema>
