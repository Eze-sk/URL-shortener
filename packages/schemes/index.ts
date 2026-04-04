import z from "zod"

export const urlScheme = z
  .url("Must be a valid URL.")
  .min(12, "The URL is too short to be valid.")
  .max(2000, "The URL exceeds the allowed limit of 2000 characters")

export type urlSchemeType = z.infer<typeof urlScheme>

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