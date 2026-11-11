/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/elements/ui/alert-dialog";
import { Button } from "@/src/elements/ui/button";
import { cn } from "@/src/lib/utils";
import { useTestAutomationFlowMutation } from "@/src/redux/api/automationApi";
import { useAppSelector } from "@/src/redux/hooks";
import { Facebook, Instagram, MessageSquare, Send, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { validMessageTypes } from "@/src/data/botFlow";
import { ChatMessage, TestFlowModalProps } from "@/src/types/botFlow";
import { ExecutionLogs } from "./ExecutionLogs";
import { KeywordHints } from "./KeywordHints";
import { PhoneSimulator } from "./PhoneSimulator";

export default function TestFlowModal({
  isOpen,
  onClose,
  flowId,
  flowName,
  platform,
  getUnsavedFlowPayload,
}: TestFlowModalProps) {
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeListSheet, setActiveListSheet] = useState<ChatMessage | null>(
    null,
  );
  const [executionLogs, setExecutionLogs] = useState<any[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const [testFlow, { isLoading: isTesting }] = useTestAutomationFlowMutation();

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Load initial messages and reset execution status on backend
  useEffect(() => {
    if (isOpen) {
      handleReset(true);
    }
  }, [isOpen]);

  const handleReset = async (silent = false) => {
    setMessages([
      {
        id: "welcome",
        sender: "system",
        text: "Simulator ready. Type a trigger keyword (e.g., 'start') to test your automation.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setExecutionLogs([]);
    setInputText("");
    setActiveListSheet(null);

    try {
      await testFlow({
        flowId: flowId || "new",
        test_data: { reset: true },
        unsaved_flow: getUnsavedFlowPayload(),
        workspace_id: selectedWorkspace?._id,
      }).unwrap();

      if (!silent) {
        toast.success("Simulator reset successfully.");
      }
    } catch (err: any) {
      console.error("Failed to reset simulator:", err);
      if (!silent) {
        toast.error("Failed to reset simulator state.");
      }
    }
  };

  const executeSendMessage = async (text: string, interactiveId?: string) => {
    if (!text.trim() && !interactiveId) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);
    setActiveListSheet(null);

    try {
      const payload = getUnsavedFlowPayload();
      const response = await testFlow({
        flowId: flowId || "new",
        test_data: {
          message: text,
          interactive_id: interactiveId,
          messageType: interactiveId ? "interactive" : "text",
        },
        unsaved_flow: payload,
        workspace_id: selectedWorkspace?._id,
      }).unwrap();

      setIsTyping(false);

      if (response.success && response.data) {
        const data = response.data;

        // Append execution logs
        if (data.executionLog && Array.isArray(data.executionLog)) {
          setExecutionLogs((prev) => {
            const combined = [...prev, ...data.executionLog];
            // Remove duplicates
            return combined.filter(
              (v, i, a) =>
                a.findIndex(
                  (t) =>
                    t.node_id === v.node_id && t.start_time === v.start_time,
                ) === i,
            );
          });
        }

        if (data.triggered === false) {
          setMessages((prev) => [
            ...prev,
            {
              id: `system-fail-${Date.now()}`,
              sender: "system",
              text: "No triggers matched your message. Try typing a trigger keyword.",
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
          return;
        }

        const responses =
          data.output?.test_responses || data.test_responses || [];
        if (responses.length === 0) {
          return;
        }

        // Process responses sequentially to respect delays and look natural
        const processResponses = async () => {
          for (let i = 0; i < responses.length; i++) {
            const resp = responses[i];

            if (resp.type === "delay") {
              // Backend recorded a Wait Timer node, simulate the wait
              await new Promise((resolve) =>
                setTimeout(resolve, resp.delay_ms || 1000),
              );
              continue;
            }

            let isSystemMessage = false;
            let systemText = "";

            if (!validMessageTypes.includes(resp.type)) {
              isSystemMessage = true;
              switch (resp.type) {
                case "assign_agent":
                case "assign_random_agent":
                  systemText = "Agent assigned";
                  break;
                case "add_tag":
                  systemText = `Tag added${resp.tag_name ? ": " + resp.tag_name : ""}`;
                  break;
                case "remove_tag":
                  systemText = "Tag removed";
                  break;
                case "update_contact":
                  systemText = "Contact updated";
                  break;
                case "move_to_pipeline_stage":
                  systemText = `Moved to Pipeline Stage`;
                  break;
                case "add_to_segment":
                  systemText = "Added to segment";
                  break;
                case "save_to_google_sheet":
                  systemText = "Saved to Google Sheet";
                  break;
                case "create_calendar_event":
                  systemText = "Calendar event created";
                  break;
                case "create_google_meet":
                  systemText = "Google Meet created";
                  break;
                case "assign_chatbot":
                  systemText = "Chatbot assigned";
                  break;
                case "webhook":
                case "api":
                  systemText = "API/Webhook triggered";
                  break;
                case "response_saver":
                  systemText = "Response saved";
                  break;
                case "send_sequence":
                  systemText = "Sequence triggered";
                  break;
                case "appointment_flow":
                  systemText = "Appointment flow started";
                  break;
                case "custom":
                  systemText = "Custom logic executed";
                  break;
                default:
                  continue;
              }
            }

            await new Promise((resolve) =>
              setTimeout(resolve, isSystemMessage ? 200 : 600),
            );

            if (isSystemMessage) {
              setMessages((prev) => [
                ...prev,
                {
                  id: `sys-${Date.now()}-${i}`,
                  sender: "system",
                  text: systemText,
                  timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ]);
              continue;
            }

            const params = resp.messageParams || {};

            // Fallback for cases where backend missed messageParams
            const textToRender =
              params.messageText || resp.message || resp.text || "";
            const mediaUrlToRender = params.mediaUrl || resp.mediaUrl;
            const buttonsToRender = params.buttonParams || params.buttons;

            // Skip empty messages if somehow still no content
            if (
              !textToRender &&
              !mediaUrlToRender &&
              !buttonsToRender &&
              !params.locationParams &&
              !params.listParams
            ) {
              continue;
            }

            const botMsg: ChatMessage = {
              id: `bot-${Date.now()}-${i}`,
              sender: "bot",
              text: textToRender,
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              messageType: params.messageType || resp.type,
              mediaUrl: mediaUrlToRender,
              buttons: buttonsToRender,
              listParams: params.listParams,
              locationParams: params.locationParams,
            };
            setMessages((prev) => [...prev, botMsg]);
          }
        };

        processResponses();
      } else {
        toast.error("Failed to get response from flow engine.");
      }
    } catch (err: any) {
      setIsTyping(false);
      toast.error(err?.data?.message || "Error simulating automation flow.");
      console.error(err);
    }
  };

  const pDetails = useMemo(() => {
    switch (platform) {
      case "telegram":
        return {
          name: "Telegram Bot",
          color: "bg-[#229ED9]",
          icon: <Send size={14} className="text-white" />,
          avatarColor: "bg-sky-500",
          userBubbleColor: "bg-sky-500 dark:bg-sky-600 text-white",
        };
      case "facebook":
        return {
          name: "Messenger",
          color: "bg-blue-600",
          icon: <Facebook size={14} className="text-white" />,
          avatarColor: "bg-blue-600",
          userBubbleColor: "bg-blue-600 dark:bg-blue-700 text-white",
        };
      case "instagram":
        return {
          name: "Instagram",
          color: "bg-pink-600",
          icon: <Instagram size={14} className="text-white" />,
          avatarColor: "bg-rose-600",
          userBubbleColor: "bg-pink-500 dark:bg-pink-600 text-white",
        };
      default:
        return {
          name: "WhatsApp",
          color: "bg-primary",
          icon: <MessageSquare size={14} className="text-white" />,
          avatarColor: "bg-primary",
          userBubbleColor:
            "bg-[#e2f7cb] dark:bg-primary-darker text-gray-800 dark:text-gray-100",
        };
    }
  }, [platform]);

  const triggerKeywords = useMemo(() => {
    const unsavedFlow = getUnsavedFlowPayload();
    let keywords: string[] = [];

    // 1. Extract from standard triggers
    if (unsavedFlow.triggers && Array.isArray(unsavedFlow.triggers)) {
      unsavedFlow.triggers.forEach((t: any) => {
        if (
          t.conditions?.operator === "contains_any" ||
          t.conditions?.operator === "equals" ||
          t.conditions?.operator === "contains"
        ) {
          const vals = Array.isArray(t.conditions.value)
            ? t.conditions.value
            : [t.conditions.value];
          keywords = [...keywords, ...vals];
        }
      });
    }

    // 2. Extract from logic control (condition) nodes
    if (unsavedFlow.nodes && Array.isArray(unsavedFlow.nodes)) {
      unsavedFlow.nodes
        .filter((n: any) => n.type === "condition")
        .forEach((n: any) => {
          const params = n.parameters || {};

          // Handle array of condition rules
          if (Array.isArray(params.conditions)) {
            params.conditions.forEach((c: any) => {
              if (
                c.operator === "contains_any" ||
                c.operator === "equals" ||
                c.operator === "contains"
              ) {
                const vals = Array.isArray(c.value) ? c.value : [c.value];
                keywords = [...keywords, ...vals];
              }
            });
          }

          // Handle single condition rule
          if (params.condition) {
            const c = params.condition;
            if (
              c.operator === "contains_any" ||
              c.operator === "equals" ||
              c.operator === "contains"
            ) {
              const vals = Array.isArray(c.value) ? c.value : [c.value];
              keywords = [...keywords, ...vals];
            }
          }
        });
    }

    return Array.from(
      new Set(
        keywords.filter(
          (kw: string) => kw && typeof kw === "string" && !kw.includes("___"),
        ),
      ),
    );
  }, [getUnsavedFlowPayload]);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="sm:max-w-5xl! max-w-[calc(100%-2rem)]! gap-0! border-none p-0! overflow-auto bg-slate-50 dark:bg-(--card-color) rounded-lg shadow-2xl flex flex-col md:flex-row max-h-[90vh] no-scrollbar">
        {/* Left Side: Instructions & Execution Logs */}
        <div className="w-full md:flex-1 sm:p-6 p-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-(--card-border-color) flex flex-col justify-between md:overflow-y-auto bg-white no-scrollbar dark:bg-(--card-color) md:max-w-lg shrink-0">
          <div className="space-y-6">
            <div>
              <AlertDialogHeader className="text-left rtl:text-right place-items-start">
                <div className="flex items-center justify-between w-full text-left rtl:text-right">
                  <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded-lg", pDetails.color)}>
                      {pDetails.icon}
                    </div>
                    <AlertDialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white text-left rtl:text-right">
                      Test Flow: {flowName}
                    </AlertDialogTitle>
                  </div>
                  <Button variant="unstyled"
                    onClick={onClose}
                    className="p-1.5 md:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    <X size={20} />
                  </Button>
                </div>
                <AlertDialogDescription className="text-slate-500 dark:text-slate-200 text-sm mt-1.5 text-left rtl:text-right">
                  Simulate client-side interactions. Sending keyword triggers or
                  selecting button options will run the flow logic in real-time.
                </AlertDialogDescription>
              </AlertDialogHeader>
            </div>

            {/* Keyword Hints */}
            <KeywordHints
              triggerKeywords={triggerKeywords}
              onKeywordClick={(kw) => executeSendMessage(kw)}
            />

            {/* Live Node Execution Logs */}
            <ExecutionLogs executionLogs={executionLogs} />
          </div>

          <div className="hidden md:flex pt-4">
            <Button
              variant="outline"
              className="w-full justify-center gap-2 text-xs"
              onClick={onClose}
            >
              <X size={14} /> Close Simulator
            </Button>
          </div>
        </div>

        {/* Right Side: Phone Simulator View */}
        <div className="w-full md:flex-1 bg-slate-100 dark:bg-(--card-color) flex items-center justify-center p-4 sm:p-6 relative md:h-full min-h-[600px] md:min-h-0 shrink-0">
          {/* Close button for Desktop */}
          <Button variant="unstyled"
            onClick={onClose}
            className="absolute top-4 right-4 rtl:right-[unset] rtl:left-4 hidden md:block p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors z-50"
          >
            <X size={24} />
          </Button>

          {/* Realistic iPhone mockup frame */}
          <PhoneSimulator
            messages={messages}
            isTyping={isTyping}
            inputText={inputText}
            setInputText={setInputText}
            activeListSheet={activeListSheet}
            setActiveListSheet={setActiveListSheet}
            executeSendMessage={executeSendMessage}
            isTesting={isTesting}
            handleReset={handleReset}
            pDetails={pDetails}
            chatEndRef={chatEndRef}
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
