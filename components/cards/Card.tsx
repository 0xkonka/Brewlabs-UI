import { ReactNode } from "react";

const Card = ({ children }: { children: ReactNode }) => (
  <div className="w-full p-2 rounded-md bg-slate-100 dark:bg-neutral-800">
    {children}
  </div>
);

export default Card;
