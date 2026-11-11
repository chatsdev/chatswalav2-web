"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/elements/ui/dropdown-menu";
import { useDeleteChatMutation, useLazyGetMessagesQuery, useToggleSnoozeChatMutation } from "@/src/redux/api/chatApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { selectChat } from "@/src/redux/reducers/messenger/chatSlice";
import { RootState } from "@/src/redux/store";
import { exportToCSV } from "@/src/utils/exportUtils";
import {
  Bell,
  BellOff,
  ChevronDown,
  Download,
  Loader2,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { Button } from "@/src/elements/ui/button";
import { ChatListItemDropdownProps } from "@/src/types/components/chat";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Label } from "@/src/elements/ui/label";
import { Input } from "@/src/elements/ui/input";


const ChatListItemDropdown: React.FC<ChatListItemDropdownProps> = ({ contactId, contactNumber, phoneNumberId, isSnoozed }) => {
  const dispatch = useAppDispatch();
  const { selectedChat } = useAppSelector((state: RootState) => state.chat);
  const [getMessages, { isLoading }] = useLazyGetMessagesQuery();
  const [deleteChat, { isLoading: isDeleting }] = useDeleteChatMutation();
  const [toggleSnoozeChat, { isLoading: isSnoozing }] =
    useToggleSnoozeChatMutation();
  const { selectedWorkspace } = useAppSelector(
    (state: RootState) => state.workspace,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSnoozeModalOpen, setIsSnoozeModalOpen] = useState(false);
  const [snoozeTime, setSnoozeTime] = useState(10);
  const [snoozeLimit, setSnoozeLimit] = useState(3);

  const handleDeleteSingleChat = async () => {
    if (!selectedWorkspace?._id) return;

    try {
      const response = await deleteChat({
        workspace_id: selectedWorkspace._id,
        contact_ids: [contactId],
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "Chat deleted successfully");
        if (selectedChat && selectedChat.contact.id === contactId) {
          dispatch(selectChat(null));
        }
        setIsDeleteModalOpen(false);
        setIsOpen(false);
      } else {
        toast.error(response.message || "Failed to delete chat");
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
      toast.error("An error occurred while deleting chat");
    }
  };

  const handleToggleSnooze = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSnoozed) {
      // Disable directly
      try {
        const response = await toggleSnoozeChat({
          contact_id: contactId,
          is_snoozed: false,
        }).unwrap();
        if (response.success) {
          toast.success("Snooze disabled for this chat");
        }
        setIsOpen(false);
      } catch (error) {
        console.error("Failed to toggle snooze:", error);
        toast.error("Failed to toggle snooze");
      }
    } else {
      // Open modal to configure and enable
      setIsOpen(false);
      setIsSnoozeModalOpen(true);
    }
  };

  const handleSaveSnoozeSettings = async () => {
    try {
      const response = await toggleSnoozeChat({
        contact_id: contactId,
        is_snoozed: true,
        snooze_time_minutes: snoozeTime,
        snooze_count_limit: snoozeLimit,
      }).unwrap();

      if (response.success) {
        toast.success("Snooze enabled for this chat");
      }
      setIsSnoozeModalOpen(false);
    } catch (error) {
      console.error("Failed to enable snooze:", error);
      toast.error("Failed to enable snooze");
    }
  };

  const handleExport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await getMessages({
        contact_id: contactId,
        whatsapp_phone_number_id: phoneNumberId,
      }).unwrap();

      if (
        !response.success ||
        !response.messages ||
        response.messages.length === 0
      ) {
        toast.error("No messages found to export");
        return;
      }

      const headers = ["Date", "Sender", "Recipient", "Type", "Content"];
      const rowData: string[][] = [];

      response.messages.forEach((dateGroup) => {
        dateGroup.messageGroups.forEach((group) => {
          group.messages.forEach((msg) => {
            let content = msg.content || "";
            if (msg.messageType === "image")
              content = `[Image] ${msg.fileUrl || ""}`;
            else if (msg.messageType === "video")
              content = `[Video] ${msg.fileUrl || ""}`;
            else if (msg.messageType === "audio")
              content = `[Audio] ${msg.fileUrl || ""}`;
            else if (msg.messageType === "document")
              content = `[Document] ${msg.fileUrl || ""}`;
            else if (msg.messageType === "location")
              content = `[Location] ${msg.content || ""}`;
            else if (msg.messageType === "template")
              content = `[Template] ${msg.template?.template_name || ""} -> ${msg.template?.message_body || ""}`;
            else if (msg.messageType === "system_messages")
              content = `[System] ${msg.content || ""}`;

            rowData.push([
              new Date(msg.createdAt).toLocaleString(),
              msg.sender.name || msg.sender.id,
              msg.recipient.name || msg.recipient.id,
              msg.messageType,
              content || "-",
            ]);
          });
        });
      });

      exportToCSV(headers, rowData, `chat_history_${contactNumber}`);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to export messages:", error);
      toast.error("Failed to export chat messages");
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button className="p-1! rounded-md bg-[unset]! h-[unset]! hover:bg-slate-200 dark:hover:bg-(--table-hover) text-slate-400 hover:text-slate-600 transition-all">
            {isLoading ? (
              <Loader2 size={14} className="animate-spin text-primary" />
            ) : (
              <ChevronDown size={18} />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 dark:bg-(--card-color) dark:border-(--card-border-color)"
        >
          <DropdownMenuItem
            onClick={handleExport}
            disabled={isLoading}
            className="gap-2 cursor-pointer font-normal text-xs dark:text-amber-50 dark:hover:bg-(--table-hover)"
          >
            <Download size={14} className="text-slate-500" />
            <span>Export Messages</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleToggleSnooze}
            disabled={isSnoozing}
            className="gap-2 cursor-pointer font-normal text-xs dark:text-amber-50 dark:hover:bg-(--table-hover)"
          >
            {isSnoozed ? (
              <BellOff size={14} className="text-slate-500" />
            ) : (
              <Bell size={14} className="text-slate-500" />
            )}
            <span>
              {isSnoozed ? "Disable Auto-Reminder" : "Enable Auto-Reminder"}
            </span>
          </DropdownMenuItem>
          {false && (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteModalOpen(true);
              }}
              disabled={isLoading || isDeleting}
              className="gap-2 cursor-pointer font-normal text-xs dark:hover:bg-red-500/10"
            >
              <Trash2
                size={14}
                className="text-red-600 dark:text-red-500 dark:hover:bg-red-500/10"
              />
              <span className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:bg-red-500/10">
                Delete Chat
              </span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSingleChat}
        isLoading={isDeleting}
        title="Delete Chat?"
        subtitle="Are you sure you want to delete this conversation? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      <Dialog open={isSnoozeModalOpen} onOpenChange={setIsSnoozeModalOpen}>
        <DialogContent className="sm:max-w-md dark:bg-(--card-color) dark:border-(--card-border-color)">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Configure Auto-Reminder
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Reminder Interval (Minutes)
              </Label>
              <Input unstyled
                type="number"
                min="1"
                value={snoozeTime}
                onChange={(e) => setSnoozeTime(Number(e.target.value))}
                className="w-full text-sm p-2 rounded-md border border-slate-200 dark:border-(--card-border-color) dark:bg-(--page-body-bg) focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                How often (in minutes) to remind the assigned agent about this
                pending message.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Escalation Strike Limit
              </Label>
              <Input unstyled
                type="number"
                min="1"
                value={snoozeLimit}
                onChange={(e) => setSnoozeLimit(Number(e.target.value))}
                className="w-full text-sm p-2 rounded-md border border-slate-200 dark:border-(--card-border-color) dark:bg-(--page-body-bg) focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                The number of reminders sent before escalating the request to
                the admin as an urgent priority alert.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              className="bg-gray-100! dark:bg-(--page-body-bg)! dark:border-(--card-border-color)! border border-slate-100 h-10 px-4 py-3"
              variant="ghost"
              onClick={() => setIsSnoozeModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="h-10 px-4 py-3 bg-primary text-white"
              onClick={handleSaveSnoozeSettings}
              disabled={isSnoozing}
            >
              Save & Enable
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatListItemDropdown;
