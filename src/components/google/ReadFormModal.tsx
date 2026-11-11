"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { useReadFormQuery } from "@/src/redux/api/googleApi";
import { Loader2, Calendar, Clock, Star, Heart, ThumbsUp } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/src/elements/ui/radio-group";
import { Checkbox } from "@/src/elements/ui/checkbox";
import { Input } from "@/src/elements/ui/input";
import { Textarea } from "@/src/elements/ui/textarea";
import { Label } from "@/src/elements/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";

interface ReadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formId: string;
}

const ReadFormModal: React.FC<ReadFormModalProps> = ({
  isOpen,
  onClose,
  formId,
}) => {
  const { data, isLoading } = useReadFormQuery({ formId }, { skip: !formId });
  const formDetails = data?.form;

  const renderQuestionInput = (item: any) => {
    const question = item.questionItem?.question;
    if (!question) return null;

    // Choice Question
    if (question.choiceQuestion) {
      const { type, options } = question.choiceQuestion;
      const optValues = options || [];

      if (type === "RADIO") {
        return (
          <RadioGroup className="space-y-2 mt-3" disabled>
            {optValues.map((opt: any, idx: number) => (
              <div key={idx} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={`q-${item.itemId}-${idx}`} />
                <Label htmlFor={`q-${item.itemId}-${idx}`} className="text-slate-600 dark:text-slate-300 font-normal">
                  {opt.value}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      }

      if (type === "CHECKBOX") {
        return (
          <div className="space-y-2 mt-3">
            {optValues.map((opt: any, idx: number) => (
              <div key={idx} className="flex items-center space-x-2">
                <Checkbox id={`q-${item.itemId}-${idx}`} disabled />
                <Label htmlFor={`q-${item.itemId}-${idx}`} className="text-slate-600 dark:text-slate-300 font-normal">
                  {opt.value}
                </Label>
              </div>
            ))}
          </div>
        );
      }

      if (type === "DROP_DOWN") {
        return (
          <div className="mt-3 max-w-xs">
            <Select disabled>
              <SelectTrigger className="h-11 border-slate-200">
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                {optValues.map((opt: any, idx: number) => (
                  <SelectItem key={idx} value={opt.value}>
                    {opt.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      }
    }

    // Scale Question
    if (question.scaleQuestion) {
      const { low = 1, high = 5, lowLabel, highLabel } = question.scaleQuestion;
      const range = Array.from({ length: high - low + 1 }, (_, i) => low + i);

      return (
        <div className="mt-4 flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium max-w-md">
            <span>{lowLabel || "Low"}</span>
            <span>{highLabel || "High"}</span>
          </div>
          <div className="flex items-center space-x-4">
            {range.map((num) => (
              <div key={num} className="flex flex-col items-center space-y-1.5">
                <span className="text-xs font-semibold text-slate-500">{num}</span>
                <RadioGroupItem value={String(num)} disabled className="h-5 w-5" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Text Question
    if (question.textQuestion) {
      if (question.textQuestion.paragraph) {
        return (
          <Textarea
            className="mt-3 border-slate-200 dark:border-(--card-border-color) dark:bg-(--card-color) resize-none min-h-[80px]"
            placeholder="Long answer text"
            disabled
          />
        );
      }
      return (
        <Input
          className="border-slate-200 dark:border-(--card-border-color) dark:bg-(--card-color) max-w-md h-11"
          placeholder="Short answer text"
          disabled
        />
      );
    }

    // Date Question
    if (question.dateQuestion) {
      return (
        <div className="mt-3 relative max-w-xs">
          <Input className="h-11 pl-10 border-slate-200" placeholder="MM/DD/YYYY" disabled />
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
      );
    }

    // Time Question
    if (question.timeQuestion) {
      return (
        <div className="mt-3 relative max-w-xs">
          <Input className="h-11 pl-10 border-slate-200" placeholder="HH:MM AM/PM" disabled />
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
      );
    }

    // Rating Question (if any, from payload mapping)
    const ratingData = question.ratingQuestion || item.questionItem?.ratingQuestion;
    if (ratingData) {
      const ratingScaleLevel = ratingData.ratingScaleLevel || 5;
      const iconType = ratingData.iconType || "STAR";

      const renderIcon = () => {
        if (iconType === "HEART") return <Heart size={20} className="fill-current opacity-40" />;
        if (iconType === "THUMB_UP") return <ThumbsUp size={20} className="fill-current opacity-40" />;
        return <Star size={20} className="fill-current opacity-40" />;
      };

      return (
        <div className="mt-3 flex items-center space-x-1 text-amber-400">
          {Array.from({ length: ratingScaleLevel }).map((_, idx) => (
            <React.Fragment key={idx}>{renderIcon()}</React.Fragment>
          ))}
        </div>
      );
    }

    // Fallback text input
    return (
      <Input
        className="mt-3 border-slate-200 max-w-md h-11"
        placeholder="Answer text"
        disabled
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl! max-w-[calc(100%-2rem)]! max-h-[90vh] overflow-y-auto no-scrollbar p-0! bg-slate-50 dark:bg-(--card-color) border-none rounded-lg">
        <DialogTitle className="sr-only">
          {formDetails?.info?.title || "Google Form Preview"}
        </DialogTitle>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            <p className="text-sm font-medium">Loading form preview...</p>
          </div>
        ) : formDetails ? (
          <div className="flex flex-col">
            {/* Purple Form Header accent */}
            <div className="h-2 bg-purple-700 rounded-t-2xl w-full" />

            <div className="sm:p-6 p-4 space-y-6">
              {/* Form Title & Description Card */}
              <div className="space-y-3">
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {formDetails.info?.title || "Untitled Form"}
                </h1>
                {formDetails.info?.description && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 whitespace-pre-line leading-relaxed">
                    {formDetails.info.description}
                  </p>
                )}
              </div>

              {/* Form Questions Cards */}
              <div className="space-y-4">
                {formDetails.items?.map((item: any, idx: number) => {
                  // Only display question items
                  if (!item.questionItem) return null;
                  const isRequired = item.questionItem.question?.required;

                  return (
                    <div
                      key={item.itemId || idx}
                      className="bg-white dark:bg-(--page-body-bg) border border-slate-100 dark:border-(--card-border-color) rounded-lg sm:p-6 p-4 shadow-sm space-y-1.5"
                    >
                      <div className="flex items-start justify-between">
                        <Label className="text-base font-semibold text-slate-800 dark:text-slate-200">
                          {item.title || "Question"}
                          {isRequired && (
                            <span className="text-red-500 ml-1 font-bold">*</span>
                          )}
                        </Label>
                      </div>
                      {item.description && (
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {item.description}
                        </p>
                      )}
                      {renderQuestionInput(item)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
            <p className="text-sm font-medium">Failed to load form details.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReadFormModal;
