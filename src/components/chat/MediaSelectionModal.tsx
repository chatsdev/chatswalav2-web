"use client";

import MediaGrid from "@/src/components/media/MediaGrid";
import { Button } from "@/src/elements/ui/button";
import { Checkbox } from "@/src/elements/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { useGetAttachmentsQuery } from "@/src/redux/api/mediaApi";
import { Attachment } from "@/src/types/components";
import {
  LocalAttachment,
  MediaSelectionModalProps,
} from "@/src/types/components/chat";
import { Loader2, Search, Send, Upload } from "lucide-react";
import { useRef, useState } from "react";
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

const MediaSelectionModal = ({
  isOpen,
  onClose,
  onSelect,
  allowedTypes = "all",
}: MediaSelectionModalProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [localAttachments, setLocalAttachments] = useState<LocalAttachment[]>(
    [],
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAppSelector((state) => state.auth);
  const { setting } = useAppSelector((state) => state.setting);
  const { planFeatures } = useFeatureAccess();

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

  const allowedTypesAccept = (() => {
    if (setting?.allowed_file_upload_types && setting.allowed_file_upload_types.length > 0) {
      return setting.allowed_file_upload_types.map((type) => type.startsWith(".") ? type : `.${type}`).join(",");
    }
    return allowedTypes === "image"
      ? "image/*"
      : allowedTypes === "video"
      ? "video/*"
      : "image/*,video/*,audio/*,.pdf,.doc,.docx,.zip,.json,.rar,.7z";
  })();

  const { data: attachmentsData, isLoading } = useGetAttachmentsQuery({
    page,
    search,
  });

  const attachments: Attachment[] = attachmentsData?.data || [];

  const filteredLocal = localAttachments.filter((a) => {
    const isVideo = a.mimeType?.startsWith("video/") || a.fileUrl?.endsWith(".mp4");
    if (allowedTypes === "image") return !isVideo;
    if (allowedTypes === "video") return isVideo;
    return true;
  });

  const filteredAttachments = attachments.filter((a) => {
    const isVideo = a.mimeType?.startsWith("video/") || a.fileUrl?.endsWith(".mp4");
    if (allowedTypes === "image") return !isVideo;
    if (allowedTypes === "video") return isVideo;
    return true;
  });

  const allAttachments: LocalAttachment[] = [
    ...filteredLocal,
    ...filteredAttachments,
  ];

  const handleGridSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (checked: boolean) => {
    const currentPageIds = allAttachments.map((a) => a._id);
    if (checked) {
      const uniqueIds = Array.from(
        new Set([...selectedItems, ...currentPageIds]),
      );
      setSelectedItems(uniqueIds);
    } else {
      setSelectedItems(
        selectedItems.filter((id) => !currentPageIds.includes(id)),
      );
    }
  };

  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const filesArray = Array.from(files).filter((file) => {
      const isVideo = file.type.startsWith("video/");
      if (allowedTypes === "image") return !isVideo;
      if (allowedTypes === "video") return isVideo;
      return true;
    });

    if (filesArray.length === 0 && files.length > 0) {
      toast.error(
        allowedTypes === "video"
          ? "Only video files are allowed"
          : "Only image files are allowed"
      );
      return;
    }

    const validFiles: File[] = [];
    for (const file of filesArray) {
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

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    const shareLimit = getMultipleFileShareLimit();
    if (selectedItems.length + validFiles.length > shareLimit) {
      toast.error(`You can only select up to ${shareLimit} files at once.`);
      return;
    }

    const newLocalAttachments: LocalAttachment[] = validFiles.map(
      (file) => ({
        _id: `local-${file.name}-${Date.now()}-${Math.random()}`,
        original_name: file.name,
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        fileUrl: URL.createObjectURL(file),
        localFile: file,
        createdAt: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        encoding: "7bit",
        path: "",
      }),
    );

    setLocalAttachments((prev) => [...newLocalAttachments, ...prev]);
    setSelectedItems((prev) => [
      ...prev,
      ...newLocalAttachments.map((a) => a._id),
    ]);
  };

  const handleSubmit = () => {
    const shareLimit = getMultipleFileShareLimit();
    if (selectedItems.length > shareLimit) {
      toast.error(`You can only send up to ${shareLimit} items at once.`);
      return;
    }
    const selectedMedia = allAttachments.filter((a) =>
      selectedItems.includes(a._id),
    );
    onSelect(selectedMedia);
    onClose();
    setSelectedItems([]);
    setLocalAttachments([]);
  };

  const handleClose = () => {
    onClose();
    setSelectedItems([]);
    setLocalAttachments([]);
  };

  const shareLimit = getMultipleFileShareLimit();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100vw-1rem)] gap-0 sm:w-[calc(100vw-2rem)] md:w-[calc(100vw-4rem)] lg:max-w-3xl max-h-[95vh] sm:max-h-[90vh] dark:bg-(--page-body-bg) flex flex-col p-3 sm:p-4 md:p-6 overflow-hidden overflow-x-hidden">
        <DialogHeader className="mb-3 sm:mb-4 shrink-0 flex flex-row items-center justify-between">
          <DialogTitle className="text-base sm:text-lg md:text-xl text-left">
            Select Media
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 sm:h-9 gap-2 text-xs sm:text-sm border-primary text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={14} />
              <span className="hidden xs:inline">Send from Local</span>
              <span className="xs:hidden">Local</span>
            </Button>
            <Input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={handleLocalFileSelect}
              accept={allowedTypesAccept}
            />
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-3 sm:gap-4 flex-1 min-h-0 overflow-x-hidden">
          {/* Search and Select All Section */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <Input
                placeholder="Search media..."
                className="pl-8 sm:pl-10 h-9 sm:h-10 text-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Select All Checkbox */}
            <div className="flex items-center gap-2 px-2.5 sm:px-3 h-9 sm:h-10 bg-slate-50 dark:bg-(--table-hover) border border-slate-200 dark:border-(--card-border-color) rounded-lg shrink-0">
              <Checkbox
                id="select-all-modal"
                checked={
                  allAttachments.length > 0 &&
                  allAttachments.every((a) => selectedItems.includes(a._id))
                }
                onCheckedChange={(checked) => handleSelectAll(checked === true)}
                className="h-4 w-4 sm:h-5 sm:w-5"
              />
              <Label
                htmlFor="select-all-modal"
                className="text-xs sm:text-sm font-medium text-slate-600 dark:text-gray-500 cursor-pointer select-none whitespace-nowrap"
              >
                Select All
              </Label>
            </div>
          </div>

          {/* Media Grid Container */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pr-2 sm:pr-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-48 sm:h-64">
                <Loader2 className="animate-spin text-primary" size={28} />
              </div>
            ) : allAttachments.length > 0 ? (
              <div className=" pr-2">
                <MediaGrid
                  attachments={allAttachments}
                  selectedItems={selectedItems}
                  onSelect={handleGridSelect}
                  onItemClick={() => {}}
                  isSelectionEnabled={true}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-slate-400">
                <p className="text-sm sm:text-base">No media found</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex-row flex justify-between items-center gap-3 border-t border-slate-100 dark:border-(--card-border-color) pt-3 sm:pt-4 mt-3 sm:mt-4 shrink-0 overflow-x-hidden">
          {/* Selected Count */}
          <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-500 font-medium shrink-0 overflow-hidden">
            <span
              className={`hidden xs:inline ${selectedItems.length > shareLimit && "text-red-600"}`}
            >
              {selectedItems.length}/{shareLimit} items selected
            </span>
            <span
              className={`xs:hidden ${selectedItems.length > shareLimit && "text-red-600"}`}
            >
              {selectedItems.length}/{shareLimit} selected
            </span>
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-8 sm:h-9 md:h-10 px-3 sm:px-4 text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-primary text-white h-8 sm:h-9 md:h-10 px-3 sm:px-4 text-xs sm:text-sm"
              disabled={selectedItems.length === 0}
              onClick={handleSubmit}
            >
              <Send size={14} className="sm:mr-2" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MediaSelectionModal;
