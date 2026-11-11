/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import { cn } from "@/src/lib/utils";
import { FormCanvasProps } from "@/src/types/formBuilder";
import {
  ChevronLeft,
  ChevronRight,
  Form,
  GripVertical,
  Plus,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion, Reorder } from "motion/react";

const FormCanvas: React.FC<FormCanvasProps> = ({
  fields,
  onSelectField,
  selectedFieldId,
  onDeleteField,
  onUpdateField,
  onReorderFields,
  activeStep,
  onStepChange,
  onAddStep,
  totalSteps,
}) => {
  const handleOptionChange = (field: any, optionId: string, updates: any) => {
    const newOptions = field.options.map((opt: any) =>
      opt.id === optionId ? { ...opt, ...updates } : opt,
    );
    onUpdateField({ options: newOptions });
  };

  const addOption = (field: any) => {
    const newOption = {
      id: Math.random().toString(36).substr(2, 5),
      label: "New Option",
      value: "new_option",
    };
    onUpdateField({ options: [...(field.options || []), newOption] });
  };

  const removeOption = (field: any, optionId: string) => {
    onUpdateField({
      options: field.options.filter((opt: any) => opt.id !== optionId),
    });
  };

  return (
    <div className="xl:flex-1 h-full flex-[unset] bg-white dark:bg-(--card-color) border border-slate-200/60 dark:border-(--card-border-color) rounded-lg flex flex-col shadow-inner">
      <div className="p-4 border-b rounded-t-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--card-color) flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
            <Form size={14} className="text-primary" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Form Canvas
          </h3>
        </div>
        <Badge
          variant="outline"
          className="font-mono text-[10px] bg-primary/5 text-primary border-primary/20"
        >
          {fields.length} Fields
        </Badge>
      </div>

      <div className="flex-1 flex items-stretch min-h-f relative">
        {/* Back Button */}
        {activeStep > 1 && (
          <div className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-30 flex">
            <Button
              onClick={() => onStepChange(activeStep - 1)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) shadow-lg flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-all active:scale-90 animate-in fade-in zoom-in duration-300"
              title="Previous Step"
            >
              <ChevronLeft size={18} />
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto py-4 sm:py-6 px-4 sm:px-14 custom-scrollbar max-h-[617px]">
          {fields.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-(--dark-body) flex items-center justify-center mb-2 border border-slate-200/50 dark:border-none shadow-sm animate-pulse">
                <GripVertical size={24} />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-600 dark:text-slate-400">
                  Step {activeStep} is Empty
                </p>
                <p className="text-[11px] max-w-50 text-slate-400">
                  Add fields to this step to build your flow.
                </p>
              </div>
            </div>
          ) : (
            <Reorder.Group
              axis="y"
              values={fields}
              onReorder={onReorderFields}
              className="space-y-3"
            >
              <AnimatePresence mode="popLayout">
                {fields.map((field, index) => {
                  const isSelected = selectedFieldId === field.id;
                  const hasOptions = ["select", "radio", "checkbox"].includes(
                    field.type,
                  );

                  return (
                    <Reorder.Item
                      key={field.id}
                      value={field}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => onSelectField(field.id)}
                      className={cn(
                        "group relative bg-white dark:bg-(--page-body-bg) border rounded-xl overflow-hidden transition-all cursor-pointer shadow-sm hover:shadow-md",
                        isSelected
                          ? "border-primary ring-4 ring-primary/5 shadow-lg scale-[1.01] z-20"
                          : "border-slate-200/80 dark:border-(--card-border-color) hover:border-primary/40 dark:hover:border-primary/40",
                      )}
                    >
                      <div
                        className={cn(
                          "p-4 flex items-center gap-4",
                          isSelected &&
                            "bg-slate-50/50 dark:bg-primary/5 border-b border-slate-100 dark:border-primary/10",
                        )}
                      >
                        <div className="cursor-grab active:cursor-grabbing p-1 text-slate-300 group-hover:text-primary transition-colors">
                          <GripVertical size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 font-mono italic opacity-80 uppercase tracking-wider">
                              #{index + 1}
                            </span>
                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                              {field.label || "Untitled Field"}
                            </h4>
                            {field.required && (
                              <span className="text-red-500 text-xs font-bold">
                                *
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge
                              variant="outline"
                              className="text-[9px] font-bold h-4 px-1.5 bg-white dark:bg-(--dark-body) uppercase text-slate-500 border-slate-200 dark:border-slate-700 tracking-tight"
                            >
                              {field.type}
                            </Badge>
                            <span className="text-[11px] text-slate-400 font-mono truncate bg-slate-100/50 dark:bg-(--page-body-bg) px-1.5 py-0.5 rounded">
                              {field.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteField(field.id);
                            }}
                            className="p-2 text-slate-400 bg-[unset]! hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all active:scale-90"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>

                      {/* Inline Settings Section */}
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="border-t border-slate-100 dark:border-primary/10 bg-white dark:bg-(--page-body-bg)"
                        >
                          <div className="sm:p-6 p-4 space-y-6">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-50 dark:border-(--card-border-color)">
                              <Settings2 size={14} className="text-primary" />
                              <h5 className="text-[12px] font-medium text-slate-500">
                                Field Settings
                              </h5>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-1.5">
                                <Label className="text-[12px] font-medium text-slate-500 ">
                                  Display Label
                                </Label>
                                <Input
                                  value={field.label}
                                  onChange={(e) =>
                                    onUpdateField({ label: e.target.value })
                                  }
                                  placeholder="e.g. Full Name"
                                  className="h-10 text-[13px] bg-slate-50/50 dark:bg-(--card-color) border-slate-200 dark:border-none focus:ring-primary/20"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <Label className="text-[12px] font-medium text-slate-500 ">
                                  Name / Key
                                </Label>
                                <Input
                                  value={field.name}
                                  onChange={(e) =>
                                    onUpdateField({ name: e.target.value })
                                  }
                                  placeholder="e.g. user_full_name"
                                  className="h-10 text-[13px] font-mono bg-slate-50/50 dark:bg-(--card-color) border-slate-200 dark:border-none focus:ring-primary/20"
                                />
                                <p className="text-[9px] text-slate-400 italic px-1">
                                  Unique identifier for payload. Use snake_case.
                                </p>
                              </div>

                              <div className="space-y-4">
                                {![
                                  "heading",
                                  "select",
                                  "radio",
                                  "checkbox",
                                  "date",
                                ].includes(field.type) && (
                                  <div className="space-y-1.5">
                                    <Label className="text-[12px] font-medium text-slate-500 ">
                                      Helper / Placeholder
                                    </Label>
                                    <Input
                                      value={field.helper_text || ""}
                                      onChange={(e) =>
                                        onUpdateField({
                                          helper_text: e.target.value,
                                        })
                                      }
                                      placeholder="Enter your name..."
                                      className="h-10 text-[13px] bg-slate-50/50 dark:bg-(--card-color) border-slate-200 dark:border-none focus:ring-primary/20"
                                    />
                                  </div>
                                )}

                                {field.type !== "heading" && (
                                  <div className="p-4 bg-slate-50/50 dark:bg-(--page-body-bg) rounded-lg border border-slate-100 dark:border-(--card-border-color)">
                                    <div className="flex items-center justify-between">
                                      <div className="space-y-0.5">
                                        <Label className="text-[12px] font-bold">
                                          Required Field
                                        </Label>
                                        <div className="text-[10px] text-slate-400">
                                          Mark as mandatory
                                        </div>
                                      </div>
                                      <Switch
                                        checked={field.required}
                                        onCheckedChange={(checked) =>
                                          onUpdateField({ required: checked })
                                        }
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {hasOptions && (
                              <div className="pt-4 border-t border-slate-50 dark:border-(--card-border-color)">
                                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                                  <div className="space-y-0.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                                      Selection Options
                                    </Label>
                                    <div className="text-[10px] text-slate-400">
                                      Add options for the user to select from
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addOption(field)}
                                    className="h-8 px-3 text-[11px] font-bold text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 hover:text-primary gap-1.5"
                                  >
                                    <Plus size={14} /> Add Option
                                  </Button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {field.options?.map(
                                    (opt: any, index: number) => (
                                      <div
                                        key={index}
                                        className="flex gap-2 group/opt animate-in slide-in-from-right-2 duration-200"
                                      >
                                        <Input
                                          value={opt.label}
                                          onChange={(e) =>
                                            handleOptionChange(field, opt.id, {
                                              label: e.target.value,
                                              value: e.target.value
                                                .toLowerCase()
                                                .replace(/\s+/g, "_"),
                                            })
                                          }
                                          placeholder="Option label"
                                          className="h-9 text-xs bg-slate-50/30 dark:bg-(--card-color) border-slate-200 dark:border-none focus:ring-1 focus:ring-primary/20"
                                        />
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            removeOption(field, opt.id)
                                          }
                                          className="h-9 w-9 shrink-0 text-red-400 hover:text-red-500 bg-red-50 hover:bg-red-50 dark:bg-red-900/20 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                          <X size={14} />
                                        </Button>
                                      </div>
                                    ),
                                  )}
                                  {(!field.options ||
                                    field.options.length === 0) && (
                                    <div className="col-span-full py-8 bg-slate-50/30 dark:bg-(--page-body-bg) rounded-lg border border-dashed border-slate-200 dark:border-(--card-border-color) flex flex-col items-center justify-center gap-2">
                                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-(--dark-body) flex items-center justify-center text-slate-300">
                                        <Plus size={16} />
                                      </div>
                                      <p className="text-[10px] text-slate-400 font-medium italic">
                                        No options defined yet
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </Reorder.Item>
                  );
                })}
              </AnimatePresence>
            </Reorder.Group>
          )}
        </div>

        {/* Next / Add Button */}
        <div className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2">
          {activeStep === totalSteps ? (
            <Button
              onClick={onAddStep}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary text-white shadow-lg shadow-primary/20 flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95 animate-in fade-in zoom-in duration-300 group"
              title="Add New Step"
            >
              <Plus
                size={18}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
            </Button>
          ) : (
            <Button
              onClick={() => onStepChange(activeStep + 1)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) shadow-lg flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-all active:scale-90 animate-in fade-in zoom-in duration-300"
              title="Next Step"
            >
              <ChevronRight size={18} />
            </Button>
          )}
          <span className="text-[10px] font-bold text-slate-400 bg-white/80 dark:bg-(--card-color)/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-slate-100 dark:border-(--card-border-color)">
            Step {activeStep}/{totalSteps}
          </span>
        </div>
      </div>

      <div className="p-4 rounded-b-lg bg-slate-50/80 dark:bg-(--card-color) border-t border-slate-200 dark:border-(--card-border-color) text-center backdrop-blur-sm">
        <p className="text-[10px] text-slate-500 font-medium tracking-tight">
          Click and drag the{" "}
          <span className="text-primary font-bold">handle</span> to reorder.
          Settings are auto-saved to draft.
        </p>
      </div>
    </div>
  );
};

export default FormCanvas;
