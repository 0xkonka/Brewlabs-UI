import * as React from "react";

import { cn } from "lib/utils";

import { PlusCircle, MinusCircle } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  symbol?: string;
}

const IncrementorInput = React.forwardRef<HTMLInputElement, InputProps>(({ symbol, className, ...props }, ref) => {
  const incrementInput = React.useRef<HTMLInputElement>(null);

  React.useImperativeHandle(ref, () => incrementInput.current!, []);

  const increment = () => {
    incrementInput.current?.stepUp();
  };

  const decrement = () => {
    incrementInput.current?.stepDown();
  };

  return (
    <div className="flex items-center rounded-lg border p-1.5">
      <button type="button" className="group text-gray-500" aria-label="increase" onClick={increment}>
        <PlusCircle className="h-4 w-4 group-hover:text-gray-100" />
      </button>

      <div className="relative">
        <input
          type="number"
          className={cn("no-steps w-fit border-0 bg-transparent p-0 pr-4 text-center", className)}
          ref={incrementInput}
          {...props}
        />
        {symbol && <span className="absolute right-4 top-0">{symbol}</span>}
      </div>

      <button type="button" className="group text-gray-500" aria-label="decrease" onClick={decrement}>
        <MinusCircle className="h-4 w-4 group-hover:text-gray-100" />
      </button>
    </div>
  );
});
IncrementorInput.displayName = "IncrementorInput";

export { IncrementorInput };
