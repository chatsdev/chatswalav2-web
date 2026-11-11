"use client";

import { useAppSelector } from "@/src/redux/hooks";
import { AnimatePresence, motion } from "framer-motion";

const Loading = () => {
  const { app_name, app_loader, isSettingsLoaded } = useAppSelector((state) => state.setting);
  
  if (!isSettingsLoaded) {
    return (
      <div className="fixed inset-0 z-100 bg-white dark:bg-dark-body flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 z-100 bg-sidebar dark:bg-dark-body flex items-center justify-center font-sans overflow-hidden">
      <AnimatePresence>
        <motion.div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-1">
            <motion.h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {app_name}
              <span className="text-primary italic">.</span>
            </motion.h1>
            <motion.p className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-400 dark:text-slate-500 pl-1">{app_loader || "One and only"} {app_name}</motion.p>
          </div>

          <div className="relative w-40 h-0.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
            <motion.div
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-0 left-0 w-1/3 h-full bg-primary shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Loading;
