import React from "react";
import {
  RotateCcw,
  Send,
  CheckCheck,
  MapPin,
  List,
  Wifi,
  Battery,
  User,
  X,
} from "lucide-react";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { cn } from "@/src/lib/utils";
import { PhoneSimulatorProps } from "@/src/types/botFlow";
import Image from "next/image";



export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  messages,
  isTyping,
  inputText,
  setInputText,
  activeListSheet,
  setActiveListSheet,
  executeSendMessage,
  isTesting,
  handleReset,
  pDetails,
  chatEndRef,
}) => {
  return (
    <div className="w-full max-w-[340px] h-[600px] max-h-full bg-slate-900 border-[8px] sm:border-[10px] border-slate-800 dark:border-(--card-border-color) rounded-[36px] shadow-2xl relative flex flex-col overflow-hidden ring-1 ring-slate-700/50 dark:ring-(--card-border-color)">
      {/* Top Ear Piece / Dynamic Island */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-50 flex items-center justify-between px-3">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
        <span className="w-8 h-1 bg-slate-800 rounded-full" />
      </div>

      {/* Top Status Bar */}
      <div className="h-9 bg-slate-900 text-white flex items-center justify-between px-6 text-[10px] font-bold select-none shrink-0 pt-2 z-40">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <Wifi size={10} />
          <Battery size={12} className="rotate-0" />
        </div>
      </div>

      {/* Chat Simulator Application */}
      <div className="flex-1 flex flex-col bg-[#f0f2f5] dark:bg-[#0b141a] relative overflow-hidden">
        {/* Chat Header */}
        <div className={cn("px-4 py-2 text-white flex items-center justify-between shrink-0 shadow-sm z-30", pDetails.color)}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              <User size={18} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold leading-tight">{pDetails.name} Sandbox</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[9px] opacity-80 font-medium">online</span>
              </div>
            </div>
          </div>

          <Button variant="unstyled"
            onClick={() => handleReset(false)}
            disabled={isTesting}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors active:scale-90"
            title="Reset Simulator"
          >
            <RotateCcw size={14} className={cn(isTesting && "animate-spin")} />
          </Button>
        </div>

        {/* Chat Message Box Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar pb-6">
          {messages.map((msg) => {
            if (msg.sender === "system") {
              return (
                <div key={msg.id} className="flex justify-center my-2 select-none">
                  <span className="text-xs bg-slate-500/10 dark:bg-white/5 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-md text-center max-w-[85%] leading-normal font-medium border border-slate-200/50 dark:border-slate-800/40">
                    {msg.text}
                  </span>
                </div>
              );
            }

            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex w-full flex-col",
                  isUser ? "items-end" : "items-start"
                )}
              >
                {/* Message Bubble */}
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl px-3 py-2 text-xs shadow-sm relative group",
                    isUser
                      ? cn("rounded-tr-none", pDetails.userBubbleColor)
                      : "bg-white dark:bg-[#1f2c34] text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/50 dark:border-none"
                  )}
                >
                  {/* Media Handler (Image, etc) */}
                  {msg.mediaUrl && (
                    <div className="mb-2 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/30">
                      <Image unoptimized width={1000} height={1000}
                        src={msg.mediaUrl}
                        alt="Media Attach"
                        className="w-full h-auto max-h-[140px] object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <div className="p-1.5 text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                        <span className="underline truncate font-mono">{msg.mediaUrl.split("/").pop()}</span>
                      </div>
                    </div>
                  )}

                  {/* Location Handler */}
                  {msg.locationParams && (
                    <div className="mb-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-primary text-[11px] font-bold">
                        <MapPin size={12} />
                        <span>{msg.locationParams.name || "Location Shared"}</span>
                      </div>
                      {msg.locationParams.address && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                          {msg.locationParams.address}
                        </p>
                      )}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${msg.locationParams.latitude},${msg.locationParams.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] text-blue-500 hover:underline mt-1 font-bold"
                      >
                        Open in Maps ({msg.locationParams.latitude.toFixed(4)}, {msg.locationParams.longitude.toFixed(4)})
                      </a>
                    </div>
                  )}

                  {/* Message text body */}
                  {msg.text && (
                    <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                  )}

                  {/* Time stamp */}
                  <div className="flex items-center justify-end gap-1 mt-1 text-[8px] opacity-65">
                    <span>{msg.timestamp}</span>
                    {isUser && <CheckCheck size={10} className="text-sky-500 dark:text-sky-400" />}
                  </div>
                </div>

                {/* Interactive Buttons underneath message */}
                {msg.buttons && msg.buttons.length > 0 && (
                  <div className="mt-1.5 flex flex-col gap-1 w-[80%] max-w-[85%] self-start animate-scaleIn">
                    {msg.buttons.map((btn) => (
                      <Button variant="unstyled"
                        key={btn.id}
                        onClick={() => executeSendMessage(btn.title, btn.id)}
                        className="w-full text-center bg-white dark:bg-[#1f2c34] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 py-2 px-3 rounded-lg text-primary text-xs font-bold transition-all shadow-sm active:scale-98 cursor-pointer"
                      >
                        <span className="truncate block w-full">{btn.title}</span>
                      </Button>
                    ))}
                  </div>
                )}

                {/* Interactive List Menus */}
                {msg.listParams && (
                  <div className="mt-1.5 w-[80%] max-w-[85%] self-start animate-scaleIn">
                    <Button
                      onClick={() => setActiveListSheet(msg)}
                      className="w-full flex items-center justify-center gap-1.5 bg-white dark:bg-[#1f2c34] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 py-2.5 px-4 rounded-lg text-primary text-xs font-bold transition-all shadow-sm active:scale-98 cursor-pointer"
                    >
                      <List className="shrink-0" size={14} />
                      <span className="truncate min-w-0">
                        {msg.listParams.buttonTitle || "View Options"}
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Bot Typing Simulator */}
          {isTyping && (
            <div className="flex w-full justify-start items-start animate-pulse">
              <div className="bg-white dark:bg-[#1f2c34] text-slate-800 dark:text-slate-100 rounded-xl rounded-tl-none px-4 py-2.5 text-xs shadow-sm border border-slate-200/50 dark:border-none">
                <div className="flex items-center gap-1 h-3">
                  <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-200" />
                  <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* List Message Options Bottom Sheet overlay inside phone view */}
        {activeListSheet && activeListSheet.listParams && (
          <div className="absolute inset-0 bg-black/40 z-40 flex flex-col justify-end animate-fadeIn">
            <div className="bg-white dark:bg-[#1f2c34] rounded-t-2xl max-h-[70%] flex flex-col overflow-hidden animate-slideUp">
              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-[#182229]">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {activeListSheet.listParams.buttonTitle || "Select Option"}
                </span>
                <Button variant="unstyled"
                  onClick={() => setActiveListSheet(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={16} />
                </Button>
              </div>

              {/* List Items scroll list */}
              <div className="overflow-y-auto p-2 space-y-1">
                {activeListSheet.listParams.items?.map((item) => (
                  <Button variant="unstyled"
                    key={item.id}
                    onClick={() => executeSendMessage(item.title, item.id)}
                    className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-[#182229] border-b border-slate-50 dark:border-slate-800/50 flex flex-col transition-all cursor-pointer"
                  >
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</span>
                    {item.description && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">
                        {item.description}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat Input form footer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeSendMessage(inputText);
          }}
          className="p-2 bg-[#f0f2f5] dark:bg-[#111b21] flex items-center gap-1.5 border-t border-slate-200 dark:border-slate-800 shrink-0"
        >
          <Input
            value={inputText}
            disabled={isTyping}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white dark:bg-[#2a3942] border-none text-xs rounded-xl h-9 px-3 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:bg-white focus:dark:bg-[#2a3942]"
          />

          <Button
            type="submit"
            disabled={isTyping || !inputText.trim()}
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center p-0 transition-transform active:scale-90",
              pDetails.color,
              "hover:" + pDetails.color + "/90",
              (isTyping || !inputText.trim()) && "opacity-50 cursor-not-allowed"
            )}
          >
            <Send size={14} className="text-white" />
          </Button>
        </form>
      </div>

      {/* Bottom Swipe indicator line */}
      <div className="h-4 bg-slate-900 flex items-center justify-center shrink-0 pb-1.5 select-none z-40">
        <div className="w-24 h-1 bg-white/40 rounded-full" />
      </div>
    </div>
  );
};
