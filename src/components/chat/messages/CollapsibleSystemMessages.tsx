import { cn } from "@/src/lib/utils";
import { CollapsibleSystemMessagesProps } from "@/src/types/components/chat";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import SystemMessage from "./SystemMessage";
import { Button } from "@/src/elements/ui/button";

const CollapsibleSystemMessages: React.FC<CollapsibleSystemMessagesProps> = ({ messages }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (messages.length <= 2) {
    return (
      <>
        {messages.map((msg) => (
          <SystemMessage key={msg.id} message={msg} />
        ))}
      </>
    );
  }

  const visibleMessages = isExpanded ? messages : messages.slice(0, 2);
  const remainingCount = messages.length - 2;

  return (
    <div className="flex flex-col items-center w-full space-y-2 my-1">
      {visibleMessages.map((msg) => (
        <SystemMessage key={msg.id} message={msg} />
      ))}

      <Button onClick={() => setIsExpanded(!isExpanded)} className={cn("mt-1 flex items-center gap-1.5 text-[11px] font-bold py-1 px-3 rounded-full transition-all duration-200", "bg-slate-50 dark:bg-(--page-body-bg) text-primary hover:bg-light-primary dark:hover:bg-(--table-hover) border border-[var(--primary-opacity-20)]/50 dark:border-primary/10", "hover:shadow-sm transform hover:-translate-y-0.5")}>
        {isExpanded ? (
          <>
            Show less <ChevronUp size={12} />
          </>
        ) : (
          <>
            Show {remainingCount} more updates <ChevronDown size={12} />
          </>
        )}
      </Button>
    </div>
  );
};

export default CollapsibleSystemMessages;
