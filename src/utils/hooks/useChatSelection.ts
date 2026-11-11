import { useState } from "react";
import { toast } from "sonner";
import { useDeleteChatMutation } from "@/src/redux/api/chatApi";
import { RecentChatResponseItem } from "@/src/types/components/chat";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { selectChat } from "@/src/redux/reducers/messenger/chatSlice";
import { RootState } from "@/src/redux/store";

interface UseChatSelectionProps {
  workspaceId?: string;
  sortedChats: RecentChatResponseItem[];
}

export const useChatSelection = ({ workspaceId, sortedChats }: UseChatSelectionProps) => {
  const dispatch = useAppDispatch();
  const { selectedChat } = useAppSelector((state: RootState) => state.chat);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [deleteChat, { isLoading: isDeleting }] = useDeleteChatMutation();

  const handleToggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedContactIds([]);
  };

  const handleToggleChatSelection = (contactId: string) => {
    setSelectedContactIds((prev) => 
      prev.includes(contactId) 
        ? prev.filter((id) => id !== contactId) 
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContactIds.length === sortedChats.length) {
      setSelectedContactIds([]);
    } else {
      setSelectedContactIds(sortedChats.map((c) => c.contact.id));
    }
  };

  const handleDeleteChats = async () => {
    if (!workspaceId || selectedContactIds.length === 0) return;

    try {
      const response = await deleteChat({
        workspace_id: workspaceId,
        contact_ids: selectedContactIds,
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "Chats deleted successfully");
        
        if (selectedChat && selectedContactIds.includes(selectedChat.contact.id)) {
          dispatch(selectChat(null));
        }

        setIsDeleteModalOpen(false);
        setIsSelectionMode(false);
        setSelectedContactIds([]);
      } else {
        toast.error(response.message || "Failed to delete chats");
      }
    } catch (error) {
      console.error("Failed to delete chats:", error);
      toast.error("An error occurred while deleting chats");
    }
  };

  return {
    isSelectionMode,
    selectedContactIds,
    isDeleteModalOpen,
    isDeleting,
    setIsDeleteModalOpen,
    handleToggleSelectionMode,
    handleToggleChatSelection,
    handleSelectAll,
    handleDeleteChats,
  };
}; 
