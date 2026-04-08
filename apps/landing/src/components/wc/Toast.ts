
type Positions = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
type PositionStyle = {
  styles: string,
  translateIn: string
  translateOut: string
}

type PositionType = Record<Positions, PositionStyle>

type Type = "default" | "success" | "error"
type Theme = "light" | "dark"
type Style = {
  bg: string,
  border: string,
  text: string
}

type ThemeTye = Record<
  Theme,
  Record<Type, Style>
>

export class WCToast extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    const attMessage = this.getAttribute("toast-message") || "Default message"
    const attPosition = this.getAttribute("toast-position") || "top-center"
    const attType = this.getAttribute("toast-type") || "default"
    const attTheme = this.getAttribute("toast-theme") || "light"
    const attIcon = this.getAttribute("toast-icon")

    const type = attType as Type

    const theme: ThemeTye = {
      light: {
        default: {
          bg: "hsl(0, 0%, 100%)",
          border: "hsl(220, 13%, 91%)",
          text: "hsl(0, 0%, 0%)"
        },
        error: {
          bg: "hsl(359, 100%, 97%)",
          border: "hsl(359, 100%, 94%)",
          text: "hsl(360, 100%, 45%)"
        },
        success: {
          bg: "hsl(143, 85%, 96%)",
          border: "hsl(145, 92%, 87%)",
          text: "hsl(140, 100%, 27%)"
        }
      },
      dark: {
        default: {
          bg: "hsl(0, 0%, 0%)",
          border: "hsl(0, 0%, 20%)",
          text: "hsl(0, 0%, 99%)"
        },
        error: {
          bg: "hsl(358, 76%, 10%)",
          border: "hsl(357, 89%, 16%)",
          text: "hsl(358, 100%, 81%)"
        },
        success: {
          bg: "hsl(150, 100%, 6%)",
          border: "hsl(147, 100%, 12%)",
          text: "hsl(150, 86%, 65%)"
        }
      }
    }

    const positions: PositionType = {
      "top-left": {
        styles: "top: 10px; left: 10px;",
        translateIn: "translateX(0%) translateY(-15px)",
        translateOut: "translateX(0%) translateY(0px)",
      },
      "top-center": {
        styles: "top: 10px; left: 50%;",
        translateIn: "translateX(-50%) translateY(-15px)",
        translateOut: "translateX(-50%) translateY(0px)",
      },
      "top-right": {
        styles: "top: 10px; right: 10px;",
        translateIn: "translateX(0) translateY(-15px)",
        translateOut: "translateX(0%) translateY(0px)",
      },
      "bottom-left": {
        styles: "bottom: 10px; left: 10px;",
        translateIn: "translateX(0) translateY(15px)",
        translateOut: "translateX(0%) translateY(0px)",
      },
      "bottom-center": {
        styles: "bottom: 10px; left: 50%;",
        translateIn: "translateX(-50%) translateY(15px)",
        translateOut: "translateX(-50%) translateY(0px)"
      },
      "bottom-right": {
        styles: "bottom: 10px; right: 10px;",
        translateIn: "translateX(0) translateY(15px)",
        translateOut: "translateX(0%) translateY(0px)",
      }
    }

    const getTheme = theme[attTheme as Theme][type]
    const getPositions = positions[attPosition as Positions]

    const icon = attIcon ? attIcon : icons({ type })

    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = HTML({
        style: getTheme,
        position: getPositions,
        message: attMessage,
        icon
      })

      const toastElement = this.shadowRoot.querySelector('.toast') as HTMLElement;

      if (toastElement && toastElement.showPopover) {
        toastElement.showPopover();
      }
    }
  }
}

export function toast(
  {
    message,
    position,
    theme,
    type
  }: {
    message: string,
    position: Positions,
    theme?: Theme,
    type?: Type
  }) {
  const newToast = document.createElement("ws-toast")

  newToast.setAttribute("toast-message", message)
  newToast.setAttribute("toast-position", position)
  newToast.setAttribute("toast-theme", theme ?? "light")
  newToast.setAttribute("toast-type", type ?? "default")

  document.body.appendChild(newToast)

  setTimeout(() => {
    newToast.remove()
  }, 3000)
}

function HTML(
  {
    style,
    position,
    message,
    icon
  }: {
    style: Style,
    position: PositionStyle,
    message: string,
    icon: string | undefined
  }) {
  return /*html*/`
    <div class="toast" popover="manual">
      ${icon ?? " "}
      ${message}
    </div>
    <style>
      .toast {
        padding: 8px 16px;
        min-width: 350px;
        background-color: ${style.bg};
        color: ${style.text};
        border: 1px solid  ${style.border};
        border-radius: 5px;
        box-shadow: 1px 2px 5px -3px rgba(0,0,0,0.47);

        display: flex;
        align-items: center;
        gap: 8px;

        font-weight: 500;
        z-index: 999999999;

        transform: ${position.translateOut};

        animation: animation-toast 0.5s ease-in-out;
      }

      .toast:popover-open {
          inset: unset; 
          margin: 0;

          position: fixed;
          ${position.styles}

          display: flex; 
        }

      @keyframes animation-toast {
        from {
          opacity: 0;
          transform: ${position.translateIn};
        }

        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0px);
        }
      }
    </style>
  `
}

function icons({ type }: { type: Type }) {
  const iconEnum: Partial<Record<Type, string>> = {
    error: /*html*/`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="currentColor"
        viewBox="0 0 16 16"
        >
        <path
          d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2"
        />
      </svg>
    `,
    success: /*html*/`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="currentColor"
        viewBox="0 0 16 16"
        >
        <path
          d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0"
        />
        <path
          d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"
        />
      </svg>
    `
  }

  return iconEnum[type]
}

