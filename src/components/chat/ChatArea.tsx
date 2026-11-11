/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/src/elements/ui/button";
import { Textarea } from "@/src/elements/ui/textarea";
import { useChatTheme } from "@/src/hooks/useChatTheme";
import { cn } from "@/src/lib/utils";
import { useGetMessagesQuery, useSendMessageMutation, useUpdateChatStatusMutation } from "@/src/redux/api/chatApi";
import { useCreateAttachmentMutation } from "@/src/redux/api/mediaApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { clearReplyToMessage, selSelectPhoneNumber, setIsMobileScreen, setLeftSidebartoggle, setProfileToggle, setReplyToMessage, updateSelectedChatStatus } from "@/src/redux/reducers/messenger/chatSlice";
import { openPreview } from "@/src/redux/reducers/previewSlice";
import { RootState } from "@/src/redux/store";
import { Attachment } from "@/src/types/components";
import { ChatAreaProps, SendMessagePayload, SuggestReplyMessage } from "@/src/types/components/chat";
import { getInitials } from "@/src/utils";
import { getResolvedImageUrl } from "@/src/utils/image";
import { maskSensitiveData } from "@/src/utils/masking";
import { BotMessageSquare, ChevronLeft, FileText, Filter, Image as ImageIcon, LayoutTemplate, Loader2, MessageSquareQuote, Mic, MoreVertical, Search, Send, Sparkles, Video, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AiTextTransformModal from "../feature/chat/AiTextTransformModal";
import SuggestReplyModal from "../feature/chat/SuggestReplyModal";
import AudioRecorder from "./AudioRecorder";
import ChatAttachmentMenu from "./ChatAttachmentMenu";
import { EcommerceProductModal } from "./EcommerceProductModal";
import EmojiPicker from "./EmojiPicker";
import PaymentLinkModal from "./PaymentLinkModal";
import GoogleMeetModal from "./GoogleMeetModal";
import ExpiredWindowBanner from "./ExpiredWindowBanner";
import InteractiveMessageModal from "./InteractiveMessageModal";
import MediaSelectionModal from "./MediaSelectionModal";
import MessageDateFilterModal from "./MessageDateFilterModal";
import ChatMessageList from "./messages/ChatMessageList";
import MessageSearchOverlay from "./MessageSearchOverlay";
import QuickReplyModal from "./QuickReplyModal";
import ResolvedChatBanner from "./ResolvedChatBanner";
import WhatsAppTimer from "./WhatsAppTimer";
import { ROUTES } from "@/src/constants";
import { socket } from "@/src/services/socket-setup";
import PlanFeature from "@/src/shared/PlanFeature";

const LocationPickerModal = dynamic(() => import("./LocationPickerModal"), {
  ssr: false,
});

const ChatArea: React.FC<ChatAreaProps> = ({ contactId, phoneNumberId, contactName, contactNumber, contactAvatar, isModal = false }) => {
  const dispatch = useAppDispatch();
  const { isCustom } = useChatTheme();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { is_demo_mode } = useAppSelector((state) => state.setting);
  const isAgent = user?.role === "agent";
  const { selectedChat, selectedPhoneNumberId, isMobileScreen, replyToMessage } = useAppSelector((state: RootState) => state.chat);
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const isBaileys = selectedWorkspace?.waba_type === "baileys";

  const currentContactId = contactId || selectedChat?.contact.id;
  const currentPhoneNumberId = phoneNumberId || selectedPhoneNumberId;
  const currentContactName = contactName || selectedChat?.contact.name;
  const currentContactNumber = contactNumber || selectedChat?.contact.number;
  const currentContactAvatar = contactAvatar || selectedChat?.contact.avatar;
  const currentContactPhoneNumber = contactNumber || selectedChat?.contact.phone_number || selectedChat?.contact.number;
  const hasName = !!currentContactName && currentContactName !== currentContactPhoneNumber;
  const displayName = isAgent && user?.is_phoneno_hide
    ? "Customer"
    : (hasName ? currentContactName : maskSensitiveData(currentContactPhoneNumber, "phone", is_demo_mode));

  const displaySubName = !isAgent || !user?.is_phoneno_hide
    ? (hasName ? maskSensitiveData(currentContactPhoneNumber, "phone", is_demo_mode) : null)
    : null;

  const { app_name } = useAppSelector((state: RootState) => state.setting);
  const [messageText, setMessageText] = useState("");
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Attachment[]>([]);
  const scrollListRef = useRef<{ scrollToTop: () => void; scrollToBottom: () => void }>(null);
  const [isSuggestReplyModalOpen, setIsSuggestReplyModalOpen] = useState(false);
  const [isAiTransformModalOpen, setIsAiTransformModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isWindowExpired, setIsWindowExpired] = useState(false);
  const [page, setPage] = useState(1);
  const [pendingScrollMessageId, setPendingScrollMessageId] = useState<string | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [isInteractiveModalOpen, setIsInteractiveModalOpen] = useState(false);
  const [isQuickReplyModalOpen, setIsQuickReplyModalOpen] = useState(false);
  const [isPaymentLinkModalOpen, setIsPaymentLinkModalOpen] = useState(false);
  const [isEcommerceModalOpen, setIsEcommerceModalOpen] = useState(false);
  const [isGoogleMeetModalOpen, setIsGoogleMeetModalOpen] = useState(false);
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAgentTypingRef = useRef(false);

  useEffect(() => {
    if (!messageText.trim()) {
      if (isAgentTypingRef.current) {
        isAgentTypingRef.current = false;
        socket.emit("whatsapp:agent_typing", {
          user_id: user?.id,
          contact_id: currentContactId,
          whatsapp_phone_number_id: currentPhoneNumberId,
          isTyping: false,
        });
      }
      return;
    }

    if (!isAgentTypingRef.current) {
      isAgentTypingRef.current = true;
      socket.emit("whatsapp:agent_typing", {
        user_id: user?.id,
        contact_id: currentContactId,
        whatsapp_phone_number_id: currentPhoneNumberId,
        isTyping: true,
      });
    }

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      isAgentTypingRef.current = false;
      socket.emit("whatsapp:agent_typing", {
        user_id: user?.id,
        contact_id: currentContactId,
        whatsapp_phone_number_id: currentPhoneNumberId,
        isTyping: false,
      });
    }, 3000);
  }, [messageText, currentContactId, currentPhoneNumberId, user?.id]);
  const [interactiveType, setInteractiveType] = useState<"button" | "list">("button");
  const [dateFilters, setDateFilters] = useState<{ startDate?: string; endDate?: string }>({});
  const activeFilterCount = Object.keys(dateFilters).length;
  const { userSetting } = useAppSelector((state) => state.setting);
  const userSettingData = userSetting?.data;

  const {
    currentData: messagesData,
    isLoading,
    isFetching,
    refetch,
  } = useGetMessagesQuery(
    {
      contact_id: currentContactId,
      whatsapp_phone_number_id: currentPhoneNumberId || undefined,
      start_date: dateFilters.startDate,
      end_date: dateFilters.endDate,
      page,
      limit: 20,
    },
    { skip: !currentContactId || !currentPhoneNumberId }
  );

  const lastInboundTime = (() => {
    if (!messagesData?.messages) return null;
    const allInbound = messagesData.messages
      .flatMap((dg) => dg.messageGroups)
      .flatMap((mg) => mg.messages)
      .filter((m) => m.direction === "inbound");

    if (allInbound.length === 0) return null;
    return allInbound.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt;
  })();

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [createAttachment] = useCreateAttachmentMutation();
  const [updateStatus, { isLoading: isStatusUpdating }] = useUpdateChatStatusMutation();

  const handleToggleStatus = async () => {
    if (!selectedChat || !selectedPhoneNumberId) return;
    const newStatus = selectedChat.contact.chat_status === "open" ? "resolved" : "open";
    try {
      await updateStatus({
        contact_id: currentContactId!,
        whatsapp_phone_number_id: currentPhoneNumberId!,
        status: newStatus,
      }).unwrap();
      dispatch(updateSelectedChatStatus(newStatus));
      toast.success(`Chat marked as ${newStatus}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update chat status");
    }
  };

  const handleImageClick = (url: string, isFromInput = false) => {
    let allImages: string[] = [];

    const getMessageImageUrl = (message: any): string | null => {
      if (message.messageType === "image" && message.fileUrl) {
        return message.fileUrl;
      }
      if (message.messageType === "interactive" && message.fileUrl) {
        const ext = message.fileUrl.split(".").pop()?.toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) {
          return message.fileUrl;
        }
      }
      if ((message.messageType === "template" || message.messageType === "carousel") && message.template) {
        const template = message.template;
        if (template.header && template.header.format !== "text" && template.header.format !== "location") {
          const mediaUrl = message.fileUrl || template.header.media_url;
          if (mediaUrl) {
            const ext = mediaUrl.split(".").pop()?.toLowerCase().split("?")[0] || "";
            const rawFormat = template.header.format === "media" ? template.header.media_type : template.header.format;
            const format = (["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? "image" : rawFormat)?.toLowerCase();
            if (format === "image") {
              return mediaUrl;
            }
          }
        }
      }
      return null;
    };

    if (isFromInput) {
      allImages = selectedMedia
        .filter((m) => m.mimeType.startsWith("image/"))
        .map((m) => getResolvedImageUrl(m.fileUrl));
    } else {
      const rawImages = messagesData?.messages.flatMap((dateGroup) =>
        dateGroup.messageGroups.flatMap((group) =>
          group.messages.map(getMessageImageUrl).filter(Boolean) as string[]
        )
      ) || [];
      allImages = rawImages.map((src) => getResolvedImageUrl(src));
    }

    const resolvedClickedUrl = getResolvedImageUrl(url);
    let index = allImages.indexOf(resolvedClickedUrl);

    if (index === -1) {
      allImages.push(resolvedClickedUrl);
      index = allImages.length - 1;
    }

    dispatch(openPreview({ images: allImages, index }));
  };

  const handleSend = async () => {
    if ((!messageText.trim() && selectedMedia.length === 0) || !selectedChat || !selectedPhoneNumberId) return;

    // Capture current state values
    const currentMessageText = messageText;
    const currentSelectedMedia = [...selectedMedia];
    const currentReplyToMessage = replyToMessage;

    // Clear input fields immediately (Realtime)
    setMessageText("");
    setSelectedMedia([]);
    dispatch(clearReplyToMessage());

    try {
      // Use captured values instead of state
      const localMedia = currentSelectedMedia.filter((m: any) => m.localFile);
      const remoteMedia = currentSelectedMedia.filter((m: any) => !m.localFile);

      if (localMedia.length > 0) {
        const formData = new FormData();
        
        localMedia.forEach((m: any) => {
          formData.append("file_url", m.localFile);
        });

        remoteMedia.forEach((m: any) => {
          formData.append("mediaUrls", m.fileUrl);
        });

        formData.append("whatsapp_phone_number_id", currentPhoneNumberId!);
        formData.append("contact_id", currentContactId!);
        formData.append("message", currentMessageText);
        formData.append("provider", "business_api");

        const totalCount = localMedia.length + remoteMedia.length;
        if (totalCount === 1) {
          const firstLocal = localMedia[0] as any;
          const msgType = firstLocal.mimeType.startsWith("image/") ? "image" : firstLocal.mimeType.startsWith("video/") ? "video" : "document";
          formData.append("type", msgType);
          formData.append("messageType", msgType);
        } else {
          formData.append("type", "text");
          formData.append("messageType", "text");
        }

        if (currentReplyToMessage) {
          formData.append("replyMessageId", currentReplyToMessage.wa_message_id || currentReplyToMessage.id);
        }

        await sendMessage(formData).unwrap();
      } else {
        const payload: SendMessagePayload = {
          whatsapp_phone_number_id: currentPhoneNumberId!,
          contact_id: currentContactId!,
          message: currentMessageText,
          type: "text",
          messageType: "text",
          replyMessageId: currentReplyToMessage?.wa_message_id || currentReplyToMessage?.id,
          provider: "business_api",
        } as SendMessagePayload;

        if (currentSelectedMedia.length > 0) {
          payload.mediaUrls = currentSelectedMedia.map((media) => media.fileUrl);
        }

        if (currentSelectedMedia.length === 1) {
          const firstMedia = currentSelectedMedia[0];
          payload.messageType = firstMedia.mimeType.startsWith("image/") ? "image" : firstMedia.mimeType.startsWith("video/") ? "video" : "document";
          payload.type = payload.messageType;
        }

        await sendMessage(payload).unwrap();
      }
    } catch (error: any) {
      // Restore state values on error
      setMessageText(currentMessageText);
      setSelectedMedia(currentSelectedMedia);
      if (currentReplyToMessage) {
        dispatch(setReplyToMessage(currentReplyToMessage));
      }

      toast.dismiss("upload-toast");
      toast.error(error?.data?.message || "Failed to send message");
    }
  };

  const handleDirectSend = async (text: string) => {
    if (!text.trim() || !selectedChat || !selectedPhoneNumberId) return;
    try {
      const payload: SendMessagePayload = {
        whatsapp_phone_number_id: currentPhoneNumberId!,
        contact_id: currentContactId!,
        message: text,
        type: "text",
        messageType: "text",
        replyMessageId: replyToMessage?.wa_message_id || replyToMessage?.id,
        provider: "business_api",
      } as SendMessagePayload;

      await sendMessage(payload).unwrap();
      toast.success("Message sent");
      dispatch(clearReplyToMessage());
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send message");
    }
  };

  const handleAudioSend = async (blob: Blob) => {
    if (!selectedChat || !selectedPhoneNumberId) return;
    try {
      const formData = new FormData();
      formData.append("file_url", blob, "audio_message.ogg");
      formData.append("contact_id", currentContactId!);
      formData.append("whatsapp_phone_number_id", currentPhoneNumberId!);
      formData.append("type", "audio");
      formData.append("messageType", "audio");
      formData.append("message", "");
      if (replyToMessage) {
        formData.append("replyMessageId", replyToMessage.wa_message_id || replyToMessage.id);
      }

      await sendMessage(formData).unwrap();
      dispatch(clearReplyToMessage());
      setIsAudioRecording(false);
      toast.success("Audio message sent");
    } catch (error: any) {
      toast.error(error?.data?.error || error?.message || "Failed to send audio message");
    }
  };

  const handleLocationSend = async (location: { latitude: number; longitude: number; address?: string }) => {
    if (!selectedChat || !selectedPhoneNumberId) return;

    try {
      const payload: SendMessagePayload = {
        whatsapp_phone_number_id: currentPhoneNumberId!,
        contact_id: currentContactId!,
        type: "location",
        messageType: "location",
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address || "Location",
          name: location.address || "Location",
        },
        replyMessageId: replyToMessage?.wa_message_id || replyToMessage?.id,
      };

      await sendMessage(payload).unwrap();
      dispatch(clearReplyToMessage());
      toast.success("Location shared successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to share location");
    }
  };

  const handleInteractiveClick = (type: "button" | "list") => {
    setInteractiveType(type);
    setIsInteractiveModalOpen(true);
  };

  const handleInteractiveSend = async (interactivePayload: Partial<SendMessagePayload>) => {
    if (!selectedChat || !selectedPhoneNumberId) return;

    try {
      const payload: SendMessagePayload = {
        whatsapp_phone_number_id: currentPhoneNumberId!,
        contact_id: currentContactId!,
        type: "interactive",
        messageType: "interactive",
        replyMessageId: replyToMessage?.wa_message_id || replyToMessage?.id,
        ...interactivePayload,
      } as SendMessagePayload;

      await sendMessage(payload).unwrap();
      dispatch(clearReplyToMessage());
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Failed to send interactive message");
      throw error;
    }
  };

  const handlePaymentLinkSend = async (paymentPayload: Partial<SendMessagePayload>) => {
    if (!selectedChat || !selectedPhoneNumberId) return;

    try {
      const payload: SendMessagePayload = {
        whatsapp_phone_number_id: currentPhoneNumberId!,
        contact_id: currentContactId!,
        messageType: "payment_link",
        ...paymentPayload,
      } as SendMessagePayload;

      const response: any = await sendMessage(payload).unwrap();
      toast.success(response?.message || "Payment link sent successfully");
      dispatch(clearReplyToMessage());
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Failed to send payment link");
    }
  };

  const handleGoogleMeetSend = async (googleMeetPayload: { google_account_id: string; meet_start_time: string; meet_end_time: string }) => {
    if (!selectedChat || !selectedPhoneNumberId) return;

    try {
      const payload: SendMessagePayload = {
        whatsapp_phone_number_id: currentPhoneNumberId!,
        contact_id: currentContactId!,
        type: "google_meet" as any,
        messageType: "google_meet" as any,
        provider: "business_api",
        ...googleMeetPayload,
      } as any;

      await sendMessage(payload).unwrap();
      toast.success("Google Meet link created and sent!");
      dispatch(clearReplyToMessage());
    } catch (error: any) {
      toast.error(error?.data?.error || error?.message || "Failed to create Google Meet link");
    }
  };

  const handleFileSelect = (file: File) => {};

  const handleMediaSelect = (media: Attachment[]) => {
    setSelectedMedia((prev) => {
      const existingIds = new Set(prev.map((m) => m._id));
      const newMedia = media.filter((m) => !existingIds.has(m._id));
      return [...prev, ...newMedia];
    });
  };

  const removeMedia = (id: string) => {
    setSelectedMedia((prev) => prev.filter((m) => m._id !== id));
  };

  const addEmoji = (emoji: string) => {
    setMessageText((prev) => prev + emoji);
  };

  const onToggleProfile = () => {
    dispatch(setProfileToggle());
  };

  const getChatContextMessages = (): SuggestReplyMessage[] | null => {
    if (!messagesData?.messages) return null;

    const allMessages = messagesData.messages.flatMap((dg) => dg.messageGroups.flatMap((mg) => mg.messages.filter((m) => m.messageType === "text")));

    if (allMessages.length === 0) return null;

    return allMessages.slice(-10).map((m) => ({
      role: m.direction === "inbound" ? "customer" : "agent",
      content: m.content || "",
    }));
  };

  const handleUseReply = (reply: string) => {
    setMessageText(reply);
  };

  const handleTransformSuccess = (transformedText: string) => {
    setMessageText(transformedText);
  };

  const handleSidebar = () => {
    dispatch(
      setLeftSidebartoggle({
        isMobile: window.innerWidth <= 991,
      })
    );
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
    setPendingScrollMessageId(null);
  }, [currentContactId]);

  useEffect(() => {
    if (!pendingScrollMessageId) return;

    // Check if the message is now in the DOM
    const messageElement = document.getElementById(`message-${pendingScrollMessageId}`);
    if (messageElement) {
      toast.dismiss("scroll-loading");
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      messageElement.classList.add("bg-primary/10", "dark:bg-primary/30", "transition-colors", "duration-500", "py-5");
      setTimeout(() => {
        messageElement.classList.remove("bg-primary/10", "dark:bg-primary/30", "transition-colors", "duration-500", "py-5");
      }, 2000);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPendingScrollMessageId(null);
      return;
    }

    // If it is not in the DOM, check if we are currently fetching
    if (isFetching || isLoading) {
      return; // Wait for the fetch to complete
    }

    // If we are not fetching, check if we have more messages to load
    const hasMore = messagesData?.pagination?.hasMore || false;
    if (hasMore) {
      toast.loading("Loading older messages to find match...", { id: "scroll-loading" });
      // Load the next page
      setPage((prev) => prev + 1);
    } else {
      toast.error("Message not found in history", { id: "scroll-loading" });
      setPendingScrollMessageId(null);
    }
  }, [pendingScrollMessageId, messagesData, isFetching, isLoading]);

  useEffect(() => {
    if (lastInboundTime) {
      const now = new Date();
      const expiry = new Date(new Date(lastInboundTime).getTime() + 24 * 60 * 60 * 1000);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsWindowExpired(now > expiry);
    } else {
      setIsWindowExpired(false);
    }
  }, [lastInboundTime]);

  const handleTimerExpire = useCallback(() => {
    setIsWindowExpired(true);
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      if (currentContactId && currentPhoneNumberId) {
        refetch();
      }
    };
    const updateScreen = () => {
      dispatch(setIsMobileScreen(window.innerWidth <= 991));
    };

    updateScreen();
    window.addEventListener("focus", handleFocus);
    window.addEventListener("resize", updateScreen);
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("resize", updateScreen);
    };
  }, [dispatch, currentContactId, currentPhoneNumberId, refetch]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (isAgentTypingRef.current) {
        socket.emit("whatsapp:agent_typing", {
          user_id: user?.id,
          contact_id: currentContactId,
          whatsapp_phone_number_id: currentPhoneNumberId,
          isTyping: false,
        });
      }
    };
  }, [currentContactId, currentPhoneNumberId, user?.id]);

  const handleMessageSelect = (messageId: string) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      messageElement.classList.add("bg-primary/10", "dark:bg-primary/30", "transition-colors", "duration-500", "py-5");
      setTimeout(() => {
        messageElement.classList.remove("bg-primary/10", "dark:bg-primary/30", "transition-colors", "duration-500", "py-5");
      }, 2000);
    } else {
      setPendingScrollMessageId(messageId);
    }
  };

  const handleGoToFullChat = () => {
    if (currentPhoneNumberId) {
      dispatch(selSelectPhoneNumber({ id: currentPhoneNumberId, skipClearChat: true }));
    }
    router.push(`${ROUTES.WAChat}?contact_id=${currentContactId}`);
  };

  if (!currentContactId) return null;

  return (
    <div className={cn("relative flex-1 flex flex-col h-full dark:bg-(--card-color)! text-slate-900 dark:text-white bg-white border dark:border-(--card-border-color) rounded-t-none rounded-lg border-gray-100 overflow-hidden", !isModal && "max-w-[calc(100vw-364px)] [@media(max-width:991px)]:max-w-full")}>
      <div className="h-14 whitespace-nowrap flex-wrap [@media(min-width:768px)_and_(max-width:817px)]:h-30 [@media(max-width:430px)]:flex-wrap [@media(max-width:553px)]:h-35 [@media(max-width:430px)]:h-25 [@media(max-width:430px)]:gap-3 [@media(max-width:430px)]:p-2 [@media(max-width:452px)]:h-25 rounded-t-lg border-b border-gray-200 dark:bg-(--card-color)! dark:border-(--card-border-color) flex items-center justify-between sm:px-4 px-2 sticky top-0 z-10 cursor-pointer" style={{ backgroundColor: `${userSettingData?.theme_color == "null" ? "var(--background)" : "color-mix(in srgb, var(--chat-theme-color) , transparent 85%)"}` }}>
        {isMobileScreen && (
          <div onClick={handleSidebar} className="cursor-pointer">
            <ChevronLeft size={20} />
          </div>
        )}
        <div className="flex items-center gap-3 contact-info [@media(max-width:991px)]:mr-auto rtl:[@media(max-width:991px)]:mr-0 rtl:[@media(max-width:991px)]:ml-auto" onClick={() => !isModal && onToggleProfile()}>
          <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold overflow-hidden" style={{ backgroundColor: userSettingData?.theme_color == "null" ? "var(--primary)" : "var(--chat-theme-color)" }}>
            {currentContactAvatar ? <Image src={currentContactAvatar} alt={currentContactName || ""} width={40} height={40} className="object-cover" unoptimized /> : getInitials(app_name || "W")}
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="font-semibold text-sm truncate [@media(max-width:390px)]:max-w-16.5">
              {displayName}
            </h3>
            {displaySubName && (
              <span className="text-[11px] text-slate-500 dark:text-gray-400 font-medium mt-0.5 leading-none">
                {displaySubName}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center sm:gap-1 gap-0 [@media(max-width:430px)]:ml-auto rtl:[@media(max-width:430px)]:ml-0 rtl:[@media(max-width:430px)]:mr-auto [@media(max-width:430px)]:flex-wrap">
          {lastInboundTime && !isBaileys && (
            <div className="mr-2">
              <WhatsAppTimer key={currentContactId} lastInboundTime={lastInboundTime} onExpire={handleTimerExpire} />
            </div>
          )}
          {isModal && (
            <Button variant="ghost" size="icon" onClick={handleGoToFullChat} className="text-slate-600 hover:text-(--chat-theme-color) dark:hover:text-(--chat-theme-color) dark:text-white" title="Go to Full Chat">
              <ChevronLeft className="rotate-180" size={20} />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleStatus}
            disabled={isStatusUpdating}
            className={cn("flex items-center gap-1.5 h-9 px-3 rounded-lg transition-all font-bold text-[12px] tracking-wider", selectedChat?.contact?.chat_status === "resolved" ? "border border-primary/20 bg-primary/10 text-primary hover:text-primary/70 hover:bg-primary20 dark:bg-(--page-body-bg)! dark:text-primary" : "border border-slate-300 bg-slate-100 text-slate-600 dark:border-(--card-border-color) hover:bg-slate-200 dark:bg-(--page-body-bg) dark:text-gray-400 hover:text-primary")}
            style={
              isCustom
                ? {
                    color: userSettingData?.theme_color == "null" ? "var(--primary)" : "var(--chat-theme-color)",
                    borderColor: selectedChat?.contact?.chat_status === "resolved" ? "var(--chat-theme-color)" : undefined,
                    backgroundColor: selectedChat?.contact?.chat_status === "resolved" ? (userSettingData?.theme_color == "null" ? "var(--light-primary)" : "color-mix(in srgb, var(--chat-theme-color), transparent 90%)") : undefined,
                  }
                : {}
            }
          >
            {isStatusUpdating ? <Loader2 size={14} className="animate-spin" /> : selectedChat?.contact?.chat_status === "open" ? "Resolve" : "Reopen"}
          </Button>
          <PlanFeature feature="template_bots">
            {!isAgent && (
              <Button variant="ghost" size="icon" onClick={() => {
                const activePlatform = (typeof window !== "undefined" && localStorage.getItem("selectedChannel")) || "whatsapp";
                router.push(`${ROUTES.MessageCampaignsAdd}?contact_id=${currentContactId}&platform=${activePlatform}&redirect_to=${isModal ? ROUTES.ContactDirectory : ROUTES.WAChat}`);
              }} className="dark:hover:bg-(--table-hover) dark:text-white transition-colors" style={isCustom ? { color: "var(--chat-theme-color)" } : {}} title="Send Template">
                <LayoutTemplate size={20} />
              </Button>
            )}
          </PlanFeature>
          {!isModal && (
            <>
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)} className={isSearchOpen ? "text-primary bg-light-primary dark:bg-(--card-color) dark:hover:bg-(--table-hover) " : "text-slate-600 hover:text-primary dark:hover:text-primary dark:text-white"}>
                <Search size={20} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsDateFilterOpen(true)} className={`relative ${activeFilterCount > 0 ? "text-primary bg-light-primary dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover)" : "text-slate-600 hover:text-primary dark:hover:text-primary dark:text-white"}`}>
                <Filter size={20} />
                {activeFilterCount > 0 && <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={onToggleProfile}>
                <MoreVertical size={20} className="text-slate-600 dark:text-white hover:text-primary dark:hover:text-primary" />
              </Button>
            </>
          )}
        </div>
      </div>

      {currentContactId && currentPhoneNumberId && !isModal && <MessageSearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} contactId={currentContactId} phoneNumberId={currentPhoneNumberId} onMessageSelect={handleMessageSelect} />}

      <div className="flex-1 overflow-hidden flex flex-col relative">
        <div
          className={`absolute inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat transition-all dark:bg-(--card-color)! duration-500 ${userSettingData?.bg_image !== null ? "var(--chat-bg-image) opacity-60" : userSettingData?.bg_color == "null" ? "opacity-40 bg-[url('/assets/images/1.png')]!" : "opacity-40 bg-[url('/assets/images/1.png')]!"}`}
          style={{
            backgroundImage: userSettingData?.bg_image !== null ? "var(--chat-bg-image)" : userSettingData?.bg_color ? undefined : "bg-[url('/assets/images/1.png')]!",
            backgroundColor: userSettingData?.bg_image == null ? "var(--chat-bg-color)" : "",
          }}
        />
        <div className="flex-1 relative z-10 flex flex-col min-h-0 pt-2">
          <ChatMessageList key={currentContactId} ref={scrollListRef} data={messagesData} isLoading={isLoading || (isFetching && !messagesData)} isFetching={isFetching} onLoadMore={() => setPage((prev) => prev + 1)} onImageClick={(url) => handleImageClick(url, false)} isWindowExpired={isWindowExpired} />
        </div>
      </div>

      {selectedMedia.length > 0 && (
        <div className="relative p-3 bg-slate-50 dark:bg-(--table-hover) border-t border-gray-200 dark:border-(--card-border-color)">
          <div className="flex justify-between pb-2">
            <div className="flex flex-col justify-center">
              <span className="text-xs font-semibold text-primary bg-light-primary dark:bg-primary/10 px-2 py-1 rounded-md border border-[var(--primary-opacity-20)] dark:border-primary/20">{selectedMedia.length} files selected</span>
            </div>
            <Button onClick={() => setSelectedMedia([])} className="absolute bg-[unset]! p-0! h-[unset]! top-2! right-2! text-slate-400! hover:text-rose-500! transition-colors">
              <X size={18} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {selectedMedia.map((media) => (
              <div key={media._id} className="relative group w-20 h-20 border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm cursor-pointer" onClick={() => media.mimeType.startsWith("image/") && handleImageClick(media.fileUrl, true)}>
                {media.mimeType.startsWith("image/") ? (
                  <>
                    <Image src={media.fileUrl} alt={media.fileName} width={80} height={80} className="w-full h-full rounded-lg object-cover transition-transform group-hover:scale-110" unoptimized />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity flex items-center justify-center">
                      <Search size={16} className="text-white scale-75 group-hover:scale-100 transition-transform duration-300" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-1 text-center">
                    <span className="text-2xl mb-1">📄</span>
                    <span className="text-[10px] text-slate-500 truncate w-full px-1">{media.fileName}</span>
                  </div>
                )}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeMedia(media._id);
                  }}
                  className="absolute -top-1! -right-1! bg-rose-500! text-white! h-[unset]! rounded-full! p-0.5! opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 hover:bg-rose-600"
                >
                  <X size={12} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedChat?.contact?.chat_status === "resolved" ? (
        <ResolvedChatBanner contactId={currentContactId!} phoneNumberId={currentPhoneNumberId!} />
      ) : (!isWindowExpired || isBaileys) && (lastInboundTime || isBaileys) ? (
        <div className="relative border-t border-gray-200 dark:border-(--card-border-color) rounded-b-lg overflow-hidden" style={isCustom ? { backgroundColor: "color-mix(in srgb, var(--chat-theme-color), transparent 97%)" } : {}}>
          {replyToMessage && (
            <div className="mx-2 mt-2 p-2 bg-slate-100 dark:bg-(--page-body-bg) border-l-4 border-primary rounded-r-lg flex justify-between items-start animate-in slide-in-from-bottom-1 duration-200">
              <div className="flex-1 min-w-0 pr-2">
                <div className="text-[10px] font-bold text-primary uppercase mb-0.5 flex items-center gap-1.5">
                  {replyToMessage.messageType === "image" && <ImageIcon size={10} />}
                  {replyToMessage.messageType === "video" && <Video size={10} />}
                  {replyToMessage.messageType === "audio" && <Mic size={10} />}
                  {replyToMessage.messageType === "document" && <FileText size={10} />}
                  Replying to {replyToMessage.messageType}
                </div>
                <div className="text-[13px] text-slate-600 dark:text-gray-400 break-all mt-2">{replyToMessage.content}</div>
              </div>
              <Button onClick={() => dispatch(clearReplyToMessage())} className="text-slate-400! bg-[unset]! hover:text-rose-500! p-0! h-[unset] transition-colors">
                <X size={16} />
              </Button>
            </div>
          )}
          {isAudioRecording ? (
            <div className="w-full bg-transparent">
              <AudioRecorder onSend={handleAudioSend} onCancel={() => setIsAudioRecording(false)} isSending={isSending} />
            </div>
          ) : (
            <div className="relative flex items-center gap-3 p-2 bg-transparent [@media(max-width:535px)]:flex-col group">
              <div className="flex items-center gap-2 pl-2 [@media(max-width:535px)]:mr-auto rtl:[@media(max-width:535px)]:mr-0 rtl:[@media(max-width:535px)]:ml-auto">
                <EmojiPicker onEmojiSelect={addEmoji} />

                <PlanFeature feature="ai_prompts">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSuggestReplyModalOpen(true)}
                    className="bg-gray-100! hover:bg-gray-100! rounded-lg dark:bg-(--page-body-bg)! dark:hover:bg-(--table-hover)! dark:text-gray-400 transition-colors"
                    style={{ color: userSettingData?.theme_color == "null" ? "var(--primary)" : "var(--chat-theme-color)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--chat-theme-color), transparent 90%)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "";
                    }}
                    title="AI Suggest Reply"
                  >
                    <BotMessageSquare size={22} />
                  </Button>
                </PlanFeature>

                <ChatAttachmentMenu isBaileys={isBaileys} onFileSelect={handleFileSelect} onMediaLibraryOpen={() => setIsMediaModalOpen(true)} onLocationClick={() => setIsLocationModalOpen(true)} onInteractiveClick={handleInteractiveClick} onAudioClick={() => setIsAudioRecording(true)} onPaymentLinkClick={() => setIsPaymentLinkModalOpen(true)} onEcommerceClick={() => setIsEcommerceModalOpen(true)} onGoogleMeetClick={() => setIsGoogleMeetModalOpen(true)} />

                <PlanFeature feature="quick_replies">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsQuickReplyModalOpen(true)}
                    className="bg-gray-100 rounded-lg dark:bg-(--page-body-bg) dark:hover:bg-(--table-hover)! hover:bg-gray-100! dark:text-gray-400 transition-colors"
                    style={{ color: userSettingData?.theme_color == "null" ? "var(--primary)" : "var(--chat-theme-color)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--chat-theme-color), transparent 90%)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "";
                    }}
                    title="Quick Reply"
                  >
                    <MessageSquareQuote size={22} />
                  </Button>
                </PlanFeature>
              </div>

              {/* Input Center */}
              <div className="flex-1 relative flex items-center gap-2 bg-transparent [@media(max-width:535px)]:w-[85%] [@media(max-width:380px)]:w-[70%] [@media(max-width:535px)]:mr-auto rtl:[@media(max-width:535px)]:ml-auto rtl:[@media(max-width:535px)]:mr-0 rounded-lg dark:border-(--card-border-color) transition-all">
                <Textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={isLoading}
                  placeholder={isLoading ? "Loading messages..." : "Type a message..."}
                  className="custom-scrollbar whitespace-break-spaces break-all h-11 py-2.5 px-4 bg-(--input-color) text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-medium resize-none overflow-y-auto"
                />

                <PlanFeature feature="ai_prompts">
                  {messageText.trim() && (
                    <Button onClick={() => setIsAiTransformModalOpen(true)} className="p-1.5 bg-[unset]! rounded-lg text-primary hover:text-primary hover:bg-light-primary dark:hover:bg-(--table-hover) dark:bg-(--dark-sidebar) transition-all group" title="AI Text Transform">
                      <Sparkles size={18} className="group-hover:animate-pulse" />
                    </Button>
                  )}
                </PlanFeature>
              </div>

              <div className="pr-1 [@media(max-width:535px)]:absolute [@media(max-width:535px)]:right-2.5 rtl:[@media(max-width:535px)]:left-2.5! rtl:[@media(max-width:535px)]:right-[unset]! [@media(max-width:535px)]:bottom-2">
                <Button onClick={handleSend} disabled={(!messageText.trim() && selectedMedia.length === 0) || isSending || isLoading} className={cn("h-10 w-10 rounded-lg flex items-center justify-center transition-all duration-300", messageText.trim() || selectedMedia.length > 0 ? "text-white shadow-primary/20" : "bg-slate-100 dark:bg-primary dark:text-gray-300 text-slate-400")} style={messageText.trim() || selectedMedia.length > 0 ? { backgroundColor: userSettingData?.theme_color == "null" ? "var(--primary)" : "var(--chat-theme-color)" } : {}}>
                  {isSending || isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <ExpiredWindowBanner contactId={currentContactId!} isAgent={isAgent} isNew={!lastInboundTime} />
      )}

      <MediaSelectionModal isOpen={isMediaModalOpen} onClose={() => setIsMediaModalOpen(false)} onSelect={handleMediaSelect} />
      <SuggestReplyModal isOpen={isSuggestReplyModalOpen} onClose={() => setIsSuggestReplyModalOpen(false)} lastMessages={getChatContextMessages()} onUseReply={handleUseReply} />
      <AiTextTransformModal isOpen={isAiTransformModalOpen} onClose={() => setIsAiTransformModalOpen(false)} message={messageText} onSuccess={handleTransformSuccess} />
      <LocationPickerModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} onSend={handleLocationSend} />
      <InteractiveMessageModal isOpen={isInteractiveModalOpen} onClose={() => setIsInteractiveModalOpen(false)} type={interactiveType} onSend={handleInteractiveSend} />
      <QuickReplyModal isOpen={isQuickReplyModalOpen} onClose={() => setIsQuickReplyModalOpen(false)} onSelect={handleUseReply} onDirectSend={handleDirectSend} />
      <PaymentLinkModal isOpen={isPaymentLinkModalOpen} onClose={() => setIsPaymentLinkModalOpen(false)} onSend={handlePaymentLinkSend} isSending={isSending} />
      <MessageDateFilterModal isOpen={isDateFilterOpen} onClose={() => setIsDateFilterOpen(false)} onApply={setDateFilters} initialFilters={dateFilters} />
      <EcommerceProductModal isOpen={isEcommerceModalOpen} onClose={() => setIsEcommerceModalOpen(false)} />
      <GoogleMeetModal isOpen={isGoogleMeetModalOpen} onClose={() => setIsGoogleMeetModalOpen(false)} onSend={handleGoogleMeetSend} isSending={isSending} />
    </div>
  );
};

export default ChatArea;
