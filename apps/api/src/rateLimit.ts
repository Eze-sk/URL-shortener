import { rateLimit } from "express-rate-limit"

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  message: "Too many requests from this IP address, please try again after 1 minute.",
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})