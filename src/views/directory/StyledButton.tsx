import React, { ReactElement } from "react";

const StyledButton = ({
  onClick,
  disabled,
  children,
}: {
  onClick?: any;
  disabled?: boolean;
  children?: any;
}): ReactElement => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="portfolio-shadow flex h-full w-full items-center justify-center rounded bg-primary text-sm font-semibold text-black transition hover:bg-dark hover:text-brand disabled:cursor-[not-allowed] disabled:bg-transparent disabled:text-white"
  >
    {children}
  </button>
);

export default StyledButton;
