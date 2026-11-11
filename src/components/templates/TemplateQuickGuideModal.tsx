"use client";

import { GuideTopic, TEMPLATEGUIDEDATA } from "@/src/data/TemplateGuideData";
import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/src/elements/ui/dialog";
import { useAppSelector } from "@/src/redux/hooks";
import { ArrowLeft, BookOpen, ChevronRight, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const TemplateQuickGuideModal = () => {
  const { t } = useTranslation();
  const setting = useAppSelector((state) => state.setting);
  const [selectedTopic, setSelectedTopic] = useState<GuideTopic | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => setSelectedTopic(null), 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full mt-auto p-4 h-17 bg-[unset]! border-t border-slate-100 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all duration-200 group text-left cursor-pointer outline-none">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
              <BookOpen size={16} />
            </div>
            <div className="min-w-0 text-left rtl:text-right">
              <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">Help Guide</p>
              <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-tight">Learn how to create & format templates</p>
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! p-0! overflow-auto border-none max-h-[90vh] no-scrollbar bg-white dark:bg-(--card-color) flex! flex-col! gap-0! left-1/2! -translate-x-1/2!">
        <div className="bg-primary/5 dark:bg-(--card-color) sm:p-6 p-4 border-b border-primary/10 shrink-0">
          <div className="flex items-center">
            <div className="flex items-center gap-3 text-primary min-w-0 w-full">
              {selectedTopic ? (
                <Button onClick={() => setSelectedTopic(null)} className="w-9 h-9 rounded-full bg-white dark:bg-primary/20 flex items-center text-primary justify-center hover:bg-primary hover:text-white transition-all shadow-sm cursor-pointer group shrink-0">
                  <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                </Button>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-white dark:bg-primary/20 flex items-center justify-center shadow-sm shrink-0">
                  <HelpCircle size={24} />
                </div>
              )}
              <div className="space-y-0.5 min-w-0 flex-1">
                <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight block truncate sm:whitespace-normal">{selectedTopic ? selectedTopic.title : "Quick Guide"}</DialogTitle>
                <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 font-medium block truncate sm:whitespace-normal">{selectedTopic ? "Educational Resource" : "Master the art of WhatsApp template messages"}</DialogDescription>
              </div>
            </div>
          </div>
        </div>

        <div className="sm:p-6 p-4 max-h-[65vh] overflow-y-auto custom-scrollbar flex-1">
          {!selectedTopic ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-200">
              {TEMPLATEGUIDEDATA.map((topic) => (
                <Button key={topic.id} onClick={() => setSelectedTopic(topic)} className="flex flex-col items-start h-[200px] sm:p-5 p-4 rounded-lg bg-gray-50 dark:bg-(--page-body-bg) border border-gray-100 dark:border-(--card-border-color) hover:border-primary/30 hover:bg-white dark:hover:bg-(--card-color) group transition-all duration-300 text-left shadow-xs hover:shadow-md cursor-pointer relative overflow-hidden">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-(--dark-body) flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all">{topic.icon}</div>
                  <h4 className="text-sm text-left rtl:text-right font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight break-all whitespace-normal">{topic.title}</h4>
                  <p className="text-xs text-left rtl:text-right font-medium text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 break-all whitespace-normal">{topic.shortDesc}</p>
                  <ChevronRight size={16} className="absolute bottom-5 rtl:right-[unset] rtl:left-5 right-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pb-2">
              {selectedTopic.content.map((block, idx) => (
                <div key={idx} className="space-y-3 p-4 rounded-lg bg-slate-50/50 dark:bg-(--dark-body)/30 border border-slate-100 dark:border-(--card-border-color)">
                  {block.subtitle && <h5 className="text-[13px] font-bold text-primary flex items-center gap-2">{block.subtitle}</h5>}
                  {block.text && <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{block.text}</p>}
                  {block.points && (
                    <ul className="space-y-2.5">
                      {block.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5 text-sm text-gray-500 dark:text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                  {block.example && (
                    <div className="p-3 bg-primary/5 border border-l-4 rtl:border-r-4 rtl:border-l-0 border-primary rounded text-xs font-mono text-primary leading-relaxed">
                      <p className="font-bold mb-1 uppercase tracking-tighter opacity-70">Example:</p>
                      {block.example}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sm:px-6 px-4 py-4 bg-gray-50/50 dark:bg-(--page-body-bg)/50 border-t border-gray-100 dark:border-(--card-border-color) flex flex-col items-center gap-3 shrink-0">
          <p className="text-sm font-bold text-gray-400 text-center shrink-0">{setting.app_name || t("app_name")} Documentation</p>
          <div className="flex gap-2 w-full">
            {selectedTopic && (
              <Button variant="outline" size="sm" onClick={() => setSelectedTopic(null)} className="flex-1 h-11 px-4.5! py-5! text-xs font-bold border-gray-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary/10 transition-colors cursor-pointer">
                Back
              </Button>
            )}
            <Button size="sm" onClick={() => handleOpenChange(false)} className="flex-1 h-11 px-4.5! py-5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-all shadow-sm cursor-pointer border-none">
              Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateQuickGuideModal;
