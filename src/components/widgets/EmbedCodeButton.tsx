import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/elements/ui/dialog";
import { cn } from "@/src/lib/utils";
import { EmbedCodeButtonProps } from "@/src/types/widget";
import { Check, Code2, Copy } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const EmbedCodeButton: React.FC<EmbedCodeButtonProps> = ({
  code,
  iconOnly = false,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Script copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative", className)}>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-10 gap-2 border-primary/30 text-primary hover:bg-primary/5 font-semibold",
              iconOnly && "w-10 p-0",
            )}
            title={iconOnly ? "Show Embed Code" : undefined}
          >
            <Code2 size={16} />
            {!iconOnly && "Embed Code"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-120 p-0! overflow-hidden outline-none border-none dark:bg-(--card-color)">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-(--card-border-color)">
            <DialogHeader className="text-left gap-1">
              <DialogTitle className="font-bold text-[15px] text-slate-800 dark:text-white">
                Widget Embed Script
              </DialogTitle>
              <p className="text-xs text-slate-400">
                Paste before the closing &lt;/body&gt; tag
              </p>
            </DialogHeader>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="gap-1.5 text-primary hover:text-primary/80"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <div className="p-4 text-left">
            <pre className="bg-slate-900 text-primary text-xs p-4 rounded-lg overflow-x-auto font-mono leading-relaxed whitespace-pre-wrap break-all border border-slate-800">
              {code}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmbedCodeButton;
