/* eslint-disable @typescript-eslint/no-explicit-any */
import { AiTextTransformRequest, AiTextTransformResponse, ChatMessage, GetMessagesResponse, RecentChatData, SendMessagePayload, SuggestReplyRequest, SuggestReplyResponse } from "@/src/types/components/chat";
import { baseApi } from "./baseApi";
import { createOptimisticMessages, getTodayDateInfo } from "./utils/optimisticMessageUtils";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecentChats: builder.query<RecentChatData, { page?: number; limit?: number; search?: string; whatsapp_phone_number_id?: string; start_date?: string; end_date?: string; tags?: string; has_notes?: boolean; last_message_read?: boolean; is_assigned?: boolean; agent_id?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (!params.search) {
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit) queryParams.append("limit", params.limit.toString());
        }
        if (params.search) queryParams.append("search", params.search);
        if (params.whatsapp_phone_number_id) queryParams.append("whatsapp_phone_number_id", params.whatsapp_phone_number_id);
        if (params.start_date) queryParams.append("start_date", params.start_date);
        if (params.end_date) queryParams.append("end_date", params.end_date);
        if (params.tags) queryParams.append("tags", params.tags);
        if (params.has_notes !== undefined) queryParams.append("has_notes", params.has_notes.toString());
        if (params.last_message_read !== undefined) queryParams.append("last_message_read", params.last_message_read.toString());
        if (params.is_assigned !== undefined) queryParams.append("is_assigned", params.is_assigned.toString());
        if (params.agent_id) queryParams.append("agent_id", params.agent_id);

        return { url: `/whatsapp/chats?${queryParams.toString()}`, method: "GET" };
      },
      serializeQueryArgs: ({ queryArgs }) => {
        const { page, ...rest } = queryArgs;
        return rest;
      },
      merge: (currentCache, newItems) => {
        if (newItems.pagination?.page === 1 || !newItems.pagination) {
          return newItems;
        }
        // Filter out any duplicate chats that might already be in the cache
        const existingIds = new Set(currentCache.data.map((c) => c.contact.id));
        const uniqueNewItems = newItems.data.filter((c) => !existingIds.has(c.contact.id));

        currentCache.data.push(...uniqueNewItems);
        currentCache.pagination = newItems.pagination;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
      providesTags: ["Chats"],
    }),
    getMessages: builder.query<GetMessagesResponse, { contact_id?: string; whatsapp_phone_number_id?: string; page?: number; limit?: number; search?: string; start_date?: string; end_date?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.contact_id) queryParams.append("contact_id", params.contact_id);
        if (params.whatsapp_phone_number_id) queryParams.append("whatsapp_phone_number_id", params.whatsapp_phone_number_id);
        if (params.search) queryParams.append("search", params.search);
        if (params.start_date) queryParams.append("start_date", params.start_date);
        if (params.end_date) queryParams.append("end_date", params.end_date);

        return { url: `/whatsapp/messages?${queryParams.toString()}`, method: "GET" };
      },
      serializeQueryArgs: ({ queryArgs }) => {
        const { page, limit, ...rest } = queryArgs;
        return rest;
      },
      merge: (currentCache, newItems) => {
        if (newItems.pagination?.page === 1 || !newItems.pagination) {
          return newItems;
        }

        const currentMessages = currentCache.messages;
        const incomingMessages = newItems.messages;

        if (incomingMessages.length === 0) return currentCache;

        // Prepend older messages (higher page numbers)
        const lastIncomingGroup = incomingMessages[incomingMessages.length - 1];
        const firstCurrentGroup = currentMessages[0];

        if (lastIncomingGroup && firstCurrentGroup && lastIncomingGroup.dateKey === firstCurrentGroup.dateKey) {
          // Merge message groups for the same date
          firstCurrentGroup.messageGroups = [...lastIncomingGroup.messageGroups, ...firstCurrentGroup.messageGroups];
          currentCache.messages = [...incomingMessages.slice(0, -1), ...currentMessages];
        } else {
          currentCache.messages = [...incomingMessages, ...currentMessages];
        }

        currentCache.pagination = newItems.pagination;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
      transformResponse: (response: GetMessagesResponse) => {
        if (!response.messages) return response;

        // Create a map for quick access to messages by wa_message_id
        const messageMap: Record<string, ChatMessage> = {};
        const reactions: ChatMessage[] = [];

        response.messages.forEach((dateGroup) => {
          dateGroup.messageGroups.forEach((group) => {
            group.messages.forEach((message) => {
              if (message.wa_message_id) {
                messageMap[message.wa_message_id] = message;
              }
              if (message.messageType === "reaction" && message.reaction_message_id) {
                reactions.push(message);
              }
            });
          });
        });

        // Map reactions to their target messages
        reactions.forEach((reaction) => {
          const targetMessage = messageMap[reaction.reaction_message_id!];
          if (targetMessage) {
            if (!targetMessage.reactions) {
              targetMessage.reactions = [];
            }
            const existingReaction = targetMessage.reactions.find((r) => r.emoji === reaction.content);
            if (existingReaction) {
              if (!existingReaction.users.find((u) => u.id === reaction.sender.id)) {
                existingReaction.users.push(reaction.sender);
              }
            } else {
              targetMessage.reactions.push({
                emoji: reaction.content!,
                users: [reaction.sender],
              });
            }
          }
        });

        // Filter out reaction messages from the UI list
        response.messages.forEach((dateGroup) => {
          dateGroup.messageGroups.forEach((group) => {
            group.messages = group.messages.filter((m) => m.messageType !== "reaction");
          });
          // Remove empty message groups or groups with no messages after filtering
          dateGroup.messageGroups = dateGroup.messageGroups.filter((g) => g.messages.length > 0);
        });

        // Filter out empty date groups
        response.messages = response.messages.filter((dg) => dg.messageGroups.length > 0);

        return response;
      },
      providesTags: ["Messages"],
      async onQueryStarted({ contact_id }, { dispatch, queryFulfilled, getState }) {
        if (!contact_id) return;
        const state: any = getState();
        const queries = state.api?.queries || {};

        Object.values(queries).forEach((query: any) => {
          if (query?.endpointName === "getRecentChats" && query?.status === "fulfilled") {
            const originalArgs = query.originalArgs;
            dispatch(
              chatApi.util.updateQueryData(
                "getRecentChats",
                originalArgs,
                (draft) => {
                  if (!draft || !draft.data) return;
                  const chat = draft.data.find((c: any) => String(c.contact.id) === String(contact_id));
                  if (chat) {
                    chat.lastMessage.unreadCount = "0";
                  }
                }
              )
            );
          }
        });

        try {
          await queryFulfilled;
        } catch {}
      },
    }),
    sendMessage: builder.mutation<any, SendMessagePayload | FormData>({
      query: (body) => ({
        url: "/whatsapp/send",
        method: "POST",
        body,
      }),
      async onQueryStarted(payload, { dispatch, getState, queryFulfilled }) {
        let contact_id: string = "";
        let whatsapp_phone_number_id: string = "";

        if (payload instanceof FormData) {
          contact_id = (payload.get("contact_id") as string) || "";
          whatsapp_phone_number_id = (payload.get("whatsapp_phone_number_id") as string) || "";
        } else {
          contact_id = payload.contact_id;
          whatsapp_phone_number_id = payload.whatsapp_phone_number_id;
        }

        let tempMessageIds: string[] = [];

        const patchResult = dispatch(
          chatApi.util.updateQueryData(
            "getMessages",
            {
              contact_id,
              whatsapp_phone_number_id,
              start_date: undefined,
              end_date: undefined,
            },
            (draft) => {
              let replyMessageId: string | undefined;
              if (payload instanceof FormData) {
                replyMessageId = payload.get("replyMessageId") as string;
              } else {
                replyMessageId = payload.replyMessageId;
              }

              let reply_message = null;
              if (replyMessageId) {
                for (const dateGroup of draft.messages) {
                  for (const group of dateGroup.messageGroups) {
                    const found = group.messages.find((m) => m.wa_message_id === replyMessageId);
                    if (found) {
                      reply_message = found;
                      break;
                    }
                  }
                  if (reply_message) break;
                }
              }

              const isReaction = (payload as any).messageType === "reaction" || (payload as any).type === "reaction" || (payload as any).message_type === "reaction";
              const payloadReactionMessageId = (payload as any).reactionMessageId || (payload as any).reaction_message_id;

              if (isReaction && payloadReactionMessageId) {
                for (const dateGroup of draft.messages) {
                  for (const group of dateGroup.messageGroups) {
                    const target = group.messages.find((m) => m.wa_message_id === payloadReactionMessageId || m.id === payloadReactionMessageId);
                    if (target) {
                      if (!target.reactions) target.reactions = [];
                      const emoji = (payload as any).reactionEmoji || (payload as any).reaction_emoji;
                      // This is inside sendMessage mutation, so it's always an outgoing reaction
                      const reactorId = "current-user";
                      const reactorName = "You";

                      target.reactions.forEach((r) => {
                        r.users = r.users?.filter((u) => u.id !== reactorId) || [];
                      });

                      target.reactions = target.reactions.filter((r) => r.users.length > 0);

                      if (emoji) {
                        const existing = target.reactions.find((r) => r.emoji === emoji);
                        if (existing) {
                          existing.users.push({ id: reactorId, name: reactorName, avatar: null });
                        } else {
                          target.reactions.push({
                            emoji,
                            users: [{ id: reactorId, name: reactorName, avatar: null }],
                          });
                        }
                      }
                      return;
                    }
                  }
                }
                return;
              }

              const tempMessages = createOptimisticMessages(payload, reply_message);
              tempMessageIds = tempMessages.map((m) => m.id);
              const { dateLabel, dateKey } = getTodayDateInfo();

              let todayGroup = draft.messages.find((dg) => dg.dateKey === dateKey);

              if (!todayGroup) {
                todayGroup = {
                  dateLabel,
                  dateKey,
                  messageGroups: [],
                };
                draft.messages.push(todayGroup);
              }

              const lastMessageGroup = todayGroup.messageGroups[todayGroup.messageGroups.length - 1];

              const canAppend = lastMessageGroup && lastMessageGroup.senderId === "current-user";

              if (canAppend) {
                lastMessageGroup.messages.push(...tempMessages);
                lastMessageGroup.lastMessageTime = tempMessages[tempMessages.length - 1].createdAt;
              } else {
                const newUserGroup = {
                  senderId: "current-user",
                  sender: tempMessages[0].sender,
                  recipient: tempMessages[0].recipient,
                  messages: tempMessages,
                  createdAt: tempMessages[0].createdAt,
                  lastMessageTime: tempMessages[tempMessages.length - 1].createdAt,
                };
                todayGroup.messageGroups.push(newUserGroup);
              }
            }
          )
        );

        try {
          const { data: response } = await queryFulfilled;
          dispatch(chatApi.util.invalidateTags(["Chats"]));

          // If it's a payment link, update the optimistic message with the real URL
          let realContent: string | undefined;
          if (response?.data?.payment_link && !(payload instanceof FormData) && payload.messageType === "payment_link") {
            const { amount, currency, description } = payload;
            realContent = `💳 *Payment Required*\n\n*Description:* ${description}\n*Amount:* ${currency} ${amount}\n\nPlease complete your payment using the link below:\n${response.data.payment_link}\n\n_This link is secure and unique to you._`;
          }

          if (response?.data) {
            const realId = response.data.id || response.data._id;
            const realWaMessageId = response.data.wa_message_id || response.data.platform_message_id || realId;

            const state = getState() as any;
            const activeQueries = Object.values(state.api?.queries || {});
            activeQueries.forEach((query: any) => {
              if (query?.endpointName === "getMessages" && query?.status === "fulfilled") {
                const originalArgs = query.originalArgs;
                if (String(originalArgs.contact_id) === String(contact_id)) {
                  dispatch(
                    chatApi.util.updateQueryData("getMessages", originalArgs, (draft) => {
                      for (const dateGroup of draft.messages) {
                        for (const group of dateGroup.messageGroups) {
                          if (tempMessageIds.length > 1 && response.data.sent && Array.isArray(response.data.sent)) {
                            tempMessageIds.forEach((tempId, index) => {
                              const msg = group.messages.find((m) => m.id === tempId);
                              if (msg) {
                                const sentItem = response.data.sent[index];
                                if (sentItem && sentItem.result) {
                                  msg.id = sentItem.result.messageId || tempId;
                                  msg.wa_message_id = sentItem.result.waMessageId || sentItem.result.messageId || tempId;
                                }
                                msg.delivery_status = "sent";
                              }
                            });
                          } else {
                            const msg = group.messages.find((m) => m.id === tempMessageIds[0]);
                            if (msg) {
                              if (realId) msg.id = realId;
                              if (realWaMessageId) msg.wa_message_id = realWaMessageId;
                              if (realContent) {
                                msg.content = realContent;
                              } else if (response?.data?.content) {
                                msg.content = response.data.content;
                              }
                              if (response?.data?.message_type) {
                                msg.messageType = response.data.message_type;
                              } else if (response?.data?.type) {
                                msg.messageType = response.data.type;
                              }
                              if (response.data.wa_status) msg.wa_status = response.data.wa_status;
                              if (response.data.delivery_status) msg.delivery_status = response.data.delivery_status;
                            }
                          }
                        }
                      }
                    })
                  );
                }
              }
            });
          }
        } catch {
          patchResult.undo();
        }
      },
    }),
    getContactProfile: builder.query<any, { contact_id: string; whatsapp_phone_number_id: string }>({
      query: (params) => ({
        url: "/whatsapp/contact-profile",
        method: "GET",
        params,
      }),
      providesTags: (result, error, { contact_id }) => [{ type: "Chats", id: contact_id }],
    }),
    assignAgent: builder.mutation<void, { contact_id: string; agent_id: string; whatsapp_phone_number_id: string }>({
      query: (body) => ({
        url: "/whatsapp/assign-chat",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { contact_id }) => [{ type: "Chats", id: contact_id }],
    }),
    unassignAgent: builder.mutation<void, { contact_id: string; whatsapp_phone_number_id: string }>({
      query: (body) => ({
        url: "/whatsapp/unassign-chat",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { contact_id }) => [{ type: "Chats", id: contact_id }],
    }),
    assignChatbot: builder.mutation<void, { contact_id: string; chatbot_id: string }>({
      query: (body) => ({
        url: "/whatsapp/assign-chatbot",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { contact_id }) => [{ type: "Chats", id: contact_id }],
    }),
    unassignChatbot: builder.mutation<void, { contact_id: string }>({
      query: (body) => ({
        url: "/whatsapp/unassign-chatbot",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { contact_id }) => [{ type: "Chats", id: contact_id }],
    }),
    addChatNote: builder.mutation<void, { contact_id: string; whatsapp_phone_number_id: string; note: string }>({
      query: (body) => ({
        url: "/chat/chat-note",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { contact_id }) => [{ type: "Chats", id: contact_id }],
    }),
    deleteChatNote: builder.mutation<void, { ids: string[]; contact_id: string }>({
      query: (body) => ({
        url: "/chat/chat-note",
        method: "DELETE",
        body: { ids: body.ids },
      }),
      invalidatesTags: (result, error, { contact_id }) => [{ type: "Chats", id: contact_id }],
    }),
    suggestReply: builder.mutation<SuggestReplyResponse, SuggestReplyRequest>({
      query: (body) => ({
        url: "/chat/suggest-reply",
        method: "POST",
        body,
      }),
    }),
    transformMessage: builder.mutation<AiTextTransformResponse, AiTextTransformRequest>({
      query: (body) => ({
        url: "/chat/transform",
        method: "POST",
        body,
      }),
    }),
    addChatTag: builder.mutation<void, { contact_id: string; tag_id: string; whatsapp_phone_number_id: string }>({
      query: (body) => ({
        url: "/chat/add-tag",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chats"],
    }),
    deleteChatTag: builder.mutation<void, { contactId: string; tagId: string; whatsapp_phone_number_id: string }>({
      query: (body) => ({
        url: "/chat/delete-tag",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Chats"],
    }),
    togglePinChat: builder.mutation<void, { contact_id: string; phone_number: string }>({
      query: (body) => ({
        url: "/whatsapp/pin-chat",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chats"],
      async onQueryStarted({ contact_id }, { dispatch, queryFulfilled, getState }) {
        const state: any = getState();
        const queries = state.api?.queries || {};
        const patchResults: any[] = [];

        Object.values(queries).forEach((query: any) => {
          if (query?.endpointName === "getRecentChats" && query?.status === "fulfilled") {
            const originalArgs = query.originalArgs;
            const patchResult = dispatch(
              chatApi.util.updateQueryData(
                "getRecentChats",
                originalArgs,
                (draft) => {
                  const chat = draft.data?.find((c: any) => c.contact.id === contact_id);
                  if (chat) {
                    chat.is_pinned = !chat.is_pinned;
                  }
                }
              )
            );
            patchResults.push(patchResult);
          }
        });

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patchResult) => patchResult.undo());
        }
      },
    }),
    toggleSnoozeChat: builder.mutation<{ success: boolean; data?: { id: string; is_snoozed: boolean } }, { contact_id: string; is_snoozed?: boolean; snooze_time_minutes?: number; snooze_count_limit?: number }>({
      query: (body) => ({
        url: "/whatsapp/toggle-snooze",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chats"],
      async onQueryStarted({ contact_id }, { dispatch, queryFulfilled, getState }) {
        const state: any = getState();
        const queries = state.api?.queries || {};
        const patchResults: any[] = [];

        Object.values(queries).forEach((query: any) => {
          if (query?.endpointName === "getRecentChats" && query?.status === "fulfilled") {
            const originalArgs = query.originalArgs;
            const patchResult = dispatch(
              chatApi.util.updateQueryData(
                "getRecentChats",
                originalArgs,
                (draft) => {
                  const chat = draft.data?.find((c: any) => c.contact.id === contact_id);
                  if (chat) {
                    chat.is_snoozed = !chat.is_snoozed;
                  }
                }
              )
            );
            patchResults.push(patchResult);
          }
        });

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patchResult) => patchResult.undo());
        }
      },
    }),
    updateChatStatus: builder.mutation<void, { contact_id: string; status: "open" | "resolved"; whatsapp_phone_number_id: string }>({
      query: (body) => ({
        url: "/chat/status",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chats"],
      async onQueryStarted({ contact_id, status }, { dispatch, queryFulfilled, getState }) {
        const state: any = getState();
        const queries = state.api?.queries || {};
        const patchResults: any[] = [];

        Object.values(queries).forEach((query: any) => {
          if (query?.endpointName === "getRecentChats" && query?.status === "fulfilled") {
            const originalArgs = query.originalArgs;
            const patchResult = dispatch(
              chatApi.util.updateQueryData(
                "getRecentChats",
                originalArgs,
                (draft) => {
                  const chat = draft.data?.find((c: any) => c.contact.id === contact_id);
                  if (chat) {
                    chat.contact.chat_status = status;
                  }
                }
              )
            );
            patchResults.push(patchResult);
          }
        });

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patchResult) => patchResult.undo());
        }
      },
    }),
    deleteChat: builder.mutation<{ success: boolean; message: string }, { workspace_id: string; contact_ids: string[] }>({
      query: (body) => ({
        url: "/whatsapp/delete-chat",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chats"],
    }),
    clearChat: builder.mutation<void, { contact_id: string; connection_id: string }>({
      query: (body) => ({
        url: "/whatsapp/clear-chat",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { contact_id }) => [
        { type: "Chats", id: contact_id },
        "Messages",
      ],
      async onQueryStarted({ contact_id }, { dispatch, queryFulfilled, getState }) {
        const state: any = getState();
        const queries = state.api?.queries || {};

        Object.values(queries).forEach((query: any) => {
          if (query?.endpointName === "getMessages" && query?.status === "fulfilled") {
            const originalArgs = query.originalArgs;
            if (String(originalArgs.contact_id) === String(contact_id)) {
              dispatch(
                chatApi.util.updateQueryData("getMessages", originalArgs, (draft) => {
                  if (draft) {
                    draft.messages = [];
                  }
                })
              );
            }
          }
        });

        try {
          await queryFulfilled;
        } catch {}
      },
    }),
    markMessageAsRead: builder.mutation<any, { messageId: string }>({
      query: ({ messageId }) => ({
        url: `/message-status/${messageId}/read`,
        method: "PATCH",
        body: { status: "read" }, 
      }),
    }),
    sendProductMessage: builder.mutation<any, { whatsapp_phone_number_id: string; contact_id: string; product_id: string }>({
      query: (body) => ({
        url: "/whatsapp/send-product",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Messages", "Chats"],
    }),
    sendOrderMessage: builder.mutation<any, { whatsapp_phone_number_id: string; contact_id: string; product_id: string; checkout_url?: string; order_title?: string; order_description?: string }>({
      query: (body) => ({
        url: "/whatsapp/send-order",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Messages", "Chats"],
    }),
  }),
});

export const { 
  useGetRecentChatsQuery, 
  useGetMessagesQuery, 
  useLazyGetMessagesQuery, 
  useSendMessageMutation, 
  useGetContactProfileQuery, 
  useAssignAgentMutation, 
  useUnassignAgentMutation, 
  useAssignChatbotMutation,
  useUnassignChatbotMutation, 
  useSuggestReplyMutation, 
  useTransformMessageMutation, 
  useAddChatNoteMutation, 
  useDeleteChatNoteMutation, 
  useAddChatTagMutation, 
  useDeleteChatTagMutation, 
  useTogglePinChatMutation,
  useToggleSnoozeChatMutation,
  useUpdateChatStatusMutation, 
  useDeleteChatMutation, 
  useClearChatMutation, 
  useMarkMessageAsReadMutation,
  useSendProductMessageMutation,
  useSendOrderMessageMutation
} = chatApi;
