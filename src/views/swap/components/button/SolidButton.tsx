import React from "react";

type SolidButtonProps = {
  children: React.ReactNode;
  onClick?: (e: any) => void;
  disabled: boolean;
  className?: string;
};

const SolidButton = ({ children, onClick, disabled, className }: SolidButtonProps) => {
  return (
    <button
      className={`${
        disabled
          ? "cursor-not-allowed btn btn-outline"
          : "cursor-pointer bg-primary text-black hover:border-primary hover:bg-opacity-60"
      } rounded-3xl  py-3 text-center font-['Roboto'] text-sm font-bold transition ${className ?? ""} `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default SolidButton;
