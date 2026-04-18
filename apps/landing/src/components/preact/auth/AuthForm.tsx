import { api } from "@lib/api";
import { useState } from "preact/hooks";
import { loginScheme } from "@repo/schemes";
import { authClient } from "@lib/authClient";
import { toast } from "@components/wc/Toast.ts";
import { ENDPOINT, EXPRESS_API } from "@consts/config";
import AnimateSpin from "@components/preact/animations/AnimateSpin.tsx";

import { getNameFromEmail } from "@/util/getNameFromEmail";

export type Provider = "google" | "github"
export type Type = "login" | "register"

export type FormErrors = {
  email?: string | null;
  password?: string | null;
};

export default function AuthForm({
  message,
  type,
  onClose,
}: {
  message: string,
  type: Type,
  onClose: () => void
}) {
  const [error, setError] = useState<FormErrors>({ email: null, password: null })
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    const form = e.currentTarget as HTMLFormElement

    const formData = Object.fromEntries(new FormData(form).entries());

    const validation = loginScheme.safeParse(formData)

    if (!validation.success) {
      const { fieldErrors } = validation.error.flatten();

      setError({
        email: fieldErrors.email?.[0] || "",
        password: fieldErrors.password?.[0] || ""
      });
      return;
    }

    setError({ email: null, password: null })
    setIsLoading(true)

    const { email, password } = validation.data;

    const { data, error } = type === "login"
      ? await authClient.signIn.email({ email, password })
      : await authClient.signUp.email({
        email,
        password,
        name: getNameFromEmail(email)
      });

    if (error) {
      setIsLoading(false)

      toast({
        message: error.message || "Error de autenticación",
        position: "top-center",
        type: "error"
      })


      return
    }

    setIsLoading(false)
    onClose()
    window.location.reload()
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <ProviderCard provider="google" message={`${message} Google`} />
      <ProviderCard provider="github" message={`${message} github`} />
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <EmailInput error={error.email} />
          <PasswordInput error={error.password} />
          <button
            className="bg-black py-4 flex justify-center text-white cursor-pointer rounded"
            type="submit">
            {isLoading ? <AnimateSpin /> : "Start"}
          </button>
        </div>
      </form>
      {type === "login" &&
        <a href="#" class="text-blue-700 text-center underline">Forgot Password?</a>
      }
    </div>
  )
}

export function ProviderCard({ message, provider }: { message: string, provider: Provider }) {

  const handleSocialLogin = async () => {
    await authClient.signIn.social({
      provider: provider,
      callbackURL: window.location.href,
    });
  }

  return (
    <button
      className="
        border border-gray-500 py-4 flex items-center justify-center gap-4 rounded cursor-pointer
        "
      onClick={handleSocialLogin}
    >
      <ServiceCardIcon icon={provider} />
      <span>{message}</span>
    </button>
  )
}

function EmailInput({ error }: { error: string | null | undefined }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        name="email"
        id="email"
        className="border border-gray-400 rounded py-2 px-4 w-full"
      />

      <small class="text-red-400 text-[.75rem]">{error ?? <span>&#12644;</span>}</small>
    </div>
  )
}

function PasswordInput({ error }: { error: string | null | undefined }) {
  const [show, setShow] = useState(false)

  const handleShow = (e: MouseEvent) => {
    e.preventDefault()
    setShow(!show)
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="password">Password:</label>
      <div className="relative flex items-center">
        <input
          className="border border-gray-400 rounded py-2 px-4 flex-1"
          type={show ? "text" : "password"}
          name="password"
          id="password"
        />
        <button
          className="absolute right-2 cursor-pointer"
          onClick={handleShow}
          title={show ? "Show password" : "Hide password"}
        >
          {
            show ? (
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
              </svg>
            )
          }
        </button>
      </div>
      <small class="text-red-400 text-[.75rem]">{error ?? <span>&#12644;</span>}</small>
    </div>
  )
}

function ServiceCardIcon({ icon }: { icon: Provider }) {
  return (
    <>
      {
        icon === "google" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"
            />
          </svg>
        )
      }
      {
        icon === "github" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"
            />
          </svg>
        )
      }
    </>
  )
}