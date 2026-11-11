"use client";

import { Check } from "lucide-react";
import * as React from "react";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/src/elements/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/elements/ui/popover";
import { cn } from "@/src/lib/utils";

export type Option = {
  label: string;
  value: string;
  color?: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  maxCount?: number;
}

export function MultiSelect({ options, selected, onChange, placeholder = "Select items...", className, maxCount = 10 }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const optionMap = React.useMemo(() => {
    const map = new Map<string, Option>();
    options.forEach((o) => map.set(o.value, o));
    return map;
  }, [options]);

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  const visibleSelected = selected.slice(0, maxCount);
  const hiddenCount = selected.length - maxCount;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-auto min-h-11 px-3 py-2 hover:bg-transparent items-start whitespace-normal",
            className
          )}
        >
          <div className="flex flex-wrap gap-1.5 custom-scrollbar w-full items-center">
            {selected.length === 0 && <span className="text-muted-foreground font-normal">{placeholder}</span>}
            {visibleSelected.map((item) => {
              const option = optionMap.get(item);
              return (
                <Badge
                  variant="secondary"
                  key={item}
                  className="break-all whitespace-normal max-w-full dark:bg-(--card-color) py-1 px-2.5 h-auto"
                  style={{ backgroundColor: option?.color ? `${option.color}20` : undefined, color: option?.color }}
                >
                  <span className="flex-1 break-all whitespace-normal line-clamp-2 text-xs">{option?.label || item}</span>
                  <div
                    className="ml-1.5 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer shrink-0"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(item);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(item)}
                  >
                    <span className="sr-only">Remove {option?.label || item}</span>✕
                  </div>
                </Badge>
              );
            })}
            {hiddenCount > 0 && (
              <Badge
                variant="outline"
                className="py-1 px-2.5 h-auto text-xs font-semibold bg-primary/10 text-primary border-primary/20"
              >
                + {hiddenCount} more
              </Badge>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0 " align="start">
        <Command className="w-full">
          <CommandInput placeholder="Search..." />
          <CommandList className="max-h-64 overflow-y-auto custom-scrollbar">
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup className="p-0 overflow-visible">
              {options.length > 0 && (
                <>
                  <CommandItem
                    className="flex items-center gap-2 cursor-pointer px-2 py-1.5 font-semibold text-primary"
                    onSelect={() => {
                      if (selected.length === options.length) {
                        onChange([]);
                      } else {
                        onChange(options.map((option) => option.value));
                      }
                    }}
                  >
                    <div className={cn("flex h-4 w-4 items-center justify-center rounded-sm border border-primary", selected.length === options.length ? "bg-primary text-primary-foreground" : "opacity-50")}>
                      {selected.length === options.length && <Check className="h-3 w-3" />}
                    </div>
                    {selected.length === options.length ? "Unselect All" : "Select All"}
                  </CommandItem>
                  <div className="h-px bg-slate-100 dark:bg-(--card-color) my-1" />
                </>
              )}
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer px-2 py-1.5"
                  onSelect={() => {
                    onChange(selected.includes(option.value) ? selected.filter((item) => item !== option.value) : [...selected, option.value]);
                  }}
                >
                  <Check className={cn("h-4 w-4 shrink-0", selected.includes(option.value) ? "opacity-100" : "opacity-0")} />
                  {option.color && <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: option.color }} />}
                  <span className="truncate flex-1">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
