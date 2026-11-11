"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/elements/ui/card";
import { ModelSelectionProps } from "@/src/types/components";
import { CheckCircle2, Sparkles } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

const ModelSelection: React.FC<ModelSelectionProps> = ({ models, selectedModel, onSelect }) => {
  const { t } = useTranslation();

  return (
    <Card className="dark:border-(--card-border-color) border shadow-sm bg-white dark:bg-(--card-color) overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="p-3 rounded-lg bg-primary text-white shadow-lg shadow-primary/20">
          <Sparkles size={24} />
        </div>
        <div className="flex-1">
          <CardTitle className="text-xl">{t("ai_model")}</CardTitle>
          <CardDescription>{t("choose_assistant")}</CardDescription>
        </div>
      </CardHeader>
      

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-0! max-h-113 overflow-auto custom-scrollbar">
        {models.map((model) => (
          <div
            key={model._id}
            onClick={() => onSelect(model._id)}
            className={`relative p-3 sm:p-4 rounded-lg border transition-all cursor-pointer group flex items-center gap-3 sm:gap-4 [@media(max-width:400px)]:flex-col [@media(max-width:400px)]:items-start
              ${selectedModel === model._id ? "border-primary bg-light-primary/30 dark:bg-(--table-hover) shadow-md shadow-primary/10" : "border-slate-100 dark:border-(--card-border-color) hover:border-(--hover-card-color) dark:hover:border-(--card-border-color) hover:bg-slate-50/50 dark:hover:bg-(--table-hover)"}`}
          >
            <div
              className={`p-2.5 rounded-lg shrink-0 w-9 h-9 flex items-center justify-center transition-colors
              ${selectedModel === model._id ? "bg-primary text-white" : "bg-slate-100 dark:bg-(--dark-sidebar) text-slate-500 group-hover:bg-(--light-primary) group-hover:text-primary dark:group-hover:bg-primary/20"}
            `}
            >
              {model.icon ? <Image src={model.icon} alt={model.display_name} width={24} height={24} className="object-contain w-6 h-6" /> : <Sparkles size={20} />}
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="font-bold text-slate-900 dark:text-white truncate">{model.display_name}</span>
                {selectedModel === model._id && <CheckCircle2 size={16} className="text-primary fill-primary-500/10 shrink-0" />}
              </div>
              <p className="text-sm text-slate-500 dark:text-gray-500 truncate break-all whitespace-normal">{model.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ModelSelection;
