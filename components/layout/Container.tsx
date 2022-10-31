import { ReactNode } from "react";

const Container = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={`relative mx-auto max-w-7xl px-0 sm:px-6 lg:max-w-screen-xl lg:px-8 ${className}`}
  >
    {children}
  </div>
);

export default Container;
