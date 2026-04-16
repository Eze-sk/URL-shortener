import z from "zod"

export const urlScheme = z
  .url("Must be a valid URL.")
  .min(12, "The URL is too short to be valid.")
  .max(2000, "The URL exceeds the allowed limit of 2000 characters")

export type urlSchemeType = z.infer<typeof urlScheme>

export const customData = z.object({
  domain: z
    .string()
    .min(4, "The domain must be at least 4 characters long.")
    .max(61, "The domain name must not exceed 31 characters.")
    .regex(
      /^[a-z0-9-]{2,}\.[a-z]{2,}$/i,
      "The domain must be valid."
    ),
  slug: z
    .string()
    .min(2, "The slug must have at least 2 character.")
    .max(50, "The slug has a maximum of 50 characters."),
  expiration: z.iso.datetime()
})

export const loginScheme = z.object({
  email: z
    .email("It must be a valid email address.")
    .min(8, "The password must be at least 8 characters long.")
    .max(320, "The email exceeds the 320 character limit."),
  password: z
    .string()
    .min(4, "The password must be at least 8 characters long.")
    .max(255, "The password exceeds the 255 character limit")
    .regex(/[A-Z]/, "The password must contain at least one uppercase letter")
    .regex(/[^a-zA-Z0-0]/, "The password must contain at least one special character")
})

export type UserLoginType = z.infer<typeof loginScheme>