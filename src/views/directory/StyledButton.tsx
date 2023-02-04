import React, { ReactElement } from "react";

const StyledButton = ({
  onClick,
  disabled,
  children,
  type,
}: {
  onClick?: any;
  disabled?: boolean;
  children?: any;
  type?: string;
}): ReactElement =>
  type === "secondary" ? (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="portfolio-shadow relative flex h-full w-full items-center justify-center rounded border border-[#FFFFFF80] bg-[#B9B8B81A] text-sm font-medium transition hover:border-transparent hover:bg-dark hover:text-brand disabled:cursor-[not-allowed] disabled:bg-transparent disabled:text-white"
    >
      {children}
    </button>
  ) : type === "teritary" ? (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="staking-button-shadow rlelative flex h-full w-full items-center justify-center rounded border border-[#EEBB19] bg-[#B9B8B81A] font-medium text-[#FFFFFFBF] transition enabled:hover:border-transparent enabled:hover:bg-dark enabled:hover:text-brand disabled:cursor-[not-allowed] disabled:opacity-70"
    >
      {children}
    </button>
  ) : (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="portfolio-shadow relative flex h-full w-full items-center justify-center rounded bg-primary text-sm font-semibold text-black transition enabled:hover:bg-dark enabled:hover:text-brand disabled:cursor-[not-allowed] disabled:opacity-70"
    >
      {children}
    </button>
  );

export default StyledButton;
