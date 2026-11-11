/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Skeleton } from "@/src/elements/ui/skeleton";
import { useGetAgentDataQuery } from "@/src/redux/api/agentApi";
import {
  useAddChatNoteMutation,
  useAddChatTagMutation,
  useAssignAgentMutation,
  useClearChatMutation,
  useDeleteChatNoteMutation,
  useDeleteChatTagMutation,
  useGetContactProfileQuery,
  useUnassignAgentMutation,
  useAssignChatbotMutation,
  useUnassignChatbotMutation,
} from "@/src/redux/api/chatApi";
import { useGetChatbotsQuery } from "@/src/redux/api/chatbotApi";
import { useDeleteContactMutation } from "@/src/redux/api/contactApi";
import { useCreateTagMutation } from "@/src/redux/api/tagsApi";
import {
  useAssignAgentToContactMutation,
  useGetCallAgentsQuery,
  useRemoveAgentFromContactMutation,
} from "@/src/redux/api/whatsappCallingApi";
import { useGetConnectedChannelsQuery } from "@/src/redux/api/channelsApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  selectChat,
  setProfileToggle,
} from "@/src/redux/reducers/messenger/chatSlice";
import { RootState } from "@/src/redux/store";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import TagModal from "../tags/TagModal";
import ProfileAssignAgent from "./profile/ProfileAssignAgent";
import ProfileAssignAICallAgent from "./profile/ProfileAssignAICallAgent";
import ProfileAssignChatbot from "./profile/ProfileAssignChatbot";
import ProfileChatNote from "./profile/ProfileChatNote";
import ProfileClearChat from "./profile/ProfileClearChat";
import ProfileContactSummary from "./profile/ProfileContactSummary";
import ProfileMediaAssets from "./profile/ProfileMediaAssets";
import PlanFeature from "@/src/shared/PlanFeature";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";

