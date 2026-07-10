import { useState } from "preact/hooks";

import AuthDialog from "./AuthDialog";

export function AuthControl() {
  return (
    <div className="flex items-center gap-4">
      <LoginButton />
      <RegisterButton />
    </div>
  )
}

interface LoginButtonProps {
  content?: string;
  style?: Record<string, string | number>;
}

export function LoginButton({ content, style }: LoginButtonProps) {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(!open)
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="hover:black"
        style={style}
        data-backdrop
      >
        {content ? content : "Login"}
      </button>
      <AuthDialog type="login" isOpen={open} setOpen={setOpen} />
    </>
  )
}

export function RegisterButton() {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(!open)
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="
          bg-darkBlue text-white rounded py-2 px-4 border-2 border-white
          hover:border-darkBlue hover:text-darkBlue hover:bg-transparent transition-all duration-300
        "
      >
        Sign Up
      </button>
      <AuthDialog type="register" isOpen={open} setOpen={setOpen} />
    </>
  )
}