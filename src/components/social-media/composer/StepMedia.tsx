/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Image as ImageIcon, Video, Plus, Loader2, FileUp } from "lucide-react";
import { Label } from "@/src/elements/ui/label";
import { Button } from "@/src/elements/ui/button";
import { Attachment } from "@/src/types/components";
import { XIcon } from "../SocialPreviews";

interface StepMediaProps {
  selectedMedia: Attachment[];
  handleRemoveMedia: (id: string) => void;
  onBrowseLibrary: () => void;
  onUploadLocal: () => void;
  isUploadingFile: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleLocalFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedContentType?: string;
}

export function StepMedia({
  selectedMedia,
  handleRemoveMedia,
  onBrowseLibrary,
  onUploadLocal,
  isUploadingFile,
  fileInputRef,
  handleLocalFileSelect,
  selectedContentType
}: StepMediaProps) {
  return (
    <div className="space-y-5">
      <div>
        <Label className="text-sm font-semibold text-slate-800 dark:text-gray-200">
          Media Attachments
        </Label>
        <p className="text-sm text-slate-400 mt-0.5">
          Attach photos or video content to your post.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {selectedMedia.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 dark:border-(--card-border-color) rounded-lg sm:p-6 p-4 text-center flex flex-col items-center justify-center bg-slate-50/30 dark:bg-(--page-body-bg) min-h-[220px] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary animate-bounce">
              <FileUp size={20} />
            </div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-slate-200 mb-1">
              Add Media Attachments
            </h4>
            <p className="text-sm text-slate-400 dark:text-slate-400 max-w-[300px] leading-relaxed mb-5">
              Select media from your library or upload local files. Supported formats: images, video files.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onBrowseLibrary}
                className="h-10 text-xs font-semibold border-slate-200 dark:border-(--card-border-color) bg-white hover:bg-slate-50 dark:bg-(--page-body-bg) dark:hover:bg-(--table-hover) gap-2 rounded-lg text-slate-700 dark:text-slate-300 shadow-sm"
              >
                <ImageIcon size={14} className="text-slate-400" />
                Browse Library
              </Button>
              <Button
                type="button"
                onClick={onUploadLocal}
                disabled={isUploadingFile}
                className="h-10 text-xs font-semibold bg-primary text-white hover:bg-primary/95 gap-2 rounded-lg shadow-md shadow-primary/10 active:scale-95 transition-all"
              >
                {isUploadingFile ? (
                  <Loader2 size={14} className="animate-spin text-white" />
                ) : (
                  <Plus size={14} className="text-white" />
                )}
                Upload File
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3.5">
              {selectedMedia.map((media) => {
                const isVideo = media.mimeType?.startsWith("video/") || media.fileUrl?.endsWith(".mp4");
                return (
                  <div
                    key={media._id}
                    className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 flex items-center justify-center shadow-xs"
                  >
                    {isVideo ? (
                      <div className="relative w-full h-full">
                        <video
                          src={media.fileUrl}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                            <Video size={16} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={media.fileUrl}
                        alt={media.original_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(media._id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                      title="Remove media"
                    >
                      <XIcon size={20} />
                    </button>
                  </div>
                );
              })}

              {/* Add more button tile */}
              <button
                type="button"
                onClick={onUploadLocal}
                disabled={isUploadingFile}
                className="aspect-square rounded-2xl border border-dashed border-slate-350 dark:border-slate-700 hover:border-primary dark:hover:border-primary flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-primary transition-all bg-slate-50/50 dark:bg-(--page-body-bg) active:scale-95 duration-200"
              >
                {isUploadingFile ? (
                  <Loader2 size={18} className="animate-spin text-primary" />
                ) : (
                  <Plus size={18} />
                )}
                <span className="text-[10px] font-semibold uppercase tracking-wider">Add More</span>
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={onBrowseLibrary}
                className="h-9 text-xs font-semibold border-slate-200 dark:border-(--card-border-color) bg-white hover:bg-slate-50 dark:bg-(--page-body-bg) dark:hover:bg-(--table-hover) gap-2 rounded-lg text-slate-600 dark:text-slate-300"
              >
                <ImageIcon size={13} className="text-slate-400" />
                Library
              </Button>
            </div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleLocalFileSelect}
          accept={
            ["video", "videos", "reels", "reel", "shorts", "short"].includes(selectedContentType?.toLowerCase() || "")
              ? "video/*"
              : ["post", "posts", "feed"].includes(selectedContentType?.toLowerCase() || "")
                ? "image/*"
                : "image/*,video/*"
          }
        />
      </div>
    </div>
  );
}
