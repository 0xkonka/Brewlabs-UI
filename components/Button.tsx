import React, { ReactElement } from "react";

const Button = ({
  children,
  onClick,
  externalLink,
}: {
  onClick?: any;
  externalLink?: string;
  children: React.ReactNode;
}): ReactElement => (
  <>
    {externalLink !== undefined ? (
      <a
        href={externalLink}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center rounded-md bg-dark px-4 py-2 text-base font-bold tracking-wider text-brand shadow-sm transition hover:bg-brand hover:text-dark"
      >
        {children}
      </a>
    ) : (
      <button
        type="button"
        onClick={onClick}
        className="flex items-center justify-center rounded-md bg-dark px-4 py-2 text-base font-bold tracking-wider text-brand shadow-sm transition hover:bg-brand hover:text-dark"
      >
        {children}
      </button>
    )}
  </>
);

export default Button;
