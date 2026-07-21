import z from "zod"
import { messages } from "./messages"

export type SupportedLang = keyof typeof messages

export function createURLScheme(lang: SupportedLang = 'en') {
  const m = messages[lang] || messages.en

  return z
    .url(m.urlRequired)
    .min(12, m.urlMin)
    .max(2000, m.urlMax)
}

export type TypeURLScheme = z.infer<typeof createURLScheme>

export function custonURLScheme(lang: SupportedLang = 'en') {
  const m = messages[lang] || messages.en

  return z.object({
    original_url: createURLScheme(lang)
      .or(z.literal("")),
    slug: z
      .string(m.slug)
      .min(2, m.slugMin)
      .max(50, m.slugMax)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, m.slugRegex),
    expires_at: z.iso
      .datetime(m.slugExpires)
      .optional()
      .nullable()
  })
}

export type TypeCustomData = z.infer<typeof custonURLScheme>

export function AuthScheme(lang: SupportedLang = 'en') {
  const m = messages[lang] || messages.en

  return z.object({
    email: z
      .email(m.authEmail)
      .min(6, m.authEmailMin)
      .max(254, m.authEmailMax),
    password: z
      .string()
      .min(8, m.authPasswordMin)
      .max(255, m.authPasswordMax)
      .regex(/[A-Z]/, m.authPasswordRegex1)
      .regex(/[^a-zA-Z0-0]/, m.authPasswordRegex2)
  })
}

export type TypeUserLogin = z.infer<typeof AuthScheme>