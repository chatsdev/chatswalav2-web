/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { isToday, isYesterday } from "date-fns";
import { safeFormat, safeParseDate } from "../safeDate";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { chatApi, useGetRecentChatsQuery, useMarkMessageAsReadMutation } from "@/src/redux/api/chatApi";
import { socket } from "@/src/services/socket-setup";
import { ROUTES, SOCKET } from "@/src/constants";
import { ChatMessage, DateGroupedMessages, MessageGroup } from "@/src/types/components/chat";
import { useNotifications } from "./useNotifications";
import { selectChat } from "@/src/redux/reducers/messenger/chatSlice";
import { useRouter } from "next/navigation";
import { whatsappApi } from "@/src/redux/api/whatsappApi";
import { useGetWorkspacesQuery } from "@/src/redux/api/workspaceApi";
import { setWorkspace } from "@/src/redux/reducers/workspaceSlice";
import { MessageSquareWarning, AlertTriangle, X } from "lucide-react";

const groupNewMessage = (existingData: DateGroupedMessages[], newMessage: ChatMessage) => {
  let foundExisting = false;

  if (newMessage.messageType === "reaction") {
    let reactionHandled = false;
    for (const dateGroup of existingData) {
      for (const group of dateGroup.messageGroups) {
        const targetMsg = group.messages.find(m => m.id === newMessage.reaction_message_id || m.wa_message_id === newMessage.reaction_message_id);
        if (targetMsg) {
          if (!targetMsg.reactions) targetMsg.reactions = [];
          
          if (!newMessage.reaction_emoji) {
            targetMsg.reactions = targetMsg.reactions.map(r => ({
              ...r,
              users: r.users.filter(u => String(u.id) !== String(newMessage.sender.id))
            })).filter(r => r.users.length > 0);
          } else {
            let userRemoved = false;
            targetMsg.reactions = targetMsg.reactions.map(r => {
              const updatedUsers = r.users.filter(u => String(u.id) !== String(newMessage.sender.id));
              if (updatedUsers.length !== r.users.length) userRemoved = true;
              return { ...r, users: updatedUsers };
            }).filter(r => r.users.length > 0);
            
            const existingReaction = targetMsg.reactions.find(r => r.emoji === newMessage.reaction_emoji);
            if (existingReaction) {
              existingReaction.users.push(newMessage.sender);
            } else {
              targetMsg.reactions.push({
                emoji: newMessage.reaction_emoji,
                users: [newMessage.sender]
              });
            }
          }
          reactionHandled = true;
          break;
        }
      }
      if (reactionHandled) break;
    }
    return;
  }


  if (newMessage.reply_message_id && !newMessage.reply_message) {
    let foundReply = null;
    for (const dateGroup of existingData) {
      for (const group of dateGroup.messageGroups) {
        const found = group.messages.find(
          (m) => m.wa_message_id === newMessage.reply_message_id || m.id === newMessage.reply_message_id
        );
        if (found) {
          foundReply = found;
          break;
        }
      }
      if (foundReply) break;
    }
    if (foundReply) {
      newMessage.reply_message = foundReply;
    }
  }

  for (const dateGroup of existingData) {
    for (const group of dateGroup.messageGroups) {
      const idx = group.messages.findIndex((m) => {
        if (m.id === newMessage.id) return true;
        if (m.wa_message_id && newMessage.wa_message_id && m.wa_message_id === newMessage.wa_message_id) return true;

        const isTypeMatch =
          m.messageType === newMessage.messageType ||
          (m.messageType === "payment_link" && newMessage.messageType === "text") ||
          (m.messageType === "google_meet" && newMessage.messageType === "text");

        if (m.id.startsWith("temp-") && m.direction === newMessage.direction && isTypeMatch) {
          const timeDiff = Math.abs(safeParseDate(m.createdAt).getTime() - safeParseDate(newMessage.createdAt).getTime());
          if (m.messageType === "text" && newMessage.messageType === "text") {
            return m.content === newMessage.content && timeDiff < 60000;
          }
          if (m.messageType === "payment_link" || m.messageType === "google_meet") {
            return timeDiff < 60000;
          }
          return timeDiff < 60000;
        }
        return false;
      });

      if (idx !== -1) {
        const existingMessage = group.messages[idx];
        const mergedMessage = {
          ...newMessage,
          reply_message: newMessage.reply_message || existingMessage.reply_message,
          reply_message_id: newMessage.reply_message_id || existingMessage.reply_message_id || (existingMessage.reply_message ? (existingMessage.reply_message.wa_message_id || existingMessage.reply_message.id) : undefined),
        };
        group.messages[idx] = mergedMessage;
        if (group.senderId === "current-user") {
          group.senderId = newMessage.sender.id;
          group.sender = newMessage.sender;
        }
        foundExisting = true;
        break;
      }
    }
    if (foundExisting) break;
  }

  if (foundExisting) return;

  const msgDate = safeParseDate(newMessage.createdAt);
  const dateKey = safeFormat(msgDate, "yyyy-MM-dd");

  let dateGroup = existingData.find((g) => g.dateKey === dateKey);
  if (!dateGroup) {
    dateGroup = {
      dateKey,
      dateLabel: isToday(msgDate) ? "Today" : isYesterday(msgDate) ? "Yesterday" : safeFormat(msgDate, "MMMM dd, yyyy"),
      messageGroups: [],
    };
    existingData.push(dateGroup);
  }

  const lastGroup = dateGroup.messageGroups[dateGroup.messageGroups.length - 1];

  const isSameSender = lastGroup && (String(lastGroup.senderId) === String(newMessage.sender.id) || (lastGroup.senderId === "current-user" && newMessage.direction === "outbound"));

  if (isSameSender) {
    if (lastGroup.senderId === "current-user") {
      lastGroup.senderId = newMessage.sender.id;
      lastGroup.sender = newMessage.sender;
    }
    lastGroup.messages.push(newMessage);
    lastGroup.lastMessageTime = newMessage.createdAt;
  } else {
    const newGroup: MessageGroup = {
      senderId: newMessage.sender.id,
      sender: newMessage.sender,
      recipient: newMessage.recipient,
      messages: [newMessage],
      createdAt: newMessage.createdAt,
      lastMessageTime: newMessage.createdAt,
    };
    dateGroup.messageGroups.push(newGroup);
  }
};

