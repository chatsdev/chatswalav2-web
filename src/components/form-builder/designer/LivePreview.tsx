/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import { cn } from "@/src/lib/utils";
import { useAppSelector } from "@/src/redux/hooks";
import { LivePreviewProps } from "@/src/types/formBuilder";
import {
  Camera,
  CheckCheck,
  ChevronLeft,
  Mic,
  MoreVertical,
  Paperclip,
  Smile,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const LivePreview: React.FC<LivePreviewProps> = ({
  allFields,
  submitSettings,
}) => {
  const { t } = useTranslation();
  const setting = useAppSelector((state) => state.setting);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentPreviewStep, setCurrentPreviewStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Filter out steps that don't have any fields
  const validSteps = useMemo(() => {
    const stepsWithFields = Array.from(
      new Set(allFields.map((f: any) => f.step || 1)),
    ).sort((a, b) => a - b);
    return stepsWithFields.length > 0 ? stepsWithFields : [1];
  }, [allFields]);

  const maxStep = validSteps.length;
  const currentActualStep = validSteps[currentPreviewStep - 1] || 1;
  const fieldsInStep = allFields.filter(
    (f: any) => (f.step || 1) === currentActualStep,
  );

  const renderField = (field: any) => {
    switch (field.type) {
      case "heading":
        return (
          <h3 className="text-lg font-bold text-slate-900 dark:text-gray-500 mb-4 truncate">
            {field.label}
          </h3>
        );
      case "text":
        return (
          <div className="space-y-1.5 mb-4">
            <Label className="text-[13px] font-semibold text-slate-700 min-w-0">
              <span className="truncate">{field.label}</span>
              {field.required && (
                <span className="text-red-500 ml-0.5 shrink-0">*</span>
              )}
            </Label>
            <div className="relative">
              <Input
                placeholder={field.helper_text || "Type here..."}
                className="h-11 rounded-lg border-slate-200 focus:ring-primary/20 dark:bg-(--dark-body) bg-slate-50/30"
                readOnly
              />
            </div>
          </div>
        );
      case "textarea":
        return (
          <div className="space-y-1.5 mb-4">
            <Label className="text-[13px] font-semibold text-slate-700 min-w-0">
              <span className="truncate">{field.label}</span>
              {field.required && (
                <span className="text-red-500 ml-0.5 shrink-0">*</span>
              )}
            </Label>
            <Textarea
              placeholder={field.helper_text || "Type message..."}
              className="w-full min-h-24 rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none bg-slate-50/30 dark:bg-(--dark-body)"
              readOnly
            />
          </div>
        );
      case "number":
        return (
          <div className="space-y-1.5 mb-4">
            <Label className="text-[13px] font-semibold text-slate-700 min-w-0">
              <span className="truncate">{field.label}</span>
              {field.required && (
                <span className="text-red-500 ml-0.5 shrink-0">*</span>
              )}
            </Label>
            <Input
              type="number"
              placeholder={field.helper_text || "0000"}
              className="h-11 rounded-lg border-slate-200 focus:ring-primary/20 dark:bg-(--dark-body) bg-slate-50/30"
              readOnly
            />
          </div>
        );
      case "email":
        return (
          <div className="space-y-1.5 mb-4">
            <Label className="text-[13px] font-semibold text-slate-700 min-w-0">
              <span className="truncate">{field.label}</span>
              {field.required && (
                <span className="text-red-500 ml-0.5 shrink-0">*</span>
              )}
            </Label>
            <Input
              type="email"
              placeholder={field.helper_text || "example@mail.com"}
              className="h-11 rounded-lg border-slate-200 focus:ring-primary/20 dark:bg-(--dark-body) bg-slate-50/30"
              readOnly
            />
          </div>
        );
      case "phone":
        return (
          <div className="space-y-1.5 mb-4">
            <Label className="text-[13px] font-semibold text-slate-700 min-w-0">
              <span className="truncate">{field.label}</span>
              {field.required && (
                <span className="text-red-500 ml-0.5 shrink-0">*</span>
              )}
            </Label>
            <Input
              type="tel"
              placeholder={field.helper_text || "+1 234 567 890"}
              className="h-11 rounded-lg border-slate-200 focus:ring-primary/20 dark:bg-(--dark-body) bg-slate-50/30"
              readOnly
            />
          </div>
        );
      case "select":
        const isOpen = openDropdownId === field.id;
        return (
          <div className="space-y-1.5 mb-4 relative">
            <Label className="text-[13px] font-semibold text-slate-700 min-w-0">
              <span className="truncate">{field.label}</span>
              {field.required && (
                <span className="text-red-500 ml-0.5 shrink-0">*</span>
              )}
            </Label>
            <div className="relative group">
              <div
                onClick={() => setOpenDropdownId(isOpen ? null : field.id)}
                className={cn(
                  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/30 dark:border-(--card-border-color) dark:bg-(--dark-body) px-4 flex items-center justify-between text-sm text-slate-600 cursor-pointer transition-all",
                  isOpen
                    ? "border-primary ring-2 ring-primary/10 bg-white"
                    : "hover:border-primary/40",
                )}
              >
                {field.options && field.options.length > 0
                  ? field.options[0].label
                  : field.helper_text || "Select an option"}
                <ChevronLeft
                  size={16}
                  className={cn(
                    "text-slate-400 transition-transform duration-300",
                    isOpen ? "rotate-90 text-primary" : "-rotate-90",
                  )}
                />
              </div>

              <AnimatePresence>
                {isOpen && field.options && field.options.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 5, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute left-0 right-0 top-full z-50 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden dark:bg-(--card-color) dark:border-(--card-border-color)"
                  >
                    {field.options.map((opt: any, index: number) => (
                      <div
                        key={index}
                        className="px-4 py-3 text-sm text-slate-600 hover:bg-primary/5 dark:border-(--card-border-color) hover:text-primary cursor-pointer transition-colors border-b last:border-none border-slate-50"
                        onClick={() => setOpenDropdownId(null)}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Indicators for more options when closed */}
              {!isOpen && field.options && field.options.length > 1 && (
                <div className="absolute right-10 top-1/2 -translate-y-1/2 flex gap-0.5">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1 h-1 rounded-full bg-slate-200"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case "radio":
        return (
          <div className="space-y-1.5 mb-4">
            <Label className="text-[13px] font-semibold text-slate-700 min-w-0">
              <span className="truncate">{field.label}</span>
              {field.required && (
                <span className="text-red-500 ml-0.5 shrink-0">*</span>
              )}
            </Label>
            <div className="space-y-2">
              {field.options?.map((opt: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 rounded-lg dark:bg-(--dark-body) dark:border-(--card-border-color) border border-(--input-border-color) bg-(--input-color)"
                >
                  <div className="w-4 h-4 rounded-full border border-slate-300" />
                  <span className="text-sm text-slate-600">{opt.label}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "checkbox":
        return (
          <div className="space-y-1.5 mb-4">
            <Label className="text-[13px] font-semibold text-slate-700 min-w-0">
              <span className="truncate">{field.label}</span>
              {field.required && (
                <span className="text-red-500 ml-0.5 shrink-0">*</span>
              )}
            </Label>
            <div className="space-y-2">
              {field.options?.map((opt: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg border border-(--input-border-color) dark:bg-(--dark-body) dark:border-(--card-border-color) bg-(--input-color)"
                >
                  <div className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center">
                    {/* Empty box for unchecked look */}
                  </div>
                  <span className="text-sm text-slate-600">{opt.label}</span>
                </div>
              ))}
              {(!field.options || field.options.length === 0) && (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-(--input-border-color) dark:bg-(--dark-body) dark:border-(--card-border-color) bg-(--input-color)">
                  <div className="w-4 h-4 rounded border border-slate-300 dark:border-(--card-border-color)" />
                  <span className="text-sm text-slate-600">{field.label}</span>
                </div>
              )}
            </div>
          </div>
        );
      case "date":
        return (
          <div className="space-y-1.5 mb-4">
            <Label className="text-[13px] font-semibold text-slate-700 min-w-0">
              <span className="truncate">{field.label}</span>
              {field.required && (
                <span className="text-red-500 ml-0.5 shrink-0">*</span>
              )}
            </Label>
            <Input
              type="date"
              className="h-11 rounded-lg border-slate-200 focus:ring-primary/20 dark:bg-(--dark-body) bg-slate-50/30"
              readOnly
            />
          </div>
        );
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentPreviewStep < maxStep) {
      setCurrentPreviewStep(currentPreviewStep + 1);
    } else {
      setIsSuccess(true);
    }
  };

  const handleReset = () => {
    setIsPreviewOpen(false);
    setCurrentPreviewStep(1);
    setIsSuccess(false);
  };

  return (
    <div className="w-full max-w-[320px] mx-auto h-130 sm:h-145 whatsapp-chat-bg bg-cover bg-center bg-no-repeat [scrollbar-width:none] [&::-webkit-scrollbar]:size-0 border-4 border-black/90 dark:border-slate-800 rounded-[2.2rem] overflow-hidden shadow-2xl relative flex flex-col">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-neutral-900 rounded-b-2xl"></div>
      {/* WhatsApp Header */}
      <div className="bg-whatsapp-dark-teal text-white  p-4 pt-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <ChevronLeft size={20} />
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden relative">
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
              <CheckCheck size={16} className="text-primary" />
            </div>
          </div>
          <div className="ml-1">
            <h4 className="text-[13px] font-bold line-clamp-1 leading-tight">
              {setting.app_name || t("app_name")} Business
            </h4>
            <p className="text-[10px] opacity-80 mt-0.5">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Camera size={18} />
          <MoreVertical size={18} />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 [scrollbar-width:none] [&::-webkit-scrollbar]:size-0">
        <div className="mx-auto w-fit px-3 py-1 bg-white/90 rounded-lg text-[10px] uppercase font-bold text-slate-500 shadow-sm border border-slate-200/50">
          Today
        </div>

        {/* Form Entry Message */}
        <div className="max-w-[85%] bg-white rounded-lg rounded-tl-none p-2 shadow-sm border border-slate-100 flex flex-col gap-2">
          <div className="text-[13px] text-slate-800 leading-relaxed px-1">
            Hi! Please click below to fill out our form.
          </div>
          <Button
            onClick={() => {
              setIsPreviewOpen(true);
              setCurrentPreviewStep(1);
              setIsSuccess(false);
            }}
            className="w-full py-2 bg-slate-50 text-sky-600 text-[12px] font-bold rounded border-t border-slate-100 hover:bg-sky-50 transition-colors"
          >
            Preview Flow
          </Button>
          <div className="flex justify-end pr-1 pb-1">
            <span className="text-[9px] text-slate-400">10:57 AM</span>
            <CheckCheck size={10} className="text-sky-400 ml-1" />
          </div>
        </div>
      </div>

      {/* WhatsApp Input Bar */}
      <div className=" p-2 pb-4 flex items-center gap-2 shrink-0 rounded-b-4xl">
        <div className="flex-1 bg-white rounded-lg h-10 flex items-center px-3 gap-2 border border-slate-200/50 min-w-0">
          <Smile size={18} className="text-slate-400 shrink-0" />
          <div className="flex-1 text-slate-400 text-sm truncate">
            Type a message
          </div>
          <Paperclip size={18} className="text-slate-400 rotate-45 shrink-0" />
          <Camera size={18} className="text-slate-400 shrink-0" />
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white shrink-0">
          <Mic size={18} />
        </div>
      </div>

      {/* Offcanvas Form */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 top-22 z-50 flex flex-col bg-slate-50 dark:bg-(--page-body-bg) rounded-t-3xl overflow-hidden"
          >
            {/* Form Header */}
            <div className="bg-white dark:bg-(--page-body-bg) border-b border-slate-100 dark:border-(--card-border-color) px-4 py-2 flex items-center justify-between shrink-0 shadow-sm">
              <Button
                onClick={handleReset}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-100 dark:hover:bg-(--table-hover) flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={18} />
              </Button>
              <h3 className="text-sm font-bold text-slate-900 dark:text-gray-500">
                Form Preview
              </h3>
              <Button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-100 dark:hover:bg-(--table-hover) flex items-center justify-center text-slate-500 transition-colors">
                <MoreVertical size={18} />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="h-1 mx-2.5 rounded-lg bg-slate-100 overflow-hidden shrink-0">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: isSuccess
                    ? "100%"
                    : `${(currentPreviewStep / (maxStep + 1)) * 100}%`,
                }}
                className="h-full bg-primary transition-all duration-500"
              />
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto sm:m-3 m-1 rounded-border-radius [scrollbar-width:none] [&::-webkit-scrollbar]:size-0">
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.div
                    key={`step-${currentPreviewStep}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {fieldsInStep
                      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                      .map((field: any) => (
                        <div key={field.id}>{renderField(field)}</div>
                      ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex text-center space-y-6"
                  >
                    <div className="space-y-2">
                      <p className="text-sm text-slate-800">
                        {submitSettings.success_message ||
                          "Form submitted successfully!"}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Form Footer Action - Sticky at bottom */}
            <div className="shrink-0 px-3 pb-3 pt-2 border-t border-slate-100 dark:bg-(--page-body-bg) dark:border-(--card-border-color) bg-slate-50">
              {!isSuccess ? (
                <Button
                  onClick={handleNext}
                  className="w-full h-12 rounded-lg bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all border-none"
                >
                  {currentPreviewStep < maxStep
                    ? "Next"
                    : submitSettings.button_text || "Submit"}
                </Button>
              ) : (
                <Button
                  onClick={handleReset}
                  className="w-full h-12 rounded-lg bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all border-none"
                >
                  Done
                </Button>
              )}
              <div className="mt-3 flex flex-col items-center gap-1">
                <div className="flex items-center gap-1">
                  <p className="text-[10px] text-primary font-bold">
                    Learn more
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LivePreview;
