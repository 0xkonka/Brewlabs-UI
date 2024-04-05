import { ReactNode } from "react";
import { RadioGroupItem } from "@components/ui/radio-group";
import { FormControl, FormItem, FormLabel } from "@components/ui/form";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "lib/utils";

interface RadioButtonProps extends React.InputHTMLAttributes<HTMLLabelElement> {
  value: string;
  children: ReactNode;
  contentAlign?: "left" | "center" | "right";
}

const radioButtonVariants = cva(
  "!m-0 flex h-full w-full cursor-pointer flex-col gap-2 rounded-lg p-4 font-normal text-gray-500 ring-1 ring-gray-700 transition-colors duration-200 ease-in-out hover:bg-gray-800/40 hover:ring-yellow-300 peer-aria-checked:bg-gray-800/60 peer-aria-checked:text-yellow-200",
  {
    variants: {
      contentAlign: {
        left: "items-start",
        right: "items-end",
        center: "items-center",
      },
    },
    defaultVariants: {
      contentAlign: "center",
    },
  }
);

// To be used in the form inside a radio group
export const RadioButton = ({ className, contentAlign, value, children }: RadioButtonProps) => {
  return (
    <FormItem className="rounded-lg shadow">
      <FormControl>
        <RadioGroupItem value={value} className="peer sr-only" />
      </FormControl>
      <FormLabel className={cn(radioButtonVariants({ contentAlign, className }))}>{children}</FormLabel>
    </FormItem>
  );
};
