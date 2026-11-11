import { KeywordHintsProps } from "@/src/types/botFlow";
import { Info } from "lucide-react";
import React from "react";
import { Button } from "@/src/elements/ui/button";


export const KeywordHints: React.FC<KeywordHintsProps> = ({
  triggerKeywords,
  onKeywordClick,
}) => {
  return (
    <div className="bg-slate-50 dark:bg-(--page-body-bg) p-4 rounded-lg border border-slate-100 dark:border-(--card-border-color)">
      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
        <Info size={14} className="text-primary" />
        Trigger Keywords Defined
      </h4>
      {triggerKeywords.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {triggerKeywords.map((kw) => (
            <Button variant="unstyled"
              key={kw}
              onClick={() => onKeywordClick(kw)}
              className="text-[10px] font-bold px-2 py-1 bg-white hover:bg-slate-100 dark:bg-(--page-body-bg) dark:hover:bg-(--table-hover) border border-slate-200 dark:border-(--card-border-color) rounded-md text-primary transition-colors cursor-pointer"
            >
              {kw}
            </Button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">
          No explicit keywords found. Use any greeting message to trigger "Any
          Message" rules.
        </p>
      )}
    </div>
  );
};
