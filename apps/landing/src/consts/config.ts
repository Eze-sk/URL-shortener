export const NEON_AUTH_URL = import.meta.env.SECRET_NEON_AUTH_URL

export const EXPRESS_API = import.meta.env.PUBLIC_EXPRESS_API

export const ENDPOINT = {
  create: `/api/url-shortener/create`,
  update: `/api/url-shortener/update`,
  delete: `/api/url-shortener/delete`,
  login: `/api/auth/sign-in`,
  register: `/api/auth/sign-up`
}