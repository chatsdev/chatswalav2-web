"use client";

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/src/elements/ui/dialog";
import { ExternalLink, Info } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/elements/ui/button";
import { INFOMODALDATE } from "@/src/data/common";
import { InfoModalProps } from "@/src/types/common";



const InfoModal = ({ dataKey, className, iconSize = 20 }: InfoModalProps) => {
  const data = INFOMODALDATE[dataKey];

  if (!data) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={cn("text-gray-400 hover:text-primary bg-[unset]! p-0! h-[unset]! transition-colors cursor-pointer outline-none", className)}
          aria-label={`View info for ${data.title}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Info size={iconSize} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! p-0! overflow-hidden border-none bg-white dark:bg-(--card-color)">
        <div className="bg-primary/5 sm:p-6 p-4 border-b border-primary/10">
          <DialogHeader className="space-y-1 ">
            <div className="flex items-center gap-2 text-primary ">
              <Info size={24} className="shrink-0" />
              <DialogTitle className="text-left rtl:text-right text-xl font-bold tracking-tight">{data.title}</DialogTitle>
            </div>
            <DialogDescription className="text-gray-500 text-left rtl:text-right dark:text-gray-400 text-sm leading-relaxed">{data.description}</DialogDescription>
          </DialogHeader>
        </div>

        <div className="sm:p-6 p-4 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {data.content.map((item, index) => (
            <div key={index} className="group p-4 rounded-xl bg-gray-50 dark:bg-(--page-body-bg) border border-gray-100 dark:border-(--card-border-color) hover:border-primary/20 hover:bg-white dark:hover:bg-(--card-color) transition-all duration-200">
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                {item.label}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{item.value}</p>

              {item.subContent && (
                <div className="mt-4 space-y-3">
                  {item.subContent.map((sub, subIndex) => (
                    <div key={subIndex} className="p-4 rounded-xl bg-primary/5 dark:bg-(--page-body-bg)/40 border border-primary/10 dark:border-primary/5 hover:border-primary/30 transition-all duration-200">
                      <h4 className="text-[13px] font-bold text-primary mb-1.5 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:scale-125 transition-transform" />
                        {sub.label}
                      </h4>
                      <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{sub.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {data.externalLink && (
            <div className="sm:p-5 p-4 rounded-lg bg-primary/5 border border-primary/20 mt-2">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                    <ExternalLink size={16} />
                    {data.externalLink.label}
                  </h4>
                </div>
                <Button size="sm" variant="outline" className="shrink-0 h-8 text-[10px] font-bold border-primary/30 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer" onClick={() => window.open(data.externalLink?.url, "_blank")}>
                  Visit Link
                </Button>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{data.externalLink.description}</p>
            </div>
          )}
        </div>

        <div className="sm:px-6 px-4 py-4 bg-gray-50/50 dark:bg-(--page-body-bg)/50 border-t border-gray-100 dark:border-(--card-border-color) flex justify-end">
          <DialogClose asChild>
            <Button className="px-6 h-10 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm cursor-pointer border-none">Got it</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfoModal;
