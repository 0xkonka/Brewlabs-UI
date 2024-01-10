import clsx from "clsx";
import { ReactNode } from "react";

const Container = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div
    className={clsx("relative mx-auto w-full max-w-7xl px-3 sm:px-6 lg:max-w-screen-xl lg:px-8 3xl:ml-16", className)}
  >
    {children}
  </div>
);

export default Container;
