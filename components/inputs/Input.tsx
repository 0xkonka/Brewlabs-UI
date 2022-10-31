import { ReactElement } from "react";

type InputProps = {
  name: string;
  value?: string;
  placeholder?: string;
  onBlurFn?: (inputValue: string) => void;
};

const Input = ({
  name,
  value,
  placeholder,
  onBlurFn,
}: InputProps): ReactElement => {
  // Fires on blur
  const onBlur = (inputValue: string) => {
    if (onBlurFn) {
      onBlurFn(inputValue);
    }
  };

  return (
    <input
      name={name}
      autoComplete="off"
      defaultValue={value}
      placeholder={placeholder}
      onBlur={(event) => onBlur(event.currentTarget.value)}
      className="block w-full rounded-md border border-gray-300 py-2 pl-24 pr-12 focus:border-amber-300 focus:ring-amber-300 dark:bg-zinc-800 sm:text-sm"
    />
  );
};

export default Input;
