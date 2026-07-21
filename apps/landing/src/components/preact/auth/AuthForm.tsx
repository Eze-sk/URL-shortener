import { useContext, useState } from "preact/hooks";
import { authClient } from "@lib/authClient";
import { toast } from "@components/wc/Toast.ts";
import AnimateSpin from "@components/preact/animations/AnimateSpin.tsx";

import { useAuth } from "@/hooks/useAuth";
import { AuthContext } from "./AuthRoot";
import IconSheetSVG from "../IconSheetSVG";
import type { TranslateFn } from "@/i18n/utils";

interface TypeAuthForm {
  onClose: () => void
}

export default function AuthForm({ onClose }: TypeAuthForm) {
  const context = useContext(AuthContext)

  if (!context) return

  const { t, type, lang, setType } = context

  const { handleAuth, error, isFinally, isLoading } = useAuth({ type, lang })

  if (isFinally) {
    onClose()
  }

  if (error.server || error.unexpected) {
    toast({
      message: error.server ?
        `${t("error.server")} ${error.server}` : `${t("error.unexpected")} ${error.unexpected}`,
      position: "top-center",
      type: "error"
    })
  }

  const getType = type === "login" ? "login" : "sigin"

  const toggleMode = () => {
    const switchType = type === "login" ? "sigin" : "login"
    setType(switchType)
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-3 mb-6">
        <ProviderCard provider="google" value={t(`${getType}.github`)} />
        <ProviderCard provider="github" value={t(`${getType}.google`)} />
      </div>
      <form onSubmit={handleAuth}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 mb-6">
            <EmailInput text={t} />
            <PasswordInput text={t} />
          </div>
          <div className="flex flex-col items-center gap-3 mb-4">
            <span class="block h-5 text-red-400 font-bold content-center">{error.form ?? ""}</span>
            <button
              className="
                bg-light-general dark:bg-dark-general text-dark-general dark:text-light-general
                py-4 flex justify-center font-bold border-2 border-white rounded activeButton
                hover:border-light-general hover:dark:border-dark-general 
                hover:text-light-general hover:dark:text-dark-general 
                hover:bg-transparent w-full
              "
              type="submit">
              {isLoading ? <AnimateSpin /> : t(`${getType}.submit`)}
            </button>
            {type === "login" &&
              <a
                href="#"
                class="
                  text-dark-annotation dark:text-light-annotation 
                  text-center underline
                "
              >
                {t("login.forgotPassword")}
              </a>
            }
            <button
              type="button"
              onClick={toggleMode}
            >
              <small
                className="
                  text-light-general dark:text-dark-general
                  text-sm font-light hover:text-light-annotation 
                  hover:dark:text-dark-annotation hover:underline
                "
              >
                {t(`auth.switch.${getType}`)}
              </small>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

interface TypeProviderCard {
  value: string
  provider: "google" | "github"
}

export function ProviderCard({ value, provider }: TypeProviderCard) {

  const handleSocialLogin = async () => {
    await authClient.signIn.social({
      provider: provider,
      callbackURL: window.location.href,
    });
  }

  return (
    <button
      className="
        py-4 flex items-center justify-center gap-4 rounded
        border border-light-general dark:border-dark-general
        hover:border-light-annotation hover:dark:border-dark-annotation
        text-light-general dark:text-dark-general
        hover:text-light-annotation hover:dark:text-dark-annotation
      "
      onClick={handleSocialLogin}
    >
      <IconSheetSVG icon={provider} size={16} />
      <span>
        {value}
      </span>
    </button>
  )
}

function EmailInput({ text }: { text: TranslateFn }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="email" className="text-light-general dark:text-dark-general">Email:</label>
      <input
        type="email"
        name="email"
        id="email"
        autocomplete="on"
        placeholder={text("auth.email.placeholder")}
        className="
          py-2 px-4 w-full border rounded border-light-general dark:border-dark-general
          placeholder-gray-400 dark:placeholder-gray-500
          text-light-general dark:text-dark-general
          hover:border-light-annotation hover:dark:border-dark-annotation
        "
      />
    </div>
  )
}

function PasswordInput({ text }: { text: TranslateFn }) {
  const [show, setShow] = useState(false)

  const handleShow = (e: MouseEvent) => {
    e.preventDefault()
    setShow(!show)
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="password" className="text-light-general dark:text-dark-general">{text("auth.password")}:</label>
      <div className="relative flex items-center">
        <input
          className="
            py-2 px-4 w-full flex-1 border rounded border-light-general dark:border-dark-general
            placeholder-gray-400 dark:placeholder-gray-500
            text-light-general dark:text-dark-general
            hover:border-light-annotation hover:dark:border-dark-annotation
          "
          type={show ? "text" : "password"}
          name="password"
          id="password"
          placeholder="****"
        />
        <button
          className="
            absolute right-2
            text-light-general dark:text-dark-general
            hover:text-light-annotation hover:dark:text-dark-annotation
          "
          onClick={handleShow}
          title={show ? text("title.password.hidden") : text("title.password.show")}
        >
          {
            show ? <IconSheetSVG icon="closed-eye" size={16} /> : <IconSheetSVG icon="open-eye" size={16} />
          }
        </button>
      </div>
    </div>
  )
}