const ChatProfile = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { selectedChat, selectedPhoneNumberId } = useSelector(
    (state: RootState) => state.chat,
  );
  const contactId = selectedChat?.contact?.id;
  const { isFeatureEnabled } = useFeatureAccess();
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);

  const { data: connectedChannelsResult } = useGetConnectedChannelsQuery(
    { workspace_id: selectedWorkspace?._id || "" },
    { skip: !selectedWorkspace?._id },
  );

  const activeConnection = connectedChannelsResult?.connections?.find(
    (c: any) => String(c.id) === String(selectedPhoneNumberId),
  );
  const isWhatsApp =
    !activeConnection || activeConnection.platform === "whatsapp";

  const {
    data: profileData,
    isLoading: isLoadingProfile,
    refetch: refetchProfile,
  } = useGetContactProfileQuery(
    {
      contact_id: contactId as string,
      whatsapp_phone_number_id: selectedPhoneNumberId as string,
    },
    { skip: !contactId },
  );
  const { data: agentsData } = useGetAgentDataQuery({ status: "active" });
  const { data: aiAgentsData } = useGetCallAgentsQuery(
    { limit: 100 },
    { skip: !isFeatureEnabled("whatsapp_calling") || !isWhatsApp },
  );
  const agents = agentsData?.data?.agents || [];
  const aiAgents = aiAgentsData?.data || [];
  const { data: chatbotsResult } = useGetChatbotsQuery(
    { waba_id: selectedPhoneNumberId as string },
    { skip: !selectedPhoneNumberId }
  );
  const chatbots = chatbotsResult?.data || [];
  const { user } = useAppSelector((state) => state.auth);
  const isAgent = user?.role === "agent";

  const [addChatNote, { isLoading: isAddingNote }] = useAddChatNoteMutation();
  const [deleteChatNote] = useDeleteChatNoteMutation();
  const [assignAgent, { isLoading: isAssigningAgent }] =
    useAssignAgentMutation();
  const [unassignAgent, { isLoading: isUnassigningAgent }] =
    useUnassignAgentMutation();
  const [deleteContact] = useDeleteContactMutation();
  const [createTag, { isLoading: isCreatingTag }] = useCreateTagMutation();
  const [addChatTag, { isLoading: isAddingChatTag }] = useAddChatTagMutation();
  const [deleteChatTag] = useDeleteChatTagMutation();
  const [clearChat, { isLoading: isClearingChat }] = useClearChatMutation();

  const [assignAIAgent, { isLoading: isAssigningAIAgent }] =
    useAssignAgentToContactMutation();
  const [removeAIAgent, { isLoading: isRemovingAIAgent }] =
    useRemoveAgentFromContactMutation();
  const [assignChatbot, { isLoading: isAssigningChatbot }] =
    useAssignChatbotMutation();
  const [unassignChatbot, { isLoading: isUnassigningChatbot }] =
    useUnassignChatbotMutation();

  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isDeletingContactModalOpen, setIsDeletingContactModalOpen] =
    useState(false);
  const [isDeletingContact, setIsDeletingContact] = useState(false);
  const { userSetting } = useAppSelector((state) => state.setting);
  const userSettingData = userSetting?.data;

  if (!selectedChat) return null;

  const onToggleProfile = () => {
    dispatch(setProfileToggle());
  };

  const handleSaveNote = async (note: string) => {
    try {
      await addChatNote({
        contact_id: contactId as string,
        whatsapp_phone_number_id: selectedPhoneNumberId as string,
        note,
      }).unwrap();
      toast.success("Note saved successfully");
    } catch {
      toast.error("Failed to save note");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteChatNote({
        ids: [noteId],
        contact_id: contactId as string,
      }).unwrap();
      toast.success("Note deleted successfully");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const handleAssignAgent = async (agentId: string) => {
    try {
      await assignAgent({
        contact_id: contactId as string,
        agent_id: agentId,
        whatsapp_phone_number_id: selectedPhoneNumberId as string,
      }).unwrap();
      toast.success("Agent assigned successfully");
    } catch {
      toast.error("Failed to assign agent");
    }
  };

  const handleUnassignAgent = async () => {
    try {
      await unassignAgent({
        contact_id: contactId as string,
        whatsapp_phone_number_id: selectedPhoneNumberId as string,
      }).unwrap();
      await refetchProfile();
      toast.success("Agent unassigned successfully");
    } catch {
      toast.error("Failed to unassign agent");
    }
  };

  const handleAssignAIAgent = async (agentId: string) => {
    try {
      await assignAIAgent({
        contact_id: contactId as string,
        agent_id: agentId,
      }).unwrap();
      toast.success("AI Call Agent assigned successfully");
    } catch {
      toast.error("Failed to assign AI Call Agent");
    }
  };

  const handleRemoveAIAgent = async () => {
    try {
      await removeAIAgent(contactId as string).unwrap();
      toast.success("AI Call Agent removed successfully");
    } catch {
      toast.error("Failed to remove AI Call Agent");
    }
  };

  const handleAssignChatbot = async (chatbotId: string) => {
    try {
      await assignChatbot({
        contact_id: contactId as string,
        chatbot_id: chatbotId,
      }).unwrap();
      toast.success(t("chatbot_assigned_success", { defaultValue: "Chatbot assigned successfully" }));
    } catch {
      toast.error(t("failed_to_assign_chatbot", { defaultValue: "Failed to assign chatbot" }));
    }
  };

  const handleUnassignChatbot = async () => {
    try {
      await unassignChatbot({
        contact_id: contactId as string,
      }).unwrap();
      toast.success(t("chatbot_unassigned_success", { defaultValue: "Chatbot unassigned successfully" }));
    } catch {
      toast.error(t("failed_to_unassign_chatbot", { defaultValue: "Failed to unassign chatbot" }));
    }
  };

  const handleDeleteContact = () => {
    setIsDeletingContactModalOpen(true);
  };

  const handleConfirmDeleteContact = async () => {
    setIsDeletingContact(true);
    try {
      await deleteContact([contactId as string]).unwrap();
      toast.success("Contact deleted");
      dispatch(selectChat(null));
      onToggleProfile();
    } catch {
      toast.error("Failed to delete contact");
    } finally {
      setIsDeletingContact(false);
      setIsDeletingContactModalOpen(false);
    }
  };

  const handleCreateLabel = async (name: string, color: string) => {
    try {
      const response = await createTag({ label: name, color }).unwrap();
      toast.success("Label created successfully");
      return response;
    } catch {
      toast.error("Failed to create label");
    }
  };

  const handleAddLabel = async (tagIds: string[]) => {
    let successCount = 0;
    let lastResponse: any = null;
    for (const tagId of tagIds) {
      try {
        lastResponse = await addChatTag({
          contact_id: contactId as string,
          tag_id: tagId,
          whatsapp_phone_number_id: selectedPhoneNumberId as string,
        }).unwrap();
        successCount++;
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to add label");
      }
    }
    if (successCount > 0) {
      toast.success(
        successCount > 1
          ? `${successCount} labels added successfully`
          : "Label added successfully",
      );
    }
    return lastResponse;
  };

  const handleRemoveLabel = async (tagId: string) => {
    try {
      await deleteChatTag({
        contactId: contactId as string,
        tagId: tagId,
        whatsapp_phone_number_id: selectedPhoneNumberId as string,
      }).unwrap();
      toast.success("Label removed successfully");
    } catch {
      toast.error("Failed to remove label");
    }
  };

  const handleClearChat = async () => {
    try {
      await clearChat({
        contact_id: contactId as string,
        connection_id: selectedPhoneNumberId as string,
      }).unwrap();
      toast.success(t("chat_history_cleared_success", { defaultValue: "Chat history cleared successfully" }));
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.data?.error ||
          t("failed_to_clear_chat_history", { defaultValue: "Failed to clear chat history" }),
      );
    }
  };

  return (
    <div
      className="w-full max-w-[364px] sm:min-w-[364px] sm:max-w-[364px] border rounded-lg border-gray-100 dark:bg-(--card-color)! dark:border-(--card-border-color) h-full flex flex-col [@media(max-width:1539px)]:absolute [@media(max-width:1539px)]:z-50 [@media(max-width:1539px)]:right-0 [@media(max-width:1539px)]:h-[calc(100vh-114px)] [@media(max-width:639px)]:right-0 [@media(max-width:639px)]:h-[calc(100vh-107px)] [@media(max-width:375px)]:max-w-[calc(100%-20px)]"
      style={{
        backgroundColor:
          userSettingData?.bg_color == "null"
            ? "var(--background)"
            : userSettingData?.bg_color
              ? "color-mix(in srgb, var(--chat-theme-color) , white 92%)"
              : "var(--chat-bg-color)",
      }}
    >
      <div className="h-14 flex items-center justify-between gap-3 px-6 border-b border-gray-200 dark:border-(--card-border-color) shrink-0 sticky top-0 z-20">
        <span className="font-bold text-slate-800 dark:text-white text-lg">
          {t("contact_overview")}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleProfile}
          className="rounded-lg hover:bg-slate-100 dark:hover:bg-(--table-hover) hover:text-(--chat-theme-color)"
        >
          <X size={20} className="text-slate-500 dark:text-gray-200" />
        </Button>
      </div>

      {isLoadingProfile ? (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 animate-pulse">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-2 flex flex-col items-center w-full">
              <Skeleton className="w-1/2 h-5" />
              <Skeleton className="w-1/3 h-4" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="w-20 h-6 rounded-full" />
              <Skeleton className="w-20 h-6 rounded-full" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="w-1/3 h-4" />
              <Skeleton className="w-full h-11 rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-1/3 h-4" />
              <Skeleton className="w-full h-11 rounded-lg" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="w-1/4 h-5" />
            <Skeleton className="w-full h-24 rounded-lg" />
          </div>

          <div className="space-y-4">
            <Skeleton className="w-1/4 h-5" />
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto custom-scrollbar">
          <ProfileContactSummary
            profileData={profileData}
            onDelete={handleDeleteContact}
            onOpenTagModal={() => setIsTagModalOpen(true)}
            onRemoveLabel={handleRemoveLabel}
          />

          <PlanFeature feature="staff">
            {!isAgent && (
              <ProfileAssignAgent
                agents={
                  agents?.map((a: any) => ({
                    id: a?._id,
                    name: a?.name,
                    email: a?.email,
                  })) || []
                }
                selectedAgentId={
                  profileData?.assigned_agent?._id ||
                  profileData?.contact?.assigned_agent
                }
                onAssign={handleAssignAgent}
                onUnassign={handleUnassignAgent}
                isLoading={isAssigningAgent}
                isUnassigning={isUnassigningAgent}
              />
            )}
          </PlanFeature>

          {selectedWorkspace?.waba_type !== "baileys" &&
            <PlanFeature feature="whatsapp_calling">
            {!isAgent && isWhatsApp && (
              <ProfileAssignAICallAgent
                agents={aiAgents}
                selectedAgentId={
                  profileData?.contact?.assigned_call_agent_id ||
                  profileData?.assigned_call_agent_id ||
                  profileData?.assigned_call_agent?._id
                }
                assignedAgent={profileData?.assigned_call_agent}
                onAssign={handleAssignAIAgent}
                onUnassign={handleRemoveAIAgent}
                isLoading={isAssigningAIAgent}
                isUnassigning={isRemovingAIAgent}
              />
            )}
          </PlanFeature>
            }

          {!isAgent && (
            <ProfileAssignChatbot
              chatbots={chatbots}
              selectedChatbotId={
                profileData?.assigned_chatbot?._id ||
                profileData?.assigned_chatbot ||
                profileData?.contact?.assigned_chatbot?._id ||
                profileData?.contact?.assigned_chatbot
              }
              assignedChatbot={
                profileData?.assigned_chatbot ||
                profileData?.contact?.assigned_chatbot
              }
              onAssign={handleAssignChatbot}
              onUnassign={handleUnassignChatbot}
              isLoading={isAssigningChatbot}
              isUnassigning={isUnassigningChatbot}
            />
          )}

          <ProfileChatNote
            notes={profileData?.notes || []}
            onSave={handleSaveNote}
            onDelete={handleDeleteNote}
            isLoading={isAddingNote}
          />

          <ProfileClearChat
            onClearChat={handleClearChat}
            isLoading={isClearingChat}
          />

          <ProfileMediaAssets media={profileData?.media || {}} />
        </div>
      )}

      <PlanFeature feature="tags">
        <TagModal
          isOpen={isTagModalOpen}
          onClose={() => setIsTagModalOpen(false)}
          onSave={handleCreateLabel}
          onAssign={handleAddLabel}
          isLoading={isCreatingTag || isAddingChatTag}
          fromProfile
        />
      </PlanFeature>
      <ConfirmModal
        isOpen={isDeletingContactModalOpen}
        onClose={() => setIsDeletingContactModalOpen(false)}
        onConfirm={handleConfirmDeleteContact}
        isLoading={isDeletingContact}
        title="Delete Contact"
        subtitle="Are you sure you want to delete this contact? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default ChatProfile;
