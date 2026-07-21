import { createContext, type ComponentChildren } from "preact";
import { useContext, useState } from "preact/hooks";
import AuthDialog from "./AuthDialog";
import { useClientTranslation, type TranslateFn } from "@/i18n/utils";
import type { SupportedLang } from "@/i18n/ui";

export type DialogType = "login" | "sigin"

export interface TypeAuthContext {
  open: boolean
  type: DialogType | null
  setOpen: (action: boolean) => void
  setType: (type: DialogType) => void
  t: TranslateFn
  lang: SupportedLang
}

export const AuthContext = createContext<TypeAuthContext | undefined>(undefined)

interface TypeAuthRoot {
  lang: SupportedLang
  children?: ComponentChildren
}

function AuthRoot({ lang, children }: TypeAuthRoot) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<DialogType | null>(null)

  const t = useClientTranslation(lang)

  return (
    <AuthContext.Provider value={{ open, type, setOpen, setType, t, lang }}>
      <div className="flex items-center gap-4">
        {children}
      </div>
      <AuthDialog />
    </AuthContext.Provider>
  )
}

type TypeVariant = "filling" | "light"

interface TypeAuthInput {
  type: DialogType,
  variant: TypeVariant
}

function AuthInput({ type, variant }: TypeAuthInput) {
  const context = useContext(AuthContext)

  if (!context) {
    console.error("AuthInput must be used within AuthRoot")
    return
  }

  const { setOpen, setType, t } = context

  const handleAction = () => {
    setOpen(true)
    setType(type)
  }

  const getVaraint: Record<TypeVariant, string> = {
    light: "brightness-100 transition duration-300 hover:brightness-150",
    filling: `
      bg-light-general dark:bg-dark-general text-dark-general dark:text-light-general 
      py-2 px-4 border-2 border-white rounded
      hover:border-light-general hover:dark:border-dark-general 
      hover:text-light-general hover:dark:text-dark-general 
      hover:bg-transparent transition-all duration-300
    `,
  }

  const getType = type === "login" ? "login" : "sigin"

  return (
    <button
      onClick={handleAction}
      className={getVaraint[variant]}
      title={t(`title.${getType}`)}
      data-backdrop={type === "login" ? "true" : undefined}
    >
      {t(`header.${getType}`)}
    </button>
  )
}

AuthRoot.input = AuthInput

interface TypeAuthContainer {
  lang: SupportedLang
}

export function AuthContainer({ lang }: TypeAuthContainer) {
  return (
    <AuthRoot lang={lang}>
      <AuthRoot.input type="login" variant="light" />
      <AuthRoot.input type="sigin" variant="filling" />
    </AuthRoot>
  )
}

export default AuthRoot