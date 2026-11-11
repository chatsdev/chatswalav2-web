import * as React from "react"

import { cn } from "@/src/lib/utils"

function Input({ className, type, onKeyDown, unstyled, ...props }: React.ComponentProps<"input"> & { unstyled?: boolean }) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "number") {
      const isControlKey = ["Backspace", "Delete", "Tab", "Escape", "Enter", "Home", "End", "ArrowLeft", "ArrowRight"].includes(e.key) || (e.ctrlKey === true && ["a", "c", "v", "x", "z"].includes(e.key.toLowerCase())) || (e.metaKey === true && ["a", "c", "v", "x", "z"].includes(e.key.toLowerCase()));

      if (!isControlKey && !/^\d$/.test(e.key)) {
        e.preventDefault();
      }
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  if (unstyled) {
    return (
      <input
        type={type}
        onKeyDown={handleKeyDown}
        data-slot="input"
        className={className}
        {...props}
      />
    );
  }

  return (
    <input
      type={type}
      onKeyDown={handleKeyDown}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-(--page-body-bg) dark:border-(--card-border-color) border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input }
