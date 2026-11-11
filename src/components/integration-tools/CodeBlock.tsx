"use client";

import { Button } from "@/src/elements/ui/button";
import { CodeBlockProps } from "@/src/types/integrationTools";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "json",
  showCopy = true,
}) => {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body) shadow-inner">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 rounded-t-lg dark:border-(--card-border-color) bg-white/50 dark:bg-black/20 backdrop-blur-sm">
        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-gray-500 tracking-widest">
          {language}
        </span>
        {showCopy && (
          <Button
            onClick={handleCopy}
            className="p-1.5 bg-[unset]! h-6.75 rounded-md hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 dark:text-gray-500 transition-all flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check size={14} className="text-Primary" />
                <span className="text-[10px] font-bold text-primary uppercase">
                  {t("copied")}
                </span>
              </>
            ) : (
              <>
                <Copy
                  size={14}
                  className="group-hover:text-primary transition-colors"
                />
                <span className="text-[10px] font-bold uppercase group-hover:text-primary transition-colors">
                  {t("copy")}
                </span>
              </>
            )}
          </Button>
        )}
      </div>
      <pre className="p-4 text-xs font-mono text-slate-700 dark:text-primary/70 overflow-x-auto leading-relaxed custom-scrollbar">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
