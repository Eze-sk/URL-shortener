import type { ComponentChildren, ComponentProps } from "preact"
import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks"

export interface MenuList {
  id: string
  content: {
    id: string
    value: string
    type: "link" | "button",
    href?: string
    title?: string
    onClick?: () => void
    icon?: ComponentChildren;
  }[]
}

interface TypeProps extends ComponentProps<"button"> {
  className?: string
  children?: ComponentChildren
  titleForOpen: string
  titleForClosed: string
  menuList: MenuList[]
}

export default function MenuWrapper({
  children,
  className,
  menuList,
  titleForOpen,
  titleForClosed,
  ...att
}: TypeProps
) {
  const [isOpen, setIsOpen] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const menuRef = useRef<HTMLUListElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    if (!isOpen || !menuRef.current || !buttonRef.current) {
      setCoords(null);
      return;
    }

    const menuRect = menuRef.current.getBoundingClientRect();
    const buttonRect = buttonRef.current.getBoundingClientRect();

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let finalLeft = buttonRect.left;
    let finalTop = buttonRect.bottom + 4;

    if (finalLeft + menuRect.width > windowWidth) {
      finalLeft = buttonRect.right - menuRect.width;
    }

    if (finalTop + menuRect.height > windowHeight) {
      finalTop = buttonRect.top - menuRect.height - 4;
    }

    finalLeft = Math.max(10, finalLeft);
    finalTop = Math.max(10, finalTop);

    setCoords({ top: finalTop, left: finalLeft });
  }, [isOpen])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 500);
  };

  const handleOpen = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsOpen(!isOpen)
  }

  const menuStyle = {
    position: "fixed",
    top: coords ? `${coords.top}px` : "0px",
    left: coords ? `${coords.left}px` : "0px",
    zIndex: 9999,
    visibility: coords ? "visible" : "hidden",
  };

  return (
    <div className="relative">
      <button
        title={isOpen ? titleForClosed : titleForOpen}
        type="button"
        ref={buttonRef}
        onClick={handleOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...att}
      >
        {children ?? "context menu"}
      </button>
      {isOpen && (
        <ul
          className="
            bg-light darK:bg-dark border border-light-general dark:border-dark-general
            rounded p-3 shadow
          "
          style={menuStyle}
          ref={menuRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {
            menuList.map((it) => {
              return (
                <ul key={it.id} className="flex flex-col gap-3">
                  {
                    it.content.map((item) => {
                      const isLink = item.type === "link";
                      const Tag = isLink ? "a" : "button";

                      const extraProps = isLink
                        ? { href: item.href }
                        : { onClick: item.onClick, type: "button" as const };

                      return (
                        <li key={item.id}>
                          <Tag
                            title={item.title ?? item.value}
                            className="flex items-center gap-2 text-light-general dark:text-dark-general"
                            {...extraProps}
                          >
                            {item.icon ?? " "}
                            <span>{item.value}</span>
                          </Tag>
                        </li>
                      )
                    })
                  }
                </ul>
              )
            })
          }
        </ul>
      )}
    </div>
  )
}