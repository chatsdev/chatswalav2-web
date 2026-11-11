"use client";

import { Button } from "@/src/elements/ui/button";
import { ChatbotGridProps } from "@/src/types/replyMaterial";
import { Bot, Plus } from "lucide-react";
import ChatbotCard from "./ChatbotCard";
import Can from "../shared/Can";

const ChatbotGrid: React.FC<ChatbotGridProps> = ({ items, isLoading, onEdit, onDelete, onTrain, onAdd }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-44 rounded-2xl bg-white dark:bg-(--card-color) border border-slate-100 dark:border-(--card-border-color) animate-pulse shadow-sm" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-6">
        <div className="w-20 h-20 rounded-lg bg-slate-50 dark:bg-(--page-body-bg) flex items-center justify-center text-slate-300 dark:text-primary mb-6 border border-slate-100 dark:border-none">
          <Bot size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">No chatbots yet</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs font-medium mb-6">Create an AI assistant to handle automated customer inquiries for you.</p>
        <Can permission="create.chatbots">
          <Button onClick={onAdd} className="flex items-center gap-2 bg-primary text-white px-5 h-11 rounded-lg font-semibold text-sm active:scale-95 transition-all">
            <Plus size={18} />
            Create Chatbot
          </Button>
        </Can>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((chatbot) => (
        <ChatbotCard key={chatbot._id} chatbot={chatbot} onEdit={onEdit} onDelete={onDelete} onTrain={onTrain} />
      ))}
    </div>
  );
};

export default ChatbotGrid;
