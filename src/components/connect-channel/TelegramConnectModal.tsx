/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { useConnectChannelMutation } from "@/src/redux/api/channelsApi";
import { TelegramConnectModalProps } from "@/src/types/channel";
import { Info, Loader2, Send } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export const TelegramConnectModal: React.FC<TelegramConnectModalProps> = ({
  isOpen,
  onOpenChange,
  workspaceId,
  onSuccess,
}) => {
  const [botToken, setBotToken] = useState("");
  const [connectChannel, { isLoading: isConnectingTelegram }] =
    useConnectChannelMutation();

  const handleConnectTelegram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!botToken.trim()) {
      toast.error("Please enter a valid Bot Token");
      return;
    }

    try {
      const response = await connectChannel({
        platform: "telegram",
        workspace_id: workspaceId,
        bot_token: botToken.trim(),
      }).unwrap();

      if (response.success) {
        toast.success(
          response.message || "Telegram Bot connected successfully!",
        );
        onOpenChange(false);
        setBotToken("");
        onSuccess();
      } else {
        toast.error(response.error || "Failed to connect Telegram Bot");
      }
    } catch (err: any) {
      toast.error(
        err?.data?.error || "Failed to validate or connect Telegram Bot",
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! max-h-[90vh] overflow-auto no-scrollbar dark:bg-(--card-color) dark:border-(--card-border-color) rounded-lg shadow-2xl p-0!">
        <form onSubmit={handleConnectTelegram} className="flex flex-col">
          <div className="p-4 sm:p-6 space-y-6">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                <div className="p-1.5 bg-[#229ED9]/10 rounded-lg">
                  <Send className="w-7 h-7 text-[#229ED9]" />
                </div>
                Connect Telegram Bot
              </DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-gray-400 text-sm">
                Enter your HTTP API bot token to configure custom webhook events
                and start handling Telegram chats.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2.5">
              <Label
                htmlFor="bot_token"
                className="text-sm font-bold text-slate-800 dark:text-slate-200"
              >
                Bot Token <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bot_token"
                placeholder="e.g. 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                required
                className="h-10 px-4 rounded-lg border border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--page-body-bg) focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm font-medium"
              />
            </div>

            {/* Info / Setup Instruction Card */}
            <div className="bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border border-slate-100 dark:border-(--card-border-color) sm:p-5 p-4 space-y-4 shadow-inner">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#229ED9] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                    How to get a Bot Token?
                  </span>
                  <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
                    Follow these quick steps on Telegram to obtain your HTTP API
                    bot credential:
                  </p>
                </div>
              </div>

              <ol className="text-xs text-slate-500 dark:text-gray-400 space-y-2.5 list-decimal list-inside pl-1 leading-relaxed font-medium">
                <li>
                  Open Telegram and search for the verified{" "}
                  <a
                    href="https://t.me/BotFather"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-bold inline-flex items-center gap-0.5"
                  >
                    @BotFather
                  </a>{" "}
                  account.
                </li>
                <li>
                  Send the command{" "}
                  <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-(--dark-body) rounded font-semibold text-slate-800 dark:text-slate-100 font-mono text-[11px]">
                    /newbot
                  </code>{" "}
                  and select a display name and unique username.
                </li>
                <li>
                  Copy the generated **HTTP API Token** and paste it in the
                  field above.
                </li>
              </ol>
            </div>
          </div>

          <DialogFooter className="sm:px-6 flex-row px-4 py-4 bg-slate-50 dark:bg-(--card-color) border-t border-slate-100 dark:border-(--card-border-color) flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 px-4.5! py-5 font-bold border-slate-200 dark:border-(--card-border-color) text-slate-500 dark:text-slate-400 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isConnectingTelegram}
              className="h-11 px-4.5! py-5 font-bold bg-[#229ED9] hover:bg-[#1f93cb] text-white rounded-lg shadow-lg shadow-blue-500/10 active:scale-95 flex items-center gap-2"
            >
              {isConnectingTelegram ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Connecting...
                </>
              ) : (
                <>Connect Bot</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
