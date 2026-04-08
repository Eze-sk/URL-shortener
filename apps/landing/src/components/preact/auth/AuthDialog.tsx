import { createPortal } from "preact/compat";
import { lazy, Suspense } from 'preact/compat';
import { useEffect, useRef, useState, type Dispatch, type StateUpdater } from "preact/hooks";

import type { Type } from './AuthForm';
import AnimateSpin from '@components/preact/animations/AnimateSpin.tsx';

const AuthForm = lazy(() => import('./AuthForm'))

export default function AuthDialog(
  {
    type,
    isOpen,
    setOpen
  }: {
    type: Type,
    isOpen: boolean,
    setOpen: Dispatch<StateUpdater<boolean>>
  }) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setContainer(document.body);
  }, []);

  if (!container) return null;

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) return

    if (isOpen) {
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
  }, [isOpen])


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

  const typeEnum: Record<Type, {
    message: string
  }> = {
    register: {
      message: "Create your account with"
    },
    login: {
      message: "Log in with"
    }
  }

  const getMessage = typeEnum[type].message

  return createPortal(
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="
        m-auto rounded-lg border border-gray-300 min-w-100
        backdrop:backdrop-blur-sm backdrop:bg-black/10 outline-none
      "
    >
      {
        isOpen && (
          <Suspense fallback={<Loader />}>
            <AuthForm message={getMessage} type={type} onClose={handleClose} />
          </Suspense>
        )
      }
    </dialog>,
    container
  )
}

function Loader() {
  return (
    <div className="flex items-center justify-center w-99.5 h-131 flex-col gap-2">
      <AnimateSpin />
      <span>Loading...</span>
    </div>
  )
}