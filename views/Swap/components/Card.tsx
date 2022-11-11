import { ReactNode } from "react";

const Card = ({ children }: { children: ReactNode }) => (
  <div className="rounded-lg border-slate-100 bg-slate-300 bg-opacity-60 px-4 py-1.5 font-brand dark:border-slate-600 dark:bg-zinc-900 dark:bg-opacity-60">
    {children}
  </div>
);

export default Card;
