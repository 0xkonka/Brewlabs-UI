import { ReactNode } from "react";

const Container = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={`relative max-w-7xl lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
  >
    {children}
  </div>
);

export default Container;
