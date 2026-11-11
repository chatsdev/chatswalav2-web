"use client";

import * as React from "react";
import { cn } from "@/src/utils";
import { Button } from "@/src/elements/ui/button";


const Tabs = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("space-y-4", className)}>{children}</div>
);

const TabsList = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div
    className={cn(
      "inline-flex h-12 items-center justify-center rounded-lg bg-slate-100/50 p-1 text-slate-500 dark:bg-(--card-color) dark:text-gray-500",
      className
    )}
  >
    {children}
  </div>
);

const TabsTrigger = ({
  children,
  active,
  onClick,
  className,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  className?: string;
}) => (
  <Button variant="unstyled"
    type="button"
    onClick={onClick}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-semibold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
      active
        ? "bg-primary text-white shadow-xs"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-gray-400 dark:hover:bg-(--table-hover) dark:hover:text-slate-200",
      className
    )}
  >
    {children}
  </Button>
);

const TabsContent = ({
  children,
  active,
  className,
}: {
  children: React.ReactNode;
  active: boolean;
  className?: string;
}) => {
  if (!active) return null;
  return (
    <div
      className={cn(
        "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
        className
      )}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
