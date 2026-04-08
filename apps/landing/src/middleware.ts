import { defineMiddleware } from "astro:middleware";
import { authClient } from "@lib/authClient";

export const onRequest = defineMiddleware(async (context, next) => {
  const { data } = await authClient.getSession({
    fetchOptions: {
      headers: {
        cookie: context.request.headers.get("cookie") || "",
      },
    },
  });

  context.locals.session = data?.session ?? null;
  context.locals.user = data?.user ?? null;

  return next();
})