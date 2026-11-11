/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCreateChatbotMutation, useDeleteChatbotMutation, useGetChatbotsQuery, useUpdateChatbotMutation } from "@/src/redux/api/chatbotApi";
import { useAppSelector } from "@/src/redux/hooks";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { Bot } from "lucide-react";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { Chatbot } from "@/src/types/chatbot";
import { ChatbotSectionProps } from "@/src/types/replyMaterial";
import React, { useState } from "react";
import { toast } from "sonner";
import ChatbotFormModal from "./ChatbotFormModal";
import ChatbotGrid from "./ChatbotGrid";
import ChatbotTrainSection from "./ChatbotTrainSection";

const ChatbotSection: React.FC<ChatbotSectionProps> = ({ wabaId, onToggleSidebar }) => {
  const router = useRouter();
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const isBaileys = selectedWorkspace?.waba_type === "baileys";
  const isConnected = isBaileys ? !!selectedWorkspace?.waba_id && selectedWorkspace?.connection_status === "connected" : !!selectedWorkspace?.waba_id;

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Chatbot | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);  
  const [trainingChatbot, setTrainingChatbot] = useState<Chatbot | null>(null);

  const { data: chatbotsData, isLoading, refetch } = useGetChatbotsQuery({ waba_id: wabaId }, { skip: !wabaId || !isConnected });
  const [createChatbot, { isLoading: isCreating }] = useCreateChatbotMutation();
  const [updateChatbot, { isLoading: isUpdating }] = useUpdateChatbotMutation();
  const [deleteChatbot, { isLoading: isDeleting }] = useDeleteChatbotMutation();

  const filteredChatbots = (chatbotsData?.data || []).filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCreateOrUpdate = async (data: any) => {
    try {
      if (editItem) {
        await updateChatbot({ id: editItem._id, data }).unwrap();
        toast.success("Chatbot updated successfully");
      } else {
        await createChatbot(data).unwrap();
        toast.success("Chatbot created successfully");
      }
      setIsModalOpen(false);
      setEditItem(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteChatbot(deleteId).unwrap();
      toast.success("Chatbot deleted successfully");
      setDeleteId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete chatbot");
    }
  };

  if (!isConnected) {
    return (
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="p-4 pt-0! sm:p-6 pb-0">
          <CommonHeader
            title="AI Chatbots"
            description="Manage your AI-powered assistants in one place"
            onToggleSidebar={onToggleSidebar}
          />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-20 h-20 rounded-lg bg-slate-50 dark:bg-(--page-body-bg) border border-slate-100 dark:border-(--card-border-color) shadow-sm flex items-center justify-center text-slate-300 mb-6 transition-transform">
            <div className="rounded-lg shadow-inner shadow-slate-100 dark:shadow-none">
              <Bot size={32} className="text-slate-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            No WABA Connected
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed text-sm">
            Please connect a WhatsApp Business Account to create and configure AI chatbot assistants.
          </p>
          <Button
            onClick={() => router.push(ROUTES.WABAConnection)}
            variant="outline"
            className="mt-8 h-11 px-6 rounded-lg border-primary text-primary hover:bg-primary/5 font-semibold transition-all"
          >
            Connect WABA
          </Button>
        </div>
      </div>
    );
  }

  if (trainingChatbot) {
    return (
      <ChatbotTrainSection
        chatbot={trainingChatbot}
        onBack={() => {
          setTrainingChatbot(null);
          refetch();
        }}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <div className="p-4 pt-0! sm:p-6 pb-0">
        <CommonHeader
          title="AI Chatbots"
          description="Manage your AI-powered assistants in one place"
          onSearch={setSearchTerm}
          searchTerm={searchTerm}
          searchPlaceholder="Search chatbots..."
          onRefresh={refetch}
          onAddClick={() => {
            setEditItem(null);
            setIsModalOpen(true);
          }}
          addLabel="Create Chatbot"
          addPermission="create.chatbots"
          isLoading={isLoading}
          onToggleSidebar={onToggleSidebar}
        />
      </div>

      <div className="flex-1 overflow-hidden min-h-0 p-4 sm:p-6 pt-0! flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-6 mt-4 flex flex-col min-h-0">
          <ChatbotGrid
            items={filteredChatbots}
            isLoading={isLoading}
            onEdit={(chatbot) => {
              setEditItem(chatbot);
              setIsModalOpen(true);
            }}
            onDelete={setDeleteId}
            onTrain={setTrainingChatbot}
            onAdd={() => setIsModalOpen(true)}
          />
        </div>
      </div>

      <ChatbotFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditItem(null);
        }}
        onSubmit={handleCreateOrUpdate}
        isLoading={isCreating || isUpdating}
        editItem={editItem}
        wabaId={wabaId}
      />

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} isLoading={isDeleting} title="Delete Chatbot" subtitle="Are you sure you want to delete this chatbot? This action cannot be undone." confirmText="Delete" variant="danger" />
    </div>
  );
};

export default ChatbotSection;
