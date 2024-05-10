import clsx from "clsx";
import { ReactNode } from "react";

const Container = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div
    className={clsx("relative mx-auto w-full max-w-7xl px-3 sm:px-6 lg:ml-36 lg:max-w-screen-xl lg:px-8", className)}
  >
    {children}
  </div>
);

export default Container;
