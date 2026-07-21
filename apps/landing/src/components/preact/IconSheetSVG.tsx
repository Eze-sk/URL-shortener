import type { ComponentProps } from "preact";

type TypeIcon =
  | "google"
  | "github"
  | "open-eye"
  | "closed-eye"

interface TypeProps extends ComponentProps<"svg"> {
  icon: TypeIcon;
  size: number;
};

export default function IconSheetSVG({ icon, size, ...props }: TypeProps) {
  return (
    <svg
      {...props}
      aria-hidden="true"
      role="img"
      width={size}
      height={size}
      viewBox="0 0 16 16"
    >
      <use href={`/assets/svgsheet.svg#${icon}`} />
    </svg>
  );
}
