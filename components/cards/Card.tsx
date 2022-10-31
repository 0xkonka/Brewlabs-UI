import clsx from "clsx";
import { ReactNode } from "react";

const Card = ({
  children,
  shadowColor,
}: {
  children: ReactNode;
  shadowColor?: string;
}) => (
  <div
    className={clsx(
      "shadow-right w-54 -mr-12 min-w-fit rounded-lg border-t border-slate-800 bg-zinc-900 bg-opacity-90 px-4 py-2 shadow-lg backdrop-blur-sm",
      `shadow-${shadowColor}`
    )}
  >
    {children}
  </div>
);

export default Card;
