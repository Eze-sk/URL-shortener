import { createPortal } from "preact/compat";
import { lazy, Suspense } from 'preact/compat';
import { useContext, useEffect, useRef, useState } from "preact/hooks";

import AnimateSpin from '@components/preact/animations/AnimateSpin.tsx';
import { AuthContext } from "./AuthRoot";

const AuthForm = lazy(() => import('./AuthForm'))

export default function AuthDialog() {
  const context = useContext(AuthContext)

  if (!context) return

  const { setOpen, open } = context

  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setContainer(document.body);
  }, []);

  if (!container) return null;

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) return

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }

    const handleClose = () => {
      dialog.close();
      setOpen(false)
    };

    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [open])


  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === dialogRef.current) {
      if (dialogRef.current) dialogRef.current.close();
      setOpen(false)
    }
  };

  const handleClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
      setOpen(false)
    }
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="
        m-auto rounded-lg max-w-135 max-h-145 w-full h-full
        bg-light dark:bg-dark border border-light-general dark:border-dark-general
        backdrop:backdrop-blur-sm backdrop:bg-black/10 outline-none
      "
    >
      {
        open && (
          <Suspense fallback={<Loader />}>
            <AuthForm onClose={handleClose} />
          </Suspense>
        )
      }
    </dialog>,
    container
  )
}

function Loader() {
  const context = useContext(AuthContext)

  if (!context) return

  const { t } = context

  return (
    <div className="flex flex-col gap-2 items-center justify-center w-full h-full">
      <AnimateSpin />
      <span class="text-light-general dark:text-dark-general">{t("loading")}</span>
    </div>
  )
}