import React, { ReactElement } from "react";

const PrimaryOutlinedButton = ({
  children,
  onClick,
  externalLink,
  disabled,
}: {
  onClick?: any;
  externalLink?: string;
  disabled?: boolean;
  children: React.ReactNode;
}): ReactElement => (
  <>
    {externalLink !== undefined ? (
      <a
        href={externalLink}
        target="_blank"
        rel="noreferrer"
        className={`${
          disabled
            ? "cursor-not-allowed border-gray-700 text-gray-700"
            : "border-primary text-primary hover:bg-primary hover:text-dark"
        } flex items-center justify-center rounded-lg border bg-transparent px-8 py-1 text-lg tracking-wider shadow-sm outline-none transition`}
      >
        {children}
      </a>
    ) : (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`${
          disabled
            ? "cursor-not-allowed border-gray-700 text-gray-700"
            : "border-primary text-primary hover:bg-primary hover:text-dark"
        } flex items-center justify-center rounded-lg border bg-transparent px-8 py-1 text-lg tracking-wider shadow-sm outline-none transition`}
      >
        {children}
      </button>
    )}
  </>
);

export default PrimaryOutlinedButton;
