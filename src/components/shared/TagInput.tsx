"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Input } from "@/src/elements/ui/input";
import { TagInputProps } from "@/src/types/shared";
import { X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/src/elements/ui/button";


const TagInput = ({
  value = [],
  onChange,
  placeholder = "Press Enter to add tags...",
  disabled,
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !value.includes(trimmedValue)) {
      onChange([...value, trimmedValue]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <div
        className={`flex flex-wrap gap-2 p-2 min-h-11 border rounded-lg bg-white/50 dark:bg-(--card-color) ${disabled ? "opacity-50 cursor-not-allowed" : "border-slate-200 dark:border-(--card-border-color) focus-within:border-primary"}`}
      >
        {value.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1 py-1 px-2 bg-slate-100 dark:bg-(--page-body-bg) text-slate-700 dark:text-gray-300 border-slate-200 dark:border-(--card-border-color) rounded-md transition-all"
          >
            {tag}
            {!disabled && (
              <Button variant="unstyled"
                type="button"
                onClick={() => removeTag(index)}
                className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X size={12} />
              </Button>
            )}
          </Badge>
        ))}
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          disabled={disabled}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-32 h-7 p-0 border-none bg-transparent dark:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none placeholder:text-slate-400"
        />
      </div>
      <p className="text-[10px] text-slate-400 font-medium px-1">
        Press Enter to add. Click &times; to remove.
      </p>
    </div>
  );
};

export default TagInput;
