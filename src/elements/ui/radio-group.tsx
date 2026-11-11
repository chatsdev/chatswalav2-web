"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";
import { Circle } from "lucide-react";
import { Button } from "@/src/elements/ui/button";


const RadioGroupContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}>({});

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
  }
>(({ className, value, onValueChange, disabled, ...props }, ref) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, disabled }}>
      <div ref={ref} role="radiogroup" className={cn("grid gap-2", className)} {...props} />
    </RadioGroupContext.Provider>
  );
});
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }>(({ className, value, ...props }, ref) => {
  const context = React.useContext(RadioGroupContext);
  const isChecked = context.value === value;

  return (
    <Button variant="unstyled" type="button" role="radio" aria-checked={isChecked} data-state={isChecked ? "checked" : "unchecked"} disabled={context.disabled || props.disabled} ref={ref} className={cn("aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors", isChecked && "bg-primary text-white", className)} onClick={() => context.onValueChange?.(value)} {...props}>
      {isChecked && (
        <div className="flex items-center justify-center w-full h-full">
          <Circle className="h-2 w-2 fill-current text-current" />
        </div>
      )}
    </Button>
  );
});
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
