import React from "react";
import { Oval } from "react-loader-spinner";

type SolidButtonProps = {
  children: React.ReactNode;
  onClick?: (e: any) => void;
  className?: string;
  disabled?: boolean;
  pending?: boolean;
};

const SolidButton = ({ children, onClick, className, disabled, pending }: SolidButtonProps) => {
  return (
    <button
      className={`primary-shadow relative cursor-pointer rounded-lg bg-primary py-2.5 text-center font-brand text-sm font-bold leading-[1.2] text-black transition enabled:hover:border-primary enabled:hover:bg-opacity-60 ${
        className ?? ""
      } disabled:cursor-not-allowed disabled:opacity-70`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {pending ? (
        <div className="absolute right-2 top-0 flex h-full items-center">
          <Oval
            width={21}
            height={21}
            color={"white"}
            secondaryColor="black"
            strokeWidth={3}
            strokeWidthSecondary={3}
          />
        </div>
      ) : (
        ""
      )}
    </button>
  );
};

export default SolidButton;
