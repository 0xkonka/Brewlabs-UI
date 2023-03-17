import React from "react";

type SolidButtonProps = {
  children: React.ReactNode;
  onClick?: (e: any) => void;
  className?: string;
};

const SolidButton = ({ children, onClick, className }: SolidButtonProps) => {
  return (
    <button
      className={`cursor-pointer rounded-3xl bg-primary py-3 text-center font-['Roboto'] text-sm font-bold text-black transition hover:border-primary hover:bg-opacity-60 ${
        className ?? ""
      } `}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default SolidButton;
