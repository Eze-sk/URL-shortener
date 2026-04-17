import { auth } from "@libs/auth.ts"
import { type RequestHandler } from 'express';

export const userSessionMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: new Headers(req.headers as Record<string, string>)
    });

    req.user = session?.user ?? null;
    req.session = session?.session ?? null;
  } catch (err) {
    req.user = null;
    req.session = null;
  }

  next();
}