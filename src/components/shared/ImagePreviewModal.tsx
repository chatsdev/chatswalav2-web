"use client";

import { Button } from "@/src/elements/ui/button";
import { useAppDispatch } from "@/src/redux/hooks";
import { closePreview, setCurrentIndex } from "@/src/redux/reducers/previewSlice";
import { RootState } from "@/src/redux/store";
import { getResolvedImageUrl } from "@/src/utils/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Keyboard, Navigation, Zoom } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const ImagePreviewModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, images, currentIndex } = useSelector((state: RootState) => state.preview);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [swiper, setSwiper] = useState<any>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(closePreview());
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  const handleDownload = async () => {
    const img = images[currentIndex];
    const url = getResolvedImageUrl(img);

    // Extract filename safely
    let fileName = `image-${currentIndex + 1}`;
    try {
      const urlObj = new URL(url);
      const pathName = urlObj.pathname;
      fileName = pathName.split("/").pop() || fileName;
    } catch {
      fileName = url.split("/").pop() || fileName;
    }

    // Remove query parameters and ensure it's a clean filename
    fileName = fileName.split("?")[0];
    if (!fileName.includes(".")) {
      fileName += ".png";
    }

    // Helper to perform a direct link download
    const forceDirectDownload = (linkUrl: string) => {
      const link = document.createElement("a");
      link.href = linkUrl;
      link.target = "_blank";
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    try {
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.warn("CORS or network error during download, falling back to direct link.", error);
      forceDirectDownload(url);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-1000 flex items-center justify-center bg-black/95 backdrop-blur-sm" onClick={() => dispatch(closePreview())}>
        {/* Toolbar */}
        <div className="absolute top-0 inset-x-0 h-16 flex items-center justify-between px-6 z-1001 bg-linear-to-b from-black/50 to-transparent" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-4 text-white font-medium">
            <span className="bg-white/10 px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button className="p-2! h-[unset]! hover:bg-white/10 bg-[unset]! rounded-full text-white transition-colors" onClick={handleDownload} title="Download">
              <Download size={22} />
            </Button>
            <Button className="p-2! h-[unset]! hover:bg-white/10 bg-[unset]! rounded-full text-white transition-colors ml-4" onClick={() => dispatch(closePreview())} title="Close">
              <X size={28} />
            </Button>
          </div>
        </div>

        {/* Previous Button */}
        {images.length > 1 && (
          <Button
            className="absolute left-6 z-1001 bg-[unset]! h-[unset]! p-2! text-white hover:bg-white/10 rounded-full transition-all group"
            onClick={(e) => {
              e.stopPropagation();
              swiper?.slidePrev();
            }}
          >
            <ChevronLeft size={48} className="group-hover:-translate-x-1 transition-transform" />
          </Button>
        )}

        {/* Slider */}
        <div className="w-full h-full p-3 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Swiper modules={[Navigation, Zoom, Keyboard]} zoom={true} keyboard={{ enabled: true }} initialSlide={currentIndex} onSwiper={setSwiper} onSlideChange={(s) => dispatch(setCurrentIndex(s.activeIndex))} className="w-full h-full">
            {images.map((img, idx) => (
              <SwiperSlide key={idx} className="flex! items-center! justify-center">
                <div className="swiper-zoom-container">
                  <motion.img initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} src={getResolvedImageUrl(img)} alt={`Preview ${idx + 1}`} className=" object-cover w-full h-screen shadow-2xl rounded-sm" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <Button
            className="absolute right-6 z-1001 bg-[unset]! h-[unset]! p-2! text-white hover:bg-white/10 rounded-full transition-all group"
            onClick={(e) => {
              e.stopPropagation();
              swiper?.slideNext();
            }}
          >
            <ChevronRight size={48} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        )}

        {/* Thumbnails (Optional hint) */}
        {images.length > 1 && (
          <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2 z-1001">
            {images.map((_, idx) => (
              <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-white/30"}`} />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ImagePreviewModal;
