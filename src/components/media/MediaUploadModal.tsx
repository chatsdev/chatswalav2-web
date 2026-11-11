"use client";

import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Input } from "@/src/elements/ui/input";
import { useCreateAttachmentMutation } from "@/src/redux/api/mediaApi";
import { FileItem, MediaUploadModalPropsData } from "@/src/types/media";
import { CloudUpload, Loader2, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAppSelector } from "@/src/redux/hooks";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";

const getFileType = (file: File): "image" | "video" | "audio" | "document" | "file" => {
  const mime = file.type || "";
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (
    mime === "application/pdf" ||
    mime.includes("document") ||
    mime.includes("text") ||
    mime.includes("sheet") ||
    mime.includes("presentation")
  ) {
    return "document";
  }
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension) {
    if (["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(extension)) return "image";
    if (["mp4", "mkv", "avi", "mov", "webm"].includes(extension)) return "video";
    if (["mp3", "wav", "ogg", "aac", "m4a"].includes(extension)) return "audio";
    if (["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"].includes(extension)) return "document";
  }
  return "file";
};

const MediaUploadModal: React.FC<MediaUploadModalPropsData> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [createAttachment, { isLoading }] = useCreateAttachmentMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAppSelector((state) => state.auth);
  const { setting } = useAppSelector((state) => state.setting);
  const { planFeatures } = useFeatureAccess();

  const allowedTypesAccept = setting?.allowed_file_upload_types && setting.allowed_file_upload_types.length > 0
    ? setting.allowed_file_upload_types.map((type) => type.startsWith(".") ? type : `.${type}`).join(",")
    : "image/*,video/*,audio/*,.pdf,.doc,.docx,.zip,.json,.rar,.7z";

  const isMediaSharingDisabled = setting?.allow_media_send === false;

  const getFileLimitMB = (type: "image" | "video" | "audio" | "document" | "file"): number => {
    if (!user?.isSelfTenant && planFeatures) {
      const featureKey = `${type}_file_limit`;
      const planLimit = planFeatures[featureKey] || planFeatures[`${type}_limit`] || planFeatures[type];
      if (planLimit !== undefined && planLimit !== null && planLimit !== "") {
        const val = Number(planLimit);
        if (val > 0) {
          return val;
        }
      }
    }
    if (setting) {
      if (type === "document") return setting.document_file_limit || 10;
      if (type === "audio") return setting.audio_file_limit || 10;
      if (type === "video") return setting.video_file_limit || 10;
      if (type === "image") return setting.image_file_limit || 5;
    }
    if (type === "image") return 5;
    if (type === "file") return 25;
    return 10;
  };

  const getMultipleFileShareLimit = (): number => {
    if (!user?.isSelfTenant && planFeatures) {
      const planLimit = planFeatures.multiple_file_share_limit;
      if (planLimit !== undefined && planLimit !== null && planLimit !== "") {
        const val = Number(planLimit);
        if (val > 0) {
          return val;
        }
      }
    }
    if (setting) {
      return setting.multiple_file_share_limit || 10;
    }
    return 10;
  };

  const addFilesToList = (fileList: FileList) => {
    if (isMediaSharingDisabled) {
      toast.error("Media sharing is disabled by the administrator.");
      return;
    }

    const shareLimit = getMultipleFileShareLimit();
    if (files.length + fileList.length > shareLimit) {
      toast.error(
        `You can only upload up to ${shareLimit} files at once.`
      );
      return;
    }

    const validFiles: FileItem[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      if (setting?.allowed_file_upload_types && setting.allowed_file_upload_types.length > 0) {
        const extension = file.name.split(".").pop()?.toLowerCase() || "";
        const isAllowed = setting.allowed_file_upload_types.some((type) => {
          const cleanType = type.startsWith(".") ? type.slice(1).toLowerCase() : type.toLowerCase();
          return cleanType === extension;
        });
        if (!isAllowed) {
          toast.error(
            `${file.name} is not an allowed file type. Allowed: ${setting.allowed_file_upload_types.join(", ")}`
          );
          continue;
        }
      }

      const fileType = getFileType(file);
      const limitMB = getFileLimitMB(fileType);
      const fileSizeMB = file.size / 1024 / 1024;
      if (fileSizeMB > limitMB) {
        toast.error(
          `${file.name} is too large (${fileSizeMB.toFixed(2)} MB). Max allowed for ${fileType} is ${limitMB.toFixed(2)} MB.`
        );
        continue;
      }
      validFiles.push({
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToList(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToList(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => {
      const updated = [...prev];
      const removed = updated.splice(index, 1)[0];
      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return updated;
    });
  };

  const handleClearAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    try {
      const formData = new FormData();
      files.forEach(({ file }) => {
        formData.append("attachments", file);
      });
      await createAttachment(formData).unwrap();
      toast.success(t("file_upload_success"));
      handleClearAll();
      onClose();
      if (onUploadSuccess) onUploadSuccess();
    } catch (error: any) {
      let errorMessage = error?.data?.message || t("file_upload_failed");
      if (error?.status === 413) {
        errorMessage = "File size is too large for the server to process. Please upload a smaller file.";
      }
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md dark:bg-(--card-color)">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{t("upload_files")}</DialogTitle>
          <Button
            onClick={() => {
              onClose();
              handleClearAll();
            }}
            className="p-1 hover:bg-gray-100 bg-gray-50 dark:bg-transparent dark:hover:bg-(--table-hover) rounded-lg transition-colors absolute right-4 top-4 rtl:right-auto rtl:left-4"
          >
            <X size={20} className="dark:text-amber-50 text-slate-500" />
          </Button>
        </DialogHeader>

        <p className="text-sm text-gray-500 mb-4">{t("upload_files_desc")}</p>

        {isMediaSharingDisabled ? (
          <div className="border border-dashed border-red-300 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/10 rounded-lg p-8 flex flex-col items-center justify-center text-center">
            <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 w-16 h-16 rounded-full mb-4 flex items-center justify-center">
              <X size={32} />
            </div>
            <h3 className="text-base font-semibold text-red-700 dark:text-red-400">
              Media Sharing Disabled
            </h3>
            <p className="text-xs text-red-500 dark:text-red-400/80 mt-2 max-w-xs">
              Media sharing and file uploading are currently disabled by the administrator.
            </p>
          </div>
        ) : files.length === 0 ? (
          <div
            className="border border-dashed border-gray-300 dark:border-(--card-border-color) dark:hover:bg-(--table-hover) rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="bg-(--light-primary) dark:bg-(--dark-body) text-primary overflow-hidden w-20 h-20 rounded-lg mb-4 flex items-center justify-center">
              <CloudUpload size={48} className="text-primary" />
            </div>

            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {t("drag_and_drop")}
            </h3>
            <div className="w-full max-w-[320px] mt-2 flex flex-col items-center gap-1.5 select-none pointer-events-none">
              <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium text-center leading-normal">
                Max size: Image {getFileLimitMB("image").toFixed(0)}MB • Video {getFileLimitMB("video").toFixed(0)}MB • Audio {getFileLimitMB("audio").toFixed(0)}MB • Doc {getFileLimitMB("document").toFixed(0)}MB
              </p>
              {setting?.allowed_file_upload_types && setting.allowed_file_upload_types.length > 0 && (
                <p className="text-[10px] text-gray-400/80 dark:text-gray-500/80 text-center break-words leading-normal max-w-full px-2">
                  Formats: {setting.allowed_file_upload_types.join(", ")}
                </p>
              )}
            </div>
            <p className="text-sm text-gray-500 my-2">{t("or_separator")}</p>
            <p className="text-sm text-gray-600 font-medium text-center dark:text-gray-400">
              {t("click_to_browse")}
            </p>

            <Input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
              accept={allowedTypesAccept}
              multiple
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {files.map((fileObj, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border border-gray-200 dark:border-(--card-border-color) rounded-lg p-2 bg-gray-50 dark:bg-(--table-hover)"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded overflow-hidden shrink-0 flex items-center justify-center relative">
                      {fileObj.previewUrl &&
                      fileObj.file.type.startsWith("image/") ? (
                        <Image
                          src={fileObj.previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          width={100}
                          height={100}
                          unoptimized
                        />
                      ) : (
                        <div className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">
                          {fileObj.file.name.split(".").pop()}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium line-clamp-1 break-all whitespace-normal dark:text-gray-200">
                        {fileObj.file.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRemoveFile(index)}
                    className="bg-transparent! text-gray-400! hover:text-red-500! p-2 h-auto"
                  >
                    <X size={18} />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-2 border-t pt-3 dark:border-(--card-border-color)">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 text-xs font-bold dark:border-(--card-border-color) dark:text-gray-300"
                >
                  <Plus size={14} />
                  Add More
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash2 size={14} />
                  Clear All
                </Button>
              </div>
              <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
                accept={allowedTypesAccept}
                multiple
              />
              <span className="text-xs text-gray-500 font-medium">
                {files.length} {files.length === 1 ? "file" : "files"} selected
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                className="bg-primary text-white w-full h-10 font-bold"
                onClick={handleUpload}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t("uploading")}</span>
                  </div>
                ) : (
                  `${t("upload_files")} (${files.length})`
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MediaUploadModal;
