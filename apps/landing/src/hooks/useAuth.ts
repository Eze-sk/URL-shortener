import { getNameFromEmail } from "@/util/getNameFromEmail";
import type { DialogType } from "@components/preact/auth/AuthRoot";
import { authClient } from "@lib/authClient";
import { AuthScheme, type SupportedLang } from "@repo/schemes";
import { useState } from "preact/hooks";
import z from "zod"

interface TypeError {
  form?: string
  server?: string
  unexpected?: string
}

export function useAuth({ type, lang }: { type: DialogType | null, lang: SupportedLang }) {
  const [error, setError] = useState<TypeError>({ form: "", server: "", unexpected: "" })
  const [isFinally, setisFinally] = useState(false)
  const [isLoading, setIsLoading] = useState(false);

  const scheme = AuthScheme(lang)

  const handleAuth = async (e: Event) => {
    e.preventDefault()

    const form = e.currentTarget as HTMLFormElement

    const formData = Object.fromEntries(new FormData(form).entries());

    try {
      const { email, password } = scheme.parse(formData)

      setError({ form: "", server: "", unexpected: "" })
      setIsLoading(true)

      const { error } = type === "login"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({
          email,
          password,
          name: getNameFromEmail(email)
        });

      if (error) {
        setError({ server: error.message });
        console.error(error)
        setIsLoading(false);
        return;
      }

      setError({ form: "", server: "", unexpected: "" })
      setIsLoading(false)
      setisFinally(true)
    } catch (err) {
      setIsLoading(false);

      if (err instanceof z.ZodError) {
        setError({ form: err.issues[0].message })
      } else {
        setError({ unexpected: err instanceof Error ? err.message : "An unexpected error occurred" })
        console.error(err)
      }
    }
  }

  return { handleAuth, error, isFinally, isLoading }
}