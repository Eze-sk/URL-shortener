import { EXPRESS_API } from "@consts/config";
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: EXPRESS_API
})
