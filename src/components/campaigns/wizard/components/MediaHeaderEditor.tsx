import { useState } from "react";
import { CloudUpload, X, Info } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import MediaSelectionModal from "../../../chat/MediaSelectionModal";
import { Attachment } from "@/src/types/components";

export const MediaHeaderEditor = ({
  mediaUrl,
  mediaFile,
  onChange,
  mediaType,
}: {
  mediaUrl: string;
  mediaFile?: File;
  onChange: (val: { link: string; localFile?: File }) => void;
  mediaType?: string;
}) => {
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const isVideo = !!(
    mediaUrl.match(/\.(mp4|webm|ogg|mov)$/i) ||
    mediaFile?.type.startsWith("video/")
  );

  const handleMediaSelect = (selectedMedia: Attachment[]) => {
    if (selectedMedia.length > 0) {
      const media = selectedMedia[0];
      if (media.fileUrl) {
        onChange({ link: media.fileUrl, localFile: media.localFile });
        toast.success("Header media selected successfully");
      }
    }
  };

  const handleClearMedia = () => {
    onChange({ link: "", localFile: undefined });
  };

  return (
    <div className="space-y-3">
      {mediaType && (
        <div className="text-[11px] font-semibold text-primary dark:text-primary-light bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-lg p-2.5 flex items-start gap-2 shadow-xs">
          <Info size={14} className="text-primary mt-0.5 shrink-0" />
          <span>
            Note: This template requires you to upload {["a", "e", "i", "o", "u"].includes(mediaType.toLowerCase().charAt(0)) ? "an" : "a"} <span className="font-bold underline capitalize">{mediaType.toLowerCase()}</span> file.
          </span>
        </div>
      )}

      {mediaUrl ? (
        <div className="relative rounded-xl border border-slate-200 dark:border-(--card-border-color) overflow-hidden bg-slate-50 dark:bg-(--dark-body)">
          <div className="flex items-center gap-3 p-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
              {isVideo ? (
                <video src={mediaUrl} className="w-full h-full object-cover" muted />
              ) : (
                <Image
                  src={mediaUrl}
                  alt="Header Preview"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate">
                {mediaFile ? "Local File Selected" : "Media Library Selected"}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{mediaUrl.substring(0, 60)}...</p>
            </div>
            <Button
              type="button"
              onClick={handleClearMedia}
              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-rose-400 hover:text-rose-600 transition-colors shrink-0"
            >
              <X size={14} />
            </Button>
          </div>
          <div className="px-3 pb-3">
            <Button
              type="button"
              onClick={() => setIsMediaModalOpen(true)}
              className="w-full text-xs font-bold text-primary hover:text-primary/80 transition-colors py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10"
            >
              Replace Media
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--dark-body) p-6 cursor-pointer transition-colors hover:border-primary/40 hover:bg-primary/5"
          onClick={() => setIsMediaModalOpen(true)}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <CloudUpload size={20} className="text-primary" />
          </div>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Select media from library</p>
          <p className="text-[10px] text-slate-400">Choose from your uploaded media or upload new files</p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-slate-200 dark:bg-(--table-hover)" />
        <span className="text-[10px] font-bold text-slate-400 uppercase">or paste url</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-(--table-hover)" />
      </div>

      <Input
        placeholder="https://example.com/promo-banner.jpg"
        value={mediaUrl}
        onChange={(e) => onChange({ link: e.target.value, localFile: undefined })}
        className="h-11 bg-slate-50 dark:bg-(--dark-body) rounded-xl"
      />

      <MediaSelectionModal isOpen={isMediaModalOpen} onClose={() => setIsMediaModalOpen(false)} onSelect={handleMediaSelect} />
    </div>
  );
};
export default MediaHeaderEditor;
