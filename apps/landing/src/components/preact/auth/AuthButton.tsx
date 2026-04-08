import { useState } from "preact/hooks";

import AuthDialog from "./AuthDialog";

export function AuthControl() {
  return (
    <div className="flex gap-4">
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
        className="cursor-pointer"
        style={style}
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
        className="bg-black text-white rounded py-2 px-4 cursor-pointer"
      >
        Sign Up
      </button>
      <AuthDialog type="register" isOpen={open} setOpen={setOpen} />
    </>
  )
}