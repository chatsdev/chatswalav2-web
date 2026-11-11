/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatMessage, SendMessagePayload } from "@/src/types/components/chat";

export const createOptimisticMessages = (payload: SendMessagePayload | FormData, reply_message: any = null): ChatMessage[] => {
  const messages: ChatMessage[] = [];
  const { dateLabel, dateKey } = getTodayDateInfo();

  let contact_id: string = "";
  let messageText: string = "";
  let replyMessageId: string | undefined;

  if (payload instanceof FormData) {
    contact_id = (payload.get("contact_id") as string) || "";
    messageText = (payload.get("message") as string) || "";
    replyMessageId = payload.get("replyMessageId") as string;
  } else {
    contact_id = payload.contact_id;
    messageText = payload.message || "";
    replyMessageId = payload.replyMessageId;
  }

  // Helper to determine media type from filename or mimetype
  const getMediaType = (mimeType?: string, fileName?: string): string => {
    if (mimeType) {
      if (mimeType.startsWith("image/")) return "image";
      if (mimeType.startsWith("video/")) return "video";
      if (mimeType.startsWith("audio/")) return "audio";
    }
    if (fileName) {
      const ext = fileName.split(".").pop()?.toLowerCase();
      if (ext && ["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) return "image";
      if (ext && ["mp4", "mov", "avi", "mkv"].includes(ext)) return "video";
      if (ext && ["mp3", "ogg", "wav", "m4a"].includes(ext)) return "audio";
    }
    return "document";
  };

  const getMediaUrlType = (url: string): string => {
    const ext = url.split(".").pop()?.toLowerCase().split("?")[0] || "";
    if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) return "image";
    if (["mp4", "mov", "avi", "mkv"].includes(ext)) return "video";
    if (["mp3", "ogg", "wav", "m4a"].includes(ext)) return "audio";
    return "document";
  };

  // Check if we have multiple media
  const mediaItems: { file?: File | Blob; url?: string; type: string }[] = [];

  if (payload instanceof FormData) {
    const files = payload.getAll("file_url");
    const urls = payload.getAll("mediaUrls");

    files.forEach((file) => {
      if (file && typeof file !== "string") {
        const fileObj = file as File;
        mediaItems.push({
          file: fileObj,
          type: getMediaType(fileObj.type, fileObj.name),
        });
      }
    });

    urls.forEach((url) => {
      if (url && typeof url === "string") {
        mediaItems.push({
          url,
          type: getMediaUrlType(url),
        });
      }
    });
  } else {
    const urls = payload.mediaUrls || [];
    urls.forEach((url) => {
      mediaItems.push({
        url,
        type: getMediaUrlType(url),
      });
    });
  }

  if (mediaItems.length > 0) {
    // Generate an optimistic message for each media item
    mediaItems.forEach((item, index) => {
      let fileUrl: string | null = null;
      if (item.file) {
        fileUrl = URL.createObjectURL(item.file);
      } else if (item.url) {
        fileUrl = item.url;
      }

      const caption = messageText
        ? (mediaItems.length > 1 ? `${messageText} (${index + 1}/${mediaItems.length})` : messageText)
        : null;

      messages.push({
        id: `temp-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        content: caption,
        interactiveData: null,
        messageType: item.type as any,
        fileUrl,
        template: null,
        createdAt: new Date().toISOString(),
        can_chat: true,
        delivered_at: null,
        delivery_status: "pending",
        is_delivered: false,
        is_seen: false,
        seen_at: null,
        wa_status: null,
        direction: "outbound",
        reply_message,
        sender: {
          id: "current-user",
          name: "You",
          avatar: null,
        },
        recipient: {
          id: contact_id,
          name: "Contact",
          avatar: null,
        },
      });
    });
  } else {
    // Normal non-media message (text, location, interactive, payment_link, etc.)
    let messageType: string = "text";
    let content: string | null = null;
    let interactiveData: any = null;

    if (payload instanceof FormData) {
      messageType = (payload.get("messageType") as string) || (payload.get("type") as string) || "text";
      content = (payload.get("message") as string) || null;
    } else {
      messageType = payload.messageType || payload.type || "text";
      content = payload.message || null;

      if (messageType === "location" && payload.location) {
        content = JSON.stringify({
          latitude: payload.location.latitude,
          longitude: payload.location.longitude,
          address: payload.location.address || "Location",
          name: payload.location.name || "Location",
        });
      } else if (messageType === "interactive") {
        interactiveData = {
          interactiveType: payload.interactiveType as "button" | "list",
          buttons: payload.buttonParams,
          list: payload.listParams,
        };
      } else if (messageType === "reaction") {
        content = (payload as any).reactionEmoji || null;
      } else if (messageType === "payment_link") {
        const { amount, currency, description } = payload as any;
        content = `💳 *Payment Required*\n\n*Description:* ${description}\n*Amount:* ${currency} ${amount}\n\n_Generating payment link..._`;
      } else if (messageType === "google_meet") {
        content = "📅 *Google Meet Scheduled*\n\n_Generating Google Meet link..._";
      }
    }

    messages.push({
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      interactiveData,
      messageType: messageType as any,
      fileUrl: null,
      template: null,
      createdAt: new Date().toISOString(),
      can_chat: true,
      delivered_at: null,
      delivery_status: "pending",
      is_delivered: false,
      is_seen: false,
      seen_at: null,
      wa_status: null,
      direction: "outbound",
      reply_message,
      sender: {
        id: "current-user",
        name: "You",
        avatar: null,
      },
      recipient: {
        id: contact_id,
        name: "Contact",
        avatar: null,
      },
    });
  }

  return messages;
};

export const createOptimisticMessage = (payload: SendMessagePayload | FormData, reply_message: any = null): ChatMessage => {
  const messages = createOptimisticMessages(payload, reply_message);
  return messages[0];
};

export const getTodayDateInfo = () => {
  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const dateKey = today.toISOString().split("T")[0];

  return { dateLabel, dateKey, today };
};
