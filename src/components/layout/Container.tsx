import clsx from "clsx";
import { ReactNode } from "react";

const Container = ({ children, className, fullWidth }: { children: ReactNode; className?: string; fullWidth?: Boolean }) => (
  <div className={clsx(fullWidth ? "relative mx-auto max-w-full justify-center px-4 sm:px-6 lg:px-8" : "relative mx-auto max-w-7xl px-4 sm:px-6 lg:max-w-screen-xl lg:px-8", className)}>
    {children}
  </div>
);

export default Container;
