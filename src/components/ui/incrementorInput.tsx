import * as React from "react";
import { PlusCircle, MinusCircle } from "lucide-react";
import { cn } from "lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  symbol?: string;
}

const IncrementorInput = React.forwardRef<HTMLInputElement, InputProps>(({ symbol, className, ...props }, ref) => {
  const [hitMax, setHitMax] = React.useState(false);
  const [hitMin, setHitMin] = React.useState(false);
  const incrementInput = React.useRef<HTMLInputElement>(null);

  React.useImperativeHandle(ref, () => incrementInput.current!, []);

  const increment = () => {
    incrementInput.current?.stepUp();
    incrementInput.current?.dispatchEvent(new Event("change", { bubbles: true }));

    setHitMax(incrementInput.current?.value === incrementInput.current?.max);
    setHitMin(incrementInput.current?.value === incrementInput.current?.min);
  };

  const decrement = () => {
    incrementInput.current?.stepDown();
    incrementInput.current?.dispatchEvent(new Event("change", { bubbles: true }));

    setHitMax(incrementInput.current?.value === incrementInput.current?.max);
    setHitMin(incrementInput.current?.value === incrementInput.current?.min);
  };

  return (
    <div className="flex w-fit items-center rounded-lg border p-1.5">
      <button
        type="button"
        className="group text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="increase"
        disabled={hitMax}
        onClick={increment}
      >
        <PlusCircle className="h-4 w-4 group-hover:text-gray-100" />
      </button>

      <div className="relative">
        <input
          type="number"
          className={cn(
            "no-steps w-auto rounded border-0 bg-transparent p-0 pr-4 text-center focus:ring-white",
            className
          )}
          ref={incrementInput}
          {...props}
        />
        {symbol && <span className="absolute right-2 top-0 w-fit">{symbol}</span>}
      </div>

      <button
        type="button"
        className="group text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="decrease"
        disabled={hitMin}
        onClick={decrement}
      >
        <MinusCircle className="h-4 w-4 group-hover:text-gray-100" />
      </button>
    </div>
  );
});
IncrementorInput.displayName = "IncrementorInput";

export { IncrementorInput };
