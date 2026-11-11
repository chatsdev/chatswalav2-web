/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FIELD_TYPES } from "@/src/data/formBuilder";
import { Button } from "@/src/elements/ui/button";
import { FieldListSidebarProps } from "@/src/types/formBuilder";
import {
  Component
} from "lucide-react";

const FieldListSidebar: React.FC<FieldListSidebarProps> = ({ onAddField }) => {
  return (
    <div className="w-full bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-lg overflow-hidden flex flex-col shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--card-color)">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Component size={16} className="text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Components
          </h3>
          <p className="text-[10px] text-slate-500 font-medium tracking-tight">
            Click to add fields to your form
          </p>
        </div>
      </div>

      <div className="flex flex-row gap-8 p-4 overflow-x-auto table-custom-scrollbar whitespace-nowrap">
        {FIELD_TYPES.map((group, index) => (
          <div
            key={group.group}
            className={`flex flex-col gap-2.5 shrink-0 ${index == 0 ? "" : "border-l pl-8 border-slate-200 dark:border-(--card-border-color)"}`}
          >
            <div className="flex flex-row gap-2">
              {group.items.map((item) => (
                <Button
                  key={item.type}
                  onClick={() =>
                    onAddField({
                      type: item.type,
                      label: item.defaultLabel,
                      name: item.defaultLabel
                        .toLowerCase()
                        .replace(/\s+/g, "_"),
                      required: false,
                      options: (item as any).options || [],
                    })
                  }
                  className="flex-1 h-21.5 group flex flex-col items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-(--page-body-bg) border border-slate-200/60 dark:border-(--card-border-color) rounded-lg text-slate-600 dark:text-slate-400 hover:border-primary/40 hover:bg-[unset]! hover:text-primary hover:shadow-md hover:shadow-primary/5 transition-all duration-300 active:scale-[0.95] min-w-24"
                >
                  <span className="w-9 h-9 flex items-center justify-center bg-slate-50 dark:bg-(--dark-body) dark:border-(--card-border-color) rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0 border border-slate-100 shadow-sm">
                    {item.icon}
                  </span>
                  <span className="text-[11px] font-bold tracking-tight">
                    {item.label}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldListSidebar;
