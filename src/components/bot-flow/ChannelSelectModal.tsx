/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { options } from "@/src/data/botFlow";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/elements/ui/alert-dialog";
import { Button } from "@/src/elements/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/elements/ui/tooltip";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";
import { cn } from "@/src/lib/utils";
import { useGetConnectedChannelsQuery } from "@/src/redux/api/channelsApi";
import { useAppSelector } from "@/src/redux/hooks";
import { ChannelSelectModalProps } from "@/src/types/botFlow";
import {
  ArrowLeft,
  Check,
  Lock
} from "lucide-react";
import { useState } from "react";

export default function ChannelSelectModal({
  isOpen,
  onSelect,
  onBack,
}: ChannelSelectModalProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const { getEnabledChannels, isFeatureEnabled, isLoading } =
    useFeatureAccess();
  const enabled = getEnabledChannels();
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);

  const { data: channelsData } = useGetConnectedChannelsQuery(
    { workspace_id: selectedWorkspace?._id },
    { skip: !selectedWorkspace?._id },
  );

  const isWabaConnected = !!selectedWorkspace?.waba_id;
  const isTelegramConnected = !!channelsData?.data?.find(
    (c: any) => c.platform === "telegram",
  );
  const isFacebookConnected = !!channelsData?.data?.find(
    (c: any) => c.platform === "facebook",
  );
  const isInstagramConnected = !!channelsData?.data?.find(
    (c: any) => c.platform === "instagram",
  );

  const connectedChannelsCount = [
    isWabaConnected,
    isTelegramConnected,
    isFacebookConnected,
    isInstagramConnected,
  ].filter(Boolean).length;

  const isChannelConnected = (id: string) => {
    if (id === "whatsapp") return isWabaConnected;
    if (id === "telegram") return isTelegramConnected;
    if (id === "facebook") return isFacebookConnected;
    if (id === "instagram") return isInstagramConnected;
    if (id === "all") return connectedChannelsCount > 1;
    return false;
  };

  options.filter((opt) => {
    if (opt.id === "whatsapp") return true;
    if (opt.id === "facebook")
      return enabled.facebook && isFeatureEnabled("fb_automation");
    if (opt.id === "instagram")
      return enabled.instagram && isFeatureEnabled("ig_automation");
    if (opt.id === "telegram")
      return enabled.telegram && isFeatureEnabled("tg_automation");
    if (opt.id === "all") {
      // Only show All Channels if there is at least one omnichannel platform with automation enabled
      return (
        (enabled.facebook && isFeatureEnabled("fb_automation")) ||
        (enabled.instagram && isFeatureEnabled("ig_automation")) ||
        (enabled.telegram && isFeatureEnabled("tg_automation"))
      );
    }
    return true;
  });

  const handleSelect = (platform: string) => {
    setSelected(platform);
    // Add a slight delay for beautiful selection feedback transition before closing
    setTimeout(() => {
      onSelect(platform);
    }, 300);
  };

  if (isLoading) return null;

  return (
    <AlertDialog open={isOpen}>
      <TooltipProvider>
        <AlertDialogContent className="sm:max-w-3xl! max-w-[calc(100%-2rem)]! gap-0! border-none max-h-[90vh]! overflow-y-auto bg-white dark:bg-(--card-color) no-scrollbar rounded-lg shadow-2xl sm:p-6 p-4">
          <AlertDialogHeader className="space-y-2 text-left rtl:text-right place-items-start">
            <div className="flex items-center gap-2">
              {onBack && (
                <Button
                  onClick={onBack}
                  className="p-1.5 -ml-1.5 bg-[unset] rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors outline-none focus:ring-2 focus:ring-indigo-500/50"
                  aria-label="Go back"
                >
                  <ArrowLeft
                    size={20}
                    className="text-gray-600 dark:text-gray-300"
                  />
                </Button>
              )}
              <AlertDialogTitle className="text-xl mb-0! font-bold text-gray-900 dark:text-gray-100 tracking-tight bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">
                Choose Automation Channel
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-gray-500 text-sm dark:text-gray-400">
              Select the primary messaging platform for this flow. Your toolkit
              and message options will adapt beautifully to your selected
              channel.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="sm:mt-8 mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {options.map((option) => {
              const isSelected = selected === option.id;
              const connected = isChannelConnected(option.id);

              const button = (
                <Button variant="unstyled"
                  key={option.id}
                  disabled={!connected}
                  onClick={() => {
                    if (connected) handleSelect(option.id);
                  }}
                  className={cn(
                    "group relative flex flex-col text-left rounded-lg sm:p-5 p-4 border transition-all duration-300 outline-none select-none overflow-hidden",
                    !connected
                      ? "bg-slate-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 opacity-50 cursor-not-allowed"
                      : isSelected
                        ? "border-indigo-600 dark:border-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/20"
                        : `bg-white dark:bg-(--page-body-bg) border-gray-200 dark:border-(--card-border-color) ${option.borderHover}`,
                  )}
                  style={{
                    boxShadow: isSelected
                      ? `0 10px 25px -5px ${option.glowColor}`
                      : undefined,
                  }}
                >
                  {/* Background Brand Color Glow Effect */}
                  {connected && (
                    <div
                      className="absolute -right-16 -top-16 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300 blur-2xl pointer-events-none"
                      style={{ backgroundColor: option.glowColor }}
                    />
                  )}

                  <div className="flex items-center justify-between w-full mb-4">
                    {/* Premium Brand Icon Container */}
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl shadow-md transition-all duration-300",
                        connected
                          ? `bg-gradient-to-br group-hover:scale-110 ${option.gradient}`
                          : "bg-gray-300 dark:bg-gray-700",
                      )}
                    >
                      {option.icon}
                    </div>

                    {/* Selection Mark */}
                    {isSelected && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 dark:bg-indigo-500 text-white animate-scaleIn">
                        <Check size={14} className="stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <h3
                    className={cn(
                      "text-lg font-bold text-left rtl:text-right transition-colors duration-300",
                      !connected
                        ? "text-gray-400 dark:text-gray-500"
                        : isSelected
                          ? "text-indigo-600 dark:text-indigo-400"
                          : `text-gray-900 dark:text-gray-100 ${option.textHover}`,
                    )}
                  >
                    {option.name}
                  </h3>
                  <p
                    className={cn(
                      "mt-2 text-xs md:text-sm text-left rtl:text-right leading-relaxed font-normal",
                      !connected
                        ? "text-gray-400 dark:text-gray-500"
                        : "text-gray-500 dark:text-gray-400",
                    )}
                  >
                    {option.description}
                  </p>
                </Button>
              );

              if (!connected) {
                return (
                  <Tooltip key={option.id}>
                    <TooltipTrigger asChild>
                      <div className="h-full flex">{button}</div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      sideOffset={8}
                      className="bg-slate-800 text-white border-none shadow-xl z-[9999] px-3 py-2 rounded-lg max-w-[220px]"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Lock className="h-3.5 w-3.5 text-amber-400" />
                        <p className="text-xs font-bold tracking-wide">
                          {option.id === "all"
                            ? "More Channels Required"
                            : `${option.name} Required`}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        {option.id === "all"
                          ? "Connect at least 2 channels to use this."
                          : `Connect ${option.name} in integrations to unlock.`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return button;
            })}
          </div>
        </AlertDialogContent>
      </TooltipProvider>
    </AlertDialog>
  );
}
