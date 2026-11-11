"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { SecretInputProps } from "@/src/types/shopify";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/src/elements/ui/button";


export const SecretInput: React.FC<SecretInputProps> = ({
  id,
  label,
  value,
  placeholder,
  onChange,
  disabled,
}) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="text-sm font-semibold text-gray-700 dark:text-gray-400 flex items-center gap-1.5"
      >
        <KeyRound size={14} className="text-primary" />
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={revealed ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-10 h-11 border-(--input-border-color) bg-(--input-color) dark:border-(--card-border-color) focus-visible:ring-primary focus-visible:border-primary font-mono text-sm"
        />
        <Button variant="unstyled"
          type="button"
          tabIndex={-1}
          onClick={() => setRevealed((r) => !r)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
          disabled={disabled}
        >
          {revealed ? <EyeOff size={15} /> : <Eye size={15} />}
        </Button>
      </div>
    </div>
  );
};
