import { type RequestHandler } from 'express';

const ALLOWED_FIELDS = {
  anonymous: ["original_url"],
  registered: ["original_url", "custom_domain", "slug", "expires_at"]
}

export const protectFieldsMiddleware: RequestHandler = async (req, res, next) => {
  const isRegistered = !!req.user
  const allowedFields = isRegistered ? ALLOWED_FIELDS.registered : ALLOWED_FIELDS.anonymous

  const sentFields = Object.keys(req.body)

  const filterBody = sentFields.reduce((acc, key) => {
    if (allowedFields.includes(key)) {
      acc[key] = req.body[key]
    }

    return acc
  }, {} as Record<string, any>)

  req.body = filterBody

  next()
}