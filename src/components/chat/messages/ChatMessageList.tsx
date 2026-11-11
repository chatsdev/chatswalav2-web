import { Button } from "@/src/elements/ui/button";
import { ChatMessageListProps } from "@/src/types/components/chat";
import { formatChatDate } from "@/src/utils";
import { ArrowDown, Loader2 } from "lucide-react";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ChatMessageSkeleton } from "../ChatSkeleton";
import MessageGroup from "./MessageGroup";

const ChatMessageList = forwardRef<{ scrollToTop: () => void; scrollToBottom: () => void }, ChatMessageListProps>(({ data, isLoading, onImageClick, isWindowExpired, isFetching, onLoadMore }, ref) => {
  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [isInitialScrollDone, setIsInitialScrollDone] = useState(false);

  const hasMore = data?.pagination?.hasMore || false;

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (!listRef.current) return;

    const scroll = () => {
      if (!listRef.current) return;
      const { scrollHeight, clientHeight } = listRef.current;
      listRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior,
      });
    };

    requestAnimationFrame(() => {
      scroll();
      if (behavior === "auto") {
        setTimeout(scroll, 100);
      }
    });
  };

  const scrollToTop = () => {
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useImperativeHandle(ref, () => ({
    scrollToTop,
    scrollToBottom: () => scrollToBottom("smooth"),
  }));

  // Handle initial scroll to bottom
  useEffect(() => {
    if (data?.messages && data.pagination?.page === 1) {
      const timeout = setTimeout(() => {
        scrollToBottom("auto");
        // Only set initial scroll done after a short delay to ensure rendering is complete
        setTimeout(() => setIsInitialScrollDone(true), 200);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [data?.pagination?.page]);

  const isRequestingRef = useRef(false);
  const lastScrollTop = useRef(0);

  const contentRef = useRef<HTMLDivElement>(null);
  const lastHeightRef = useRef(0);

  // Robust Scroll Anchoring using ResizeObserver on the content
  useEffect(() => {
    if (!contentRef.current || !listRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const newHeight = entries[0].contentRect.height;
      const oldHeight = lastHeightRef.current;

      // If height increased and we were near the top (loading more)
      if (oldHeight > 0 && newHeight > oldHeight && isRequestingRef.current) {
        const heightDiff = newHeight - oldHeight;
        if (listRef.current) {
          listRef.current.style.scrollBehavior = "auto";
          listRef.current.scrollTop += heightDiff;
        }
        
        // Reset request flag after successful adjustment
        if (!isFetching) {
          isRequestingRef.current = false;
        }
      }
      
      lastHeightRef.current = newHeight;
    });

    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [isFetching]);

  // Handle scroll events for infinite loading
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isScrollingUp = scrollTop < lastScrollTop.current;
    const isNearTop = scrollTop < 100;

    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 300);

    if (isNearTop && isScrollingUp && hasMore && !isFetching && !isLoading && isInitialScrollDone && !isRequestingRef.current) {
      isRequestingRef.current = true;
      onLoadMore?.();
    }

    lastScrollTop.current = scrollTop;
  };

  if (isLoading) {
    return <ChatMessageSkeleton />;
  }

  if (!data?.messages || data.messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-2">
        <p className="text-slate-400 text-sm">No messages yet. Send a message to start the conversation.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 relative flex flex-col min-h-0 overflow-hidden">
      <div ref={listRef} onScroll={handleScroll} className="flex-1 overflow-y-auto py-6 pb-0 px-4 space-y-8 custom-scrollbar" style={{ overflowAnchor: "none" }}>
        <div ref={contentRef} className="flex flex-col space-y-8 min-h-full">
          {/* Load More Trigger - Only show if there's more to load */}
          {hasMore && (
            <div ref={loadMoreTriggerRef} className="h-10 flex items-center justify-center shrink-0">
              {isFetching && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
            </div>
          )}

          {data.messages.map((dateGroup, idx) => (
            <div key={`${dateGroup.dateKey}-${idx}`} className="flex flex-col space-y-6">
              <div className="flex justify-center sticky top-1 z-10">
                <span className="px-3 py-1 rounded-full bg-slate-100/50 dark:bg-(--page-body-bg) backdrop-blur-sm text-[11px] font-bold text-slate-500 dark:text-gray-400 shadow-sm border border-slate-200/50 dark:border-(--card-border-color)">{formatChatDate(dateGroup.dateKey)}</span>
              </div>

              <div className="flex flex-col space-y-4">
                {dateGroup.messageGroups.map((group, index) => (
                  <MessageGroup key={`${dateGroup.dateKey}-${group.senderId}-${index}`} group={group} onImageClick={onImageClick} isWindowExpired={isWindowExpired} />
                ))}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {showScrollBottom && (
        <Button size="icon" variant="secondary" className="absolute bottom-6 inset-e-6 rounded-full shadow-lg bg-white dark:bg-(--page-body-bg) border border-slate-200 dark:border-(--card-border-color) animate-in fade-in zoom-in duration-200" onClick={() => scrollToBottom()}>
          <ArrowDown size={18} className="text-primary" />
        </Button>
      )}
    </div>
  );
});

ChatMessageList.displayName = "ChatMessageList";

export default ChatMessageList;