export const useSocketHandler = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [markMessageAsRead] = useMarkMessageAsReadMutation();
  const { selectedChat, selectedPhoneNumberId } = useAppSelector((state) => state.chat);
  const { userSetting } = useAppSelector((state) => state.setting);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const { sendNotification, startBlinking } = useNotifications();
  const { refetch: refetchWorkspaces } = useGetWorkspacesQuery(undefined, {
    skip: !isAuthenticated,
  });
  const router = useRouter();
  const unreadCountRef = useRef(0);

  const queries = useAppSelector((state: any) => state.api?.queries);
  const queriesRef = useRef(queries);
  useEffect(() => {
    queriesRef.current = queries;
  }, [queries]);

  const botFetchTimer1 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const botFetchTimer2 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recentChatsRef = useRef<any[]>([]);

  const { data: recentChatsData } = useGetRecentChatsQuery(
    {
      whatsapp_phone_number_id: selectedPhoneNumberId || undefined,
    },
    { skip: !selectedPhoneNumberId }
  );

  useEffect(() => {
    if (recentChatsData?.data) {
      recentChatsRef.current = recentChatsData.data;
    }
  }, [recentChatsData]);

  useEffect(() => {
    const handleFocus = () => {
      unreadCountRef.current = 0;
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const updateChatArea = useCallback(
    (newMessage: ChatMessage) => {

      const msgContactId = String(newMessage.contact_id);
      const msgSenderId = String(newMessage.sender.id);
      const msgRecipientId = String(newMessage.recipient.id);

      const activeQueries = Object.values(queriesRef.current || {});
      activeQueries.forEach((query: any) => {
        if (query?.endpointName === "getMessages" && query?.status === "fulfilled") {
          const originalArgs = query.originalArgs;
          const queryContactId = String(originalArgs.contact_id);
          const queryPhoneId = originalArgs.whatsapp_phone_number_id;
          const msgPhoneId = newMessage.whatsapp_phone_number_id;

          const matchContactId =
            queryContactId === msgContactId ||
            queryContactId === msgSenderId ||
            queryContactId === msgRecipientId;

          const matchPhone = !queryPhoneId || !msgPhoneId || String(queryPhoneId) === String(msgPhoneId);

          if (matchContactId && matchPhone) {
            dispatch(
              chatApi.util.updateQueryData("getMessages", originalArgs, (draft) => {
                if (!draft || !draft.messages) return;
                if (newMessage.messageType === "system_messages" && (newMessage.content === "Chat cleared" || (newMessage as any).messageText === "Chat cleared")) {
                  draft.messages = [];
                  return;
                }
                groupNewMessage(draft.messages, newMessage);
              })
            );
          }
        }
      });

      const isMedia = ["image", "video", "audio", "document", "location"].includes(newMessage.messageType) || !!newMessage.fileUrl;
      if (isMedia && newMessage.contact_id) {
        dispatch(
          chatApi.util.invalidateTags([{ type: "Chats", id: newMessage.contact_id }])
        );
      }
    },
    [dispatch]
  );

  const updateSidebar = useCallback(
    (newMessage: ChatMessage) => {
      if (newMessage.messageType === "reaction") {
        return;
      }

      const targetPhoneId = newMessage.whatsapp_phone_number_id || selectedPhoneNumberId;
      if (!targetPhoneId) {
        return;
      }

      const activeQueries = Object.values(queriesRef.current || {});
      
      let chatFoundInAnyQuery = false;

      activeQueries.forEach((query: any) => {
        if (query?.endpointName === "getRecentChats" && query?.status === "fulfilled") {
          const originalArgs = query.originalArgs;
          const queryPhoneId = originalArgs.whatsapp_phone_number_id;
          const msgPhoneId = newMessage.whatsapp_phone_number_id;

          if (queryPhoneId && msgPhoneId && String(queryPhoneId) !== String(msgPhoneId)) {
            return;
          }

          dispatch(
            chatApi.util.updateQueryData("getRecentChats", originalArgs, (draft) => {
              if (!draft || !draft.data) {
                return;
              }

              const targetIdentifier = newMessage.direction === "inbound" ? String(newMessage.sender.id) : String(newMessage.recipient.id);
              const msgContactId = String(newMessage.contact_id);
              const chatIndex = draft.data.findIndex((c) => 
                String(c.contact.id) === targetIdentifier || 
                String(c.contact.number) === targetIdentifier || 
                (msgContactId && msgContactId !== "undefined" && String(c.contact.id) === msgContactId)
              );

              if (chatIndex !== -1) {
                chatFoundInAnyQuery = true;
                const chat = draft.data[chatIndex];
                const isViewing = selectedChat && (
                  String(selectedChat.contact.id) === String(chat.contact.id) || 
                  String(selectedChat.contact.number) === String(chat.contact.number)
                );

                if (chat.lastMessage.id === newMessage.id) {
                  return;
                }

                chat.lastMessage = {
                  id: newMessage.id,
                  content: newMessage.content || (newMessage.messageType === "text" ? "" : `[${newMessage.messageType}]`),
                  messageType: newMessage.messageType,
                  createdAt: newMessage.createdAt,
                  unreadCount: chat.lastMessage.unreadCount,
                };

                if (!isViewing && newMessage.direction === "inbound") {
                  const rawCount = chat.lastMessage.unreadCount;
                  const currentCount = (rawCount && rawCount !== "null" && rawCount !== "undefined") ? parseInt(rawCount) : 0;
                  const nextCount = isNaN(currentCount) ? 1 : currentCount + 1;
                  chat.lastMessage.unreadCount = nextCount.toString();
                }

                if (chatIndex > 0) {
                  draft.data.splice(chatIndex, 1);
                  draft.data.unshift(chat);
                }
              }
            })
          );
        }
      });


      const isMediaMsg = ["image", "video", "audio", "document", "location"].includes(newMessage.messageType || (newMessage as any).message_type);
      if (isMediaMsg && newMessage.contact_id) {
        dispatch(chatApi.util.invalidateTags([{ type: "Chats", id: newMessage.contact_id }]));
      }

      dispatch(chatApi.util.invalidateTags(["Chats"]));
    },
    [dispatch, selectedPhoneNumberId, selectedChat]
  );

  const scheduleBotReplyFetch = useCallback(() => {
    if (botFetchTimer1.current) clearTimeout(botFetchTimer1.current);
    if (botFetchTimer2.current) clearTimeout(botFetchTimer2.current);

    botFetchTimer1.current = setTimeout(() => {
      dispatch(chatApi.util.invalidateTags(["Messages"]));
    }, 1500);
    botFetchTimer2.current = setTimeout(() => {
      dispatch(chatApi.util.invalidateTags(["Messages"]));
    }, 4000);
  }, [dispatch]);

  const handleStatusUpdate = useCallback(
    (updatedMessage: ChatMessage) => {
      const isCorrectUser = !updatedMessage.user_id || updatedMessage.user_id === user?.id || updatedMessage.user_id === selectedWorkspace?.user_id;
      if (!isCorrectUser) return;

      // Invalidate Chats tag to keep sidebar in sync if an inbound message status changed to read
      if (updatedMessage.direction === "inbound" && (updatedMessage.is_seen || updatedMessage.read_status === "read")) {
        dispatch(chatApi.util.invalidateTags(["Chats"]));
      }

      // Update getRecentChats cache for this contact to set unreadCount to "0"
      if (updatedMessage.direction === "inbound" && (updatedMessage.is_seen || updatedMessage.read_status === "read")) {
        const targetPhoneId = updatedMessage.whatsapp_phone_number_id || selectedPhoneNumberId;
        if (targetPhoneId) {
          const activeQueries = Object.values(queriesRef.current || {});
          activeQueries.forEach((query: any) => {
            if (query?.endpointName === "getRecentChats" && query?.status === "fulfilled") {
              const originalArgs = query.originalArgs;
              const queryPhoneId = originalArgs.whatsapp_phone_number_id;
              const msgPhoneId = updatedMessage.whatsapp_phone_number_id;

              if (queryPhoneId && msgPhoneId && String(queryPhoneId) !== String(msgPhoneId)) {
                return;
              }

              dispatch(
                chatApi.util.updateQueryData("getRecentChats", originalArgs, (draft) => {
                  if (!draft || !draft.data) return;
                  const contactIdStr = String(updatedMessage.sender.id);
                  const msgContactId = String(updatedMessage.contact_id);
                  const chat = draft.data.find(
                    (c) => String(c.contact.id) === contactIdStr || String(c.contact.number) === contactIdStr || (msgContactId && msgContactId !== "undefined" && String(c.contact.id) === msgContactId)
                  );
                  if (chat) {
                    chat.lastMessage.unreadCount = "0";
                  }
                })
              );
            }
          });
        }
      }

      const msgContactId = String(updatedMessage.contact_id);
      const msgSenderId = String(updatedMessage.sender.id);
      const msgRecipientId = String(updatedMessage.recipient.id);
      const msgPhoneId = updatedMessage.whatsapp_phone_number_id;

      const activeQueries = Object.values(queriesRef.current || {});
      activeQueries.forEach((query: any) => {
        if (query?.endpointName === "getMessages" && query?.status === "fulfilled") {
          const originalArgs = query.originalArgs;
          const queryContactId = String(originalArgs.contact_id);
          const queryPhoneId = originalArgs.whatsapp_phone_number_id;

          const matchContactId =
            queryContactId === msgContactId ||
            queryContactId === msgSenderId ||
            queryContactId === msgRecipientId;

          const matchPhone = !queryPhoneId || !msgPhoneId || String(queryPhoneId) === String(msgPhoneId);

          if (matchContactId && matchPhone) {
            dispatch(
              chatApi.util.updateQueryData("getMessages", originalArgs, (draft) => {
                if (!draft || !draft.messages) return;

                for (const dateGroup of draft.messages) {
                  for (const group of dateGroup.messageGroups) {
                    const msg = group.messages.find(
                      (m) =>
                        m.id === updatedMessage.id ||
                        (m.wa_message_id && updatedMessage.wa_message_id && m.wa_message_id === updatedMessage.wa_message_id)
                    );
                    if (msg) {
                      msg.is_delivered = updatedMessage.is_delivered;
                      msg.delivered_at = updatedMessage.delivered_at;
                      msg.is_seen = updatedMessage.is_seen;
                      msg.seen_at = updatedMessage.seen_at;
                      msg.wa_status = updatedMessage.wa_status;
                      msg.delivery_status = updatedMessage.delivery_status;
                      return;
                    }
                  }
                }
              })
            );
          }
        }
      });
    },
    [dispatch, user, selectedWorkspace, selectedPhoneNumberId]
  );

  const handleMessage = useCallback(
    (newMessage: ChatMessage) => {
      try {
        const isCorrectUser = !newMessage.user_id || newMessage.user_id === user?.id || newMessage.user_id === selectedWorkspace?.user_id;
        if (!isCorrectUser) {
          console.warn("Received message for a different user, ignoring.");
          return;
        }

        updateSidebar(newMessage);
        updateChatArea(newMessage);
      } catch (error) {
        console.error("Error updating chat UI from socket:", error);
      }

      if (newMessage.direction === "inbound") {
        scheduleBotReplyFetch();

        const isChatPage = pathname === ROUTES.WAChat;
        const isCurrentChat = selectedChat && (String(selectedChat.contact.id) === String(newMessage.sender.id) || String(selectedChat.contact.number) === String(newMessage.sender.id) || (newMessage.contact_id && String(selectedChat.contact.id) === String(newMessage.contact_id)));

        if (isChatPage && isCurrentChat && document.hasFocus()) {
          markMessageAsRead({ messageId: newMessage.id });
        }

        const notificationSettings = userSetting?.data;
        const notificationsEnabled = notificationSettings?.notifications_enabled ?? true;
        const selectedTone = notificationSettings?.notification_tone || "default";

        if (notificationsEnabled && (!isChatPage || !isCurrentChat || !document.hasFocus())) {
          const isCorrectUser = !newMessage.user_id || newMessage.user_id === user?.id || newMessage.user_id === selectedWorkspace?.user_id;
          if (!isCorrectUser) return;

          unreadCountRef.current += 1;
          const countStr = unreadCountRef.current > 0 ? `(${unreadCountRef.current}) ` : "";
          const msgPreview = newMessage.content || `[${newMessage.messageType}]`;

          try {
            const toneFile = selectedTone === "default" ? "/assets/sounds/default.mp3" : `/assets/sounds/${selectedTone}.mp3`;
            const audio = new Audio(toneFile);
            audio.play().catch((e) => console.error("Error playing notification sound:", e));
          } catch {}

          sendNotification(`New message from ${newMessage.sender.name}`, {
            body: msgPreview,
            tag: `chat-${newMessage.sender.id}`,
            renotify: true,
            onClick: () => {
              window.focus();

              const cachedChat = recentChatsRef.current?.find((c: any) => String(c.contact.id) === String(newMessage.sender.id) || String(c.contact.number) === String(newMessage.sender.id));

              router.push(ROUTES.WAChat);

              if (cachedChat) {
                dispatch(selectChat(cachedChat));
              } else {
                dispatch(
                  selectChat({
                    contact: {
                      id: newMessage.sender.id,
                      number: newMessage.sender.id,
                      name: newMessage.sender.name,
                      avatar: newMessage.sender.avatar,
                      labels: [],
                    },
                    lastMessage: {
                      id: newMessage.id,
                      content: msgPreview,
                      messageType: newMessage.messageType,
                      createdAt: newMessage.createdAt,
                      unreadCount: "0",
                    },
                  } as any)
                );
              }
            },
          } as any);

          startBlinking([`${newMessage.sender.name || "Customer"}`, `${countStr} New! ${msgPreview.length > 20 ? msgPreview.substring(0, 20) + "..." : msgPreview}`]);

          toast.info(`New message from ${newMessage.sender.name}`, {
            description: newMessage.content || `[${newMessage.messageType}]`,
            duration: 4000,
            position: "top-right",
            style: {
              background: "var(--card-color)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
            },
          });
        }
      }
    },
    [updateSidebar, updateChatArea, scheduleBotReplyFetch, pathname, selectedChat, sendNotification, startBlinking, dispatch, router, selectedPhoneNumberId, userSetting, user, selectedWorkspace]
  );

  const handleConnectionUpdate = useCallback(
    async (data: any) => {
      const isCorrectUser = !data.user_id || data.user_id === user?.id || data.user_id === selectedWorkspace?.user_id;
      if (!isCorrectUser) return;

      dispatch(
        whatsappApi.util.updateQueryData("getBaileysQRCode", data.waba_id, (draft) => {
          if (draft) {
            draft.data = {
              qr_code: data.qr_code || draft.data?.qr_code,
              status: data.status,
            };
          }
        })
      );

      if (data.status === "connected") {
        toast.success("WhatsApp connected successfully!");
      }
      // else if (data.status === "qr_timeout" && pathname == ROUTES.WABAConnection) {
      //   toast.error("QR Code expired. Please refresh.");
      // }
      else if (data.status === "disconnected") {
        if (data.code !== 401 && data.message !== "Disconnected by user" && data.message !== "Intentional Logout") {
            toast.error("Connection failed or logged out.");
        }
      }

      try {
        const { data: updatedWorkspaces } = await refetchWorkspaces();
        if (updatedWorkspaces?.data) {
          const currentWs = updatedWorkspaces.data.find((ws: any) => ws._id === selectedWorkspace?._id);
          if (currentWs && (currentWs.connection_status !== selectedWorkspace?.connection_status || currentWs.waba_id !== selectedWorkspace?.waba_id)) {
            dispatch(setWorkspace(currentWs));
          }
        }
      } catch (error) {
        console.error("Failed to refetch workspaces after connection update:", error);
      }
    },
    [dispatch, refetchWorkspaces, selectedWorkspace, user]
  );

  const handleSnoozeReminder = useCallback((data: { contact_id: string, contact_name?: string, contact_number?: string, user_id?: string, message: string, isDanger: boolean, snooze_count: number, timestamp?: string }) => {
    const isCorrectUser = !data.user_id || data.user_id === user?.id || data.user_id === selectedWorkspace?.user_id;
    if (!isCorrectUser) return;

    const arrivalTime = new Date(data.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    try {
      const selectedTone = userSetting?.data?.notification_tone || "default";
      const toneFile = selectedTone === "default" ? "/assets/sounds/default.mp3" : `/assets/sounds/${selectedTone}.mp3`;
      const audio = new Audio(toneFile);
      audio.play().catch(() => {});
    } catch {}

    const handleClick = (tId: string | number) => {
      window.focus();
      router.push(ROUTES.WAChat);
      if (data.contact_id) {
        let cachedChat = recentChatsRef.current?.find((c: any) => String(c.contact.id) === String(data.contact_id) || String(c.contact.number) === String(data.contact_id));
        
        if (!cachedChat) {
          cachedChat = {
            contact: {
              id: data.contact_id,
              name: data.contact_name || "Unknown Contact",
              number: data.contact_number || "",
              avatar: null,
              labels: []
            },
            lastMessage: {
              id: "",
              content: "",
              messageType: "text",
              createdAt: new Date().toISOString(),
              unreadCount: "0"
            }
          } as any;
        }
        dispatch(selectChat(cachedChat));
      }
      toast.dismiss(tId);
    };

    const CustomToast = ({ tId, isDanger, message }: { tId: string | number, isDanger: boolean, message: string }) => {
      return React.createElement(
        "div",
        {
          className: `p-4 w-full rounded-xl border shadow-xl overflow-hidden relative ${isDanger ? 'bg-white dark:bg-(--card-color) border-red-200 dark:border-red-900/50' : 'bg-white dark:bg-(--card-color) border-amber-200 dark:border-amber-900/50'}`
        },
        React.createElement("div", {
          className: `absolute top-0 left-0 w-1.5 h-full ${isDanger ? 'bg-red-500' : 'bg-amber-500'}`
        }),
        React.createElement(
          "div",
          { className: "flex items-start gap-3 pl-1 relative z-10" },
          React.createElement(
            "div",
            {
              className: `p-2.5 rounded-full mt-0.5 shrink-0 ${isDanger ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`
            },
            React.createElement(isDanger ? AlertTriangle : MessageSquareWarning, { size: 22 })
          ),
          React.createElement(
            "div",
            { className: "flex-1" },
            React.createElement(
              "h4",
              {
                className: `font-bold text-sm mb-1 ${isDanger ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`
              },
              isDanger ? '🚨 Priority Request' : '⏰ Chat Reminder'
            ),
            React.createElement(
              "p",
              { className: "text-slate-600 dark:text-slate-300 text-sm leading-relaxed mt-2" },
              message
            ),
            React.createElement(
              "span",
              { className: "text-[10px] text-slate-400 dark:text-slate-500 block text-right mt-1.5 font-medium" },
              arrivalTime
            )
          ),
          React.createElement(
            "div",
            { className: "absolute top-0 right-0 flex items-center gap-1.5" },
            React.createElement(
              "button",
              {
                onClick: () => handleClick(tId),
                className: `px-2.5 py-1 text-xs font-bold rounded-lg transition-all shrink-0 ${isDanger ? 'bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300' : 'bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 dark:text-amber-300'}`
              },
              "View Chat"
            ),
            React.createElement(
              "button",
              {
                onClick: () => toast.dismiss(tId),
                className: "p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0"
              },
              React.createElement(X, { size: 16 })
            )
          )
        )
      );
    };

    if (data.isDanger) {
      toast.custom((tId) => React.createElement(CustomToast, { tId, isDanger: true, message: data.message }), {
        duration: Infinity,
        position: "top-center",
      });
      sendNotification("🚨 Priority Request", { 
         body: data.message,
         tag: `snooze-${data.contact_id}`,
         force: true,
         onClick: () => handleClick("system-notification")
      } as any);
    } else {
      toast.custom((tId) => React.createElement(CustomToast, { tId, isDanger: false, message: data.message }), {
        duration: Infinity,
        position: "top-right",
      });
      sendNotification("⏰ Chat Reminder", { 
         body: data.message,
         tag: `snooze-${data.contact_id}`,
         force: true,
         onClick: () => handleClick("system-notification")
      } as any);
    }
  }, [router, sendNotification, userSetting, dispatch, user, selectedWorkspace]);

  const handleAgentEscalation = useCallback((data: { contact_id: string, user_id?: string, message: string }) => {
    const isCorrectUser = !data.user_id || data.user_id === user?.id || data.user_id === selectedWorkspace?.user_id;
    if (!isCorrectUser) return;

    if (data.contact_id) {
      dispatch(chatApi.util.invalidateTags([{ type: "Chats", id: data.contact_id }]));
      dispatch(chatApi.util.invalidateTags(["Chats"]));

      toast.info(`Human Handoff`, {
        description: data.message || "A conversation has been transferred to a human agent.",
        duration: 5000,
        position: "top-right",
        style: {
          background: "var(--card-color)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
        },
      });
    }
  }, [dispatch, user, selectedWorkspace]);

  useEffect(() => {
    const currentUserId = user?.id || selectedWorkspace?.user_id;
    if (currentUserId) {
      socket.emit("join_user", currentUserId);
    }

    socket.on(SOCKET.Listeners.Whatsapp_Message, handleMessage);
    socket.on(SOCKET.Listeners.Whatsapp_Status, handleStatusUpdate);
    socket.on(SOCKET.Listeners.Whatsapp_Connection_Update, handleConnectionUpdate);
    socket.on('snooze_reminder', handleSnoozeReminder);
    socket.on('agent:escalation', handleAgentEscalation);

    return () => {
      socket.off(SOCKET.Listeners.Whatsapp_Message, handleMessage);
      socket.off(SOCKET.Listeners.Whatsapp_Status, handleStatusUpdate);
      socket.off(SOCKET.Listeners.Whatsapp_Connection_Update, handleConnectionUpdate);
      socket.off('snooze_reminder', handleSnoozeReminder);
      socket.off('agent:escalation', handleAgentEscalation);
    };
  }, [handleMessage, handleStatusUpdate, handleConnectionUpdate, handleSnoozeReminder, handleAgentEscalation, user?.id, selectedWorkspace?.user_id]);

  useEffect(() => {
    return () => {
      if (botFetchTimer1.current) clearTimeout(botFetchTimer1.current);
      if (botFetchTimer2.current) clearTimeout(botFetchTimer2.current);
    };
  }, []);
};
