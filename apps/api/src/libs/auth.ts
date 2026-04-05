import { db } from "@db/connectionPg";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { AUTH_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BASE_URL, ORIGIN_URL } from "@consts/config";
import * as schema from "@schema/auth-schema"

export const auth = betterAuth({
  baseURL: `${BASE_URL}/api/auth`,
  secret: AUTH_SECRET,
  trustedOrigins: [ORIGIN_URL!],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: GITHUB_CLIENT_ID!,
      clientSecret: GITHUB_CLIENT_SECRET
    }
  },
})