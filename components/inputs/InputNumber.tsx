import { ReactElement } from "react";

type InputProps = {
  name: string;
  value?: number;
  placeholder?: string;
  onBlurFn?: (inputValue: number) => void;
};

const Input = ({ name, value, placeholder, onBlurFn }: InputProps): ReactElement => {
  // Fires on blur
  const onBlur = (inputValue: number) => {
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
      type="number"
      onBlur={(event) => onBlur(parseInt(event.currentTarget.value))}
      className="block w-full rounded-md border border-gray-300 py-2 pl-24 pr-12 text-black focus:border-amber-300 focus:ring-amber-300 dark:bg-zinc-800 dark:text-white sm:text-sm"
    />
  );
};

export default Input;
