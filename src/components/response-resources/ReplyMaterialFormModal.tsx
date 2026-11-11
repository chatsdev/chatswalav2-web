/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants";
import { SMALL_TYPE_ICON } from "@/src/data/responseResource";
import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { Textarea } from "@/src/elements/ui/textarea";
import { cn } from "@/src/lib/utils";
import { useGetFormsQuery } from "@/src/redux/api/formBuilderApi";
import {
  ReplyMaterialFormModalProps,
  ReplyMaterialType,
} from "@/src/types/replyMaterial";
import {
  ExternalLink,
  Loader2,
  Plus,
  Upload,
  X
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const ReplyMaterialFormModal: React.FC<ReplyMaterialFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  config,
  editItem,
  wabaId,
}) => {
  const { t } = useTranslation();
  const isEditMode = !!editItem;

  const PLACEHOLDER: Record<ReplyMaterialType, string> = {
    text: t("quick_reply_placeholder"),
    image: "",
    document: "",
    video: "",
    sticker: "",
    sequence: "",
    template: "",
    catalog: "",
    chatbot: "",
    flow: t("flow_message_placeholder"),
  };

  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [selectedFlowId, setSelectedFlowId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: formsData, isLoading: isLoadingForms } = useGetFormsQuery(
    { waba_id: wabaId, limit: 100 },
    { skip: !isOpen || config.type !== "flow" || !wabaId },
  );

  const publishedForms =
    formsData?.data?.filter(
      (f: any) =>
        f.meta_status === "PUBLISHED" || f.flow?.meta_status === "PUBLISHED",
    ) || [];

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(editItem?.name ?? "");
      setContent(editItem?.content ?? "");
      setButtonText(editItem?.button_text ?? "");
      setSelectedFlowId(editItem?.flow_id ?? "");
      setFile(null);
      setPreview(editItem?.file_url ?? null);
      setErrors({});
    }
  }, [isOpen, editItem]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileChange = (incoming: File | null) => {
    if (!incoming) return;
    setFile(incoming);
    clearError("file");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileChange(dropped);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Resource name is required";
    }

    if (config.type === "text" || config.type === "flow") {
      if (!content.trim()) {
        newErrors.content = "Message body is required";
      }
    }

    if (config.type === "flow") {
      if (!buttonText.trim()) {
        newErrors.buttonText = "Button text is required";
      }
      if (!selectedFlowId) {
        newErrors.flowId = "Please select a flow";
      }
    }

    if (config.hasFile && !file && !preview) {
      newErrors.file = "Please upload a file";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setErrors({});
    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("type", config.type);

    if (config.type === "text" || config.type === "flow") {
      fd.append("content", content.trim());
    }

    if (config.type === "flow") {
      fd.append("button_text", buttonText.trim());
      fd.append("flow_id", selectedFlowId);
    }

    if (file) {
      fd.append("file", file);
    }
    await onSubmit(fd);
  };

  const resetAndClose = () => {
    setName("");
    setContent("");
    setButtonText("");
    setSelectedFlowId("");
    setFile(null);
    setPreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? resetAndClose : undefined}>
      <DialogContent className="sm:max-w-lg p-0! overflow-hidden dark:border-(--card-border-color) bg-white dark:bg-(--card-color) rounded-lg shadow-2xl">
        <DialogHeader className="sm:px-6 px-4 pt-6 pb-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-primary/5 dark:bg-primary/10 flex items-center justify-center">
              {SMALL_TYPE_ICON[config.type]}
            </div>
            <div>
              <DialogTitle className="text-lg text-left rtl:text-right font-bold text-slate-900 dark:text-white tracking-tight">
                {isEditMode ? t("edit") : t("add")} {t(config.label)}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 font-medium mt-0.5">
                {isEditMode
                  ? t("update_details")
                  : t("create_new_item_desc", {
                      type: t(config.label).toLowerCase(),
                    })}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="sm:px-6 px-4 pb-6 pt-0 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar"
        >
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-500">
              {t("name")}
            </Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) clearError("name");
              }}
              placeholder={t("welcome_msg_placeholder")}
              disabled={isLoading}
              className={cn(
                "h-11 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body) focus:border-primary",
                errors.name && "border-red-400 ring-2 ring-red-500/10",
              )}
            />
            {errors.name && (
              <p className="text-[10px] text-red-500 font-medium ml-1">
                {errors.name}
              </p>
            )}
          </div>

          {(config.type === "text" || config.type === "flow") && (
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-500">
                {t("message_body")}
              </Label>
              <Textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (e.target.value.trim()) clearError("content");
                }}
                placeholder={PLACEHOLDER[config.type]}
                rows={4}
                disabled={isLoading}
                className={cn(
                  "w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body) focus:outline-none focus:border-primary resize-none transition-colors text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600",
                  errors.content && "border-red-400 ring-2 ring-red-500/10",
                )}
              />
              {errors.content && (
                <p className="text-[10px] text-red-500 font-medium ml-1">
                  {errors.content}
                </p>
              )}
            </div>
          )}

          {config.type === "flow" && (
            <>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-500">
                  {t("button_text")}
                </Label>
                <Input
                  value={buttonText}
                  onChange={(e) => {
                    setButtonText(e.target.value);
                    if (e.target.value.trim()) clearError("buttonText");
                  }}
                  placeholder={t("open_form_placeholder")}
                  disabled={isLoading}
                  className={cn(
                    "h-11 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body) focus:border-primary",
                    errors.buttonText &&
                      "border-red-400 ring-2 ring-red-500/10",
                  )}
                />
                {errors.buttonText && (
                  <p className="text-[10px] text-red-500 font-medium ml-1">
                    {errors.buttonText}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 focus-within:z-10">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-500">
                    {t("select_flow")}
                  </Label>
                  <Button
                    type="button"
                    onClick={() =>
                      window.open(ROUTES.WhatsappFormCreate, "_blank")
                    }
                    className="flex items-center bg-[unset]! gap-1.5 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest px-1"
                  >
                    <Plus size={12} strokeWidth={3} />
                    Add Form
                    <ExternalLink size={10} className="ml-0.5 opacity-50" />
                  </Button>
                </div>
                <Select
                  value={selectedFlowId}
                  onValueChange={(val) => {
                    setSelectedFlowId(val);
                    if (val) clearError("flowId");
                  }}
                  disabled={isLoading || isLoadingForms}
                >
                  <SelectTrigger
                    className={cn(
                      "h-12! rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body)",
                      errors.flowId && "border-red-400 ring-2 ring-red-500/10",
                    )}
                  >
                    <SelectValue
                      placeholder={
                        isLoadingForms ? t("loading_flows") : t("choose_flow")
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-(--card-color)">
                    {publishedForms.map((flow: any) => (
                      <SelectItem
                        className="dark:hover:bg-(--table-hover)"
                        key={flow._id}
                        value={flow.flow?.flow_id || flow._id}
                      >
                        {flow.name}
                      </SelectItem>
                    ))}
                    {publishedForms.length === 0 && !isLoadingForms && (
                      <div className="p-2 text-xs text-center text-slate-400 italic">
                        {t("no_flows_found")}
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {errors.flowId && (
                  <p className="text-[10px] text-red-500 font-medium ml-1 mt-1">
                    {errors.flowId}
                  </p>
                )}
              </div>
            </>
          )}

          {config.hasFile && (
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-500">
                {isEditMode ? t("replace_file") : t("upload_file")}
              </Label>

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={cn(
                  "relative h-36 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all",
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body) hover:border-primary/40 hover:bg-primary/5",
                  errors.file && "border-red-400 bg-red-50/10",
                )}
              >
                {preview && config.type === "image" ? (
                  <Image
                    src={preview || ""}
                    alt="preview"
                    width={100}
                    height={100}
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    unoptimized
                  />
                ) : preview && config.type !== "image" ? (
                  <div className="flex flex-col items-center gap-1.5 text-slate-400">
                    {SMALL_TYPE_ICON[config.type]}
                    <p className="text-xs font-semibold">
                      {file?.name ?? t("file_selected")}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Upload size={24} />
                    <p className="text-xs font-semibold text-center px-4">
                      {t("drag_drop_browse")}
                    </p>
                    <p className="text-[10px] text-slate-300 dark:text-slate-600">
                      {config.accept ?? t("any_file")}
                    </p>
                  </div>
                )}

                {(file || preview) && (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setPreview(null);
                    }}
                    className="absolute hover:bg-[unset]! top-2 ltr:right-2 rtl:left-2 w-6 h-6 rounded-full bg-white dark:bg-red-900/20 dark:text-red-500 border border-slate-200 dark:border-(--card-border-color) flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm z-10"
                  >
                    <X size={12} />
                  </Button>
                )}
              </div>
              {errors.file && (
                <p className="text-[10px] text-red-500 font-medium ml-1 mt-1">
                  {errors.file}
                </p>
              )}

              <Input
                ref={fileInputRef}
                type="file"
                accept={config.accept}
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={resetAndClose}
              disabled={isLoading}
              className="flex-1 h-11 rounded-lg border-slate-200 dark:border-(--card-border-color) text-slate-600 dark:text-slate-300"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-11 rounded-lg bg-primary text-white font-semibold shadow-lg shadow-primary/20 active:scale-95 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin ltr:mr-2 rtl:ml-2"
                  />
                  {t("saving")}
                </>
              ) : isEditMode ? (
                t("save_changes")
              ) : (
                t("create")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyMaterialFormModal;
