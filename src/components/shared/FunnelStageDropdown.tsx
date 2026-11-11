"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { cn } from "@/src/lib/utils";
import { FunnelStageDropdownProps } from "@/src/types/shared";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Loader2,
  Search,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

const FunnelStageDropdown: React.FC<FunnelStageDropdownProps> = ({
  funnels,
  selectedActions,
  onChange,
  placeholder = "Select stages...",
  disabled = false,
  isLoading = false,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedFunnels, setExpandedFunnels] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredFunnels = useMemo(() => {
    if (!search) return funnels;
    const s = search.toLowerCase();
    return funnels
      .map((f) => ({
        ...f,
        stages: f.stages.filter((stage) =>
          stage.name.toLowerCase().includes(s),
        ),
      }))
      .filter((f) => f.name.toLowerCase().includes(s) || f.stages.length > 0);
  }, [funnels, search]);

  useEffect(() => {
    if (search.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpandedFunnels(filteredFunnels.map((f) => f._id));
    }
  }, [search, filteredFunnels]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleGroup = (funnelId: string) => {
    setExpandedFunnels((prev) =>
      prev.includes(funnelId)
        ? prev.filter((id) => id !== funnelId)
        : [...prev, funnelId],
    );
  };

  const handleSelect = (funnelId: string, stageId: string) => {
    const existingIndex = selectedActions.findIndex(
      (a) => a.funnelId === funnelId,
    );
    const newActions = [...selectedActions];

    if (existingIndex > -1) {
      if (newActions[existingIndex].toStageId === stageId) {
        // Deselect if clicking the same stage
        newActions.splice(existingIndex, 1);
      } else {
        // Replace stage for the same funnel
        newActions[existingIndex] = { funnelId, toStageId: stageId };
      }
    } else {
      // Add new action
      newActions.push({ funnelId, toStageId: stageId });
    }

    onChange(newActions);
  };

  const getStageName = (funnelId: string, stageId: string) => {
    const funnel = funnels.find((f) => f._id === funnelId);
    const stage = funnel?.stages.find((s) => s._id === stageId);
    return stage ? `${funnel?.name}: ${stage.name}` : "";
  };

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <div
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          "min-h-10.5 w-full flex flex-wrap items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-all cursor-pointer",
          "bg-(--input-color) dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color)",
          "hover:border-primary/50 focus:outline-none",
          open && "border-primary ring-2 ring-primary/10",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        {selectedActions.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {selectedActions.map((action) => (
              <Badge
                key={`${action.funnelId}-${action.toStageId}`}
                variant="secondary"
                className="flex items-center gap-1 bg-primary/10 text-primary border-none h-7"
              >
                {getStageName(action.funnelId, action.toStageId)}
                <X
                  size={12}
                  className="cursor-pointer hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(selectedActions.filter((a) => a !== action));
                  }}
                />
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-slate-400">{placeholder}</span>
        )}
        <div className="ml-auto shrink-0 flex items-center gap-2">
          {isLoading && (
            <Loader2 size={14} className="animate-spin text-slate-400" />
          )}
          <ChevronDown
            size={16}
            className={cn(
              "text-slate-400 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </div>
      </div>

      {open && (
        <div className="absolute z-50 top-full mt-1.5 w-full min-w-64 bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-100 dark:border-(--card-border-color)">
            <Search size={14} className="text-slate-400 shrink-0" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search funnels or stages..."
              className="flex-1 bg-transparent outline-none text-sm text-slate-700 dark:text-white placeholder:text-slate-400"
              autoFocus
            />
          </div>

          <div className="max-h-72 overflow-y-auto custom-scrollbar py-1">
            {isLoading ? (
              <div className="py-8 flex flex-col items-center gap-2 text-slate-400">
                <Loader2 size={20} className="animate-spin text-primary" />
                <span className="text-xs">Loading data...</span>
              </div>
            ) : filteredFunnels.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">
                No funnels found
              </div>
            ) : (
              filteredFunnels.map((funnel) => {
                const isExpanded = expandedFunnels.includes(funnel._id);
                const funnelSelected = selectedActions.some(
                  (a) => a.funnelId === funnel._id,
                );

                return (
                  <div key={funnel._id}>
                    <Button
                      type="button"
                      onClick={() => toggleGroup(funnel._id)}
                      className={cn(
                        "w-full bg-[unset]! flex items-center justify-between px-3 py-2 text-sm font-semibold transition-colors",
                        "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                        funnelSelected
                          ? "text-primary"
                          : "text-slate-600 dark:text-slate-300",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span>{funnel.name}</span>
                        {funnelSelected && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      {isExpanded ? (
                        <ChevronDown size={14} className="text-slate-400" />
                      ) : (
                        <ChevronRight size={14} className="text-slate-400" />
                      )}
                    </Button>

                    {isExpanded && (
                      <div className="pb-1">
                        {funnel.stages.length === 0 ? (
                          <p className="px-6 py-1.5 text-xs text-slate-400 italic">
                            No stages
                          </p>
                        ) : (
                          funnel.stages.map((stage) => {
                            const active = selectedActions.some(
                              (a) =>
                                a.funnelId === funnel._id &&
                                a.toStageId === stage._id,
                            );
                            return (
                              <Button
                                key={stage._id}
                                type="button"
                                onClick={() =>
                                  handleSelect(funnel._id, stage._id!)
                                }
                                className={cn(
                                  "w-full flex items-center justify-between gap-2 px-5 py-2 text-sm text-left transition-colors",
                                  active
                                    ? "bg-primary/5! text-primary font-semibold"
                                    : "text-slate-600 dark:text-slate-300 bg-[unset]! hover:bg-slate-50 dark:hover:bg-slate-800/40",
                                )}
                              >
                                <div className="flex items-center gap-2 overflow-hidden">
                                  {active && (
                                    <Check
                                      size={13}
                                      className="text-primary shrink-0"
                                    />
                                  )}
                                  <span
                                    className={cn(
                                      "truncate",
                                      !active && "ml-5",
                                    )}
                                  >
                                    {stage.name}
                                  </span>
                                </div>
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: stage.color }}
                                />
                              </Button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FunnelStageDropdown;
