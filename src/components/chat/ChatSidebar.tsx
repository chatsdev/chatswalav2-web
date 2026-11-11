/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ROUTES } from "@/src/constants/route";
import { CHATFILTER } from "@/src/data";
import { CHANNELS } from "@/src/data/chat";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/elements/ui/tooltip";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";
import { cn } from "@/src/lib/utils";
import { useGetConnectedChannelsQuery } from "@/src/redux/api/channelsApi";
import {
  useGetRecentChatsQuery,
  useTogglePinChatMutation,
} from "@/src/redux/api/chatApi";
import { useGetWabaPhoneNumbersQuery } from "@/src/redux/api/whatsappApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  rehydrateChat,
  selectChat,
  selSelectPhoneNumber,
  setLeftSidebartoggle,
} from "@/src/redux/reducers/messenger/chatSlice";
import { RootState } from "@/src/redux/store";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { RecentChatResponseItem } from "@/src/types/components/chat";
import { useChatSelection } from "@/src/utils/hooks/useChatSelection";
import useDebounce from "@/src/utils/hooks/useDebounce";
import { useNotifications } from "@/src/utils/hooks/useNotifications";
import { maskSensitiveData } from "@/src/utils/masking";
import {
  BellRing,
  CheckSquare,
  Filter,
  ListChecks,
  Loader2,
  Search,
  Trash2,
  X
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import ChatFilterModal from "./ChatFilterModal";
import ChatSidebarItem from "./ChatSidebarItem";
import { ChatSidebarSkeleton } from "./ChatSkeleton";
import { NotificationSettingsModal } from "./NotificationSettingsModal";

const ChatSidebar = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const { selectedPhoneNumberId, selectedChat, isRehydrated, isMobileScreen } =
    useAppSelector((state: RootState) => state.chat);
  const { app_name } = useAppSelector((state: RootState) => state.setting);
  const { user } = useAppSelector((state) => state.auth);
  const { is_demo_mode } = useAppSelector((state) => state.setting);
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const selectedWabaId = selectedWorkspace?.waba_id;
  const isAgent = user?.role === "agent";
  const selectedChatId = selectedChat?.contact.id;
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { permission } = useNotifications();
  const searchParams = useSearchParams();
  const contactIdFromQuery = searchParams.get("contact_id");
  const { userSetting } = useAppSelector((state) => state.setting);
  const userSettingData = userSetting?.data;
  const { isFeatureEnabled, getEnabledChannels } = useFeatureAccess();

  const [selectedChannel, setSelectedChannel] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedChannel") || "whatsapp";
    }
    return "whatsapp";
  });

  useEffect(() => {
    const enabled = getEnabledChannels();
    const isAllowed =
      selectedChannel === "whatsapp" ||
      (selectedChannel === "telegram" &&
        enabled.telegram &&
        isFeatureEnabled("tg_chat")) ||
      (selectedChannel === "facebook" &&
        enabled.facebook &&
        isFeatureEnabled("fb_chat")) ||
      (selectedChannel === "instagram" &&
        enabled.instagram &&
        isFeatureEnabled("ig_chat")) ||
      (selectedChannel === "twitter" &&
        enabled.twitter &&
        isFeatureEnabled("tw_chat"));

    if (!isAllowed) {
      setSelectedChannel("whatsapp");
      localStorage.setItem("selectedChannel", "whatsapp");
    }
  }, [selectedChannel, getEnabledChannels, isFeatureEnabled]);

  const { data: connectedChannelsResult } = useGetConnectedChannelsQuery(
    { workspace_id: selectedWorkspace?._id || "" },
    { skip: !selectedWorkspace?._id },
  );

  const omnichannelConnections = useMemo(() => {
    const conns = connectedChannelsResult?.connections || [];
    return conns.filter((c: any) => c.platform === selectedChannel);
  }, [connectedChannelsResult, selectedChannel]);

  const filteredChatFilter = useMemo(() => {
    return CHATFILTER.filter((tab) => {
      if (tab.id === "assigned" || tab.id === "unassigned") {
        return isFeatureEnabled("staff");
      }
      return true;
    });
  }, [isFeatureEnabled]);

  useEffect(() => {
    if (
      !isFeatureEnabled("staff") &&
      (activeTab === "assigned" || activeTab === "unassigned")
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab("all");
    }
  }, [isFeatureEnabled, activeTab]);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<{
    startDate?: string;
    endDate?: string;
    tagLabel?: string;
    hasNotes?: boolean;
    agentId?: string;
  }>({});
  const activeFilterCount = Object.keys(filters).length;

  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [channelToConnect, setChannelToConnect] = useState<{
    id: string;
    label: string;
  } | null>(null);

  const { data: phoneNumbersData, isLoading: isLoadingPhones } =
    useGetWabaPhoneNumbersQuery(selectedWabaId || "", {
      skip: !selectedWabaId,
    });

  const isChannelConnected = (channelId: string) => {
    if (channelId === "whatsapp") {
      return (
        isLoadingPhones ||
        (phoneNumbersData?.data && phoneNumbersData.data.length > 0) ||
        false
      );
    }
    return (
      !connectedChannelsResult ||
      connectedChannelsResult?.connections?.some(
        (c: any) => c.platform === channelId,
      ) ||
      false
    );
  };

  const sortedChannels = useMemo(() => {
    const enabled = getEnabledChannels();
    const filtered = CHANNELS.filter((ch) => {
      if (ch.id === "whatsapp") return true;
      if (ch.id === "telegram")
        return enabled.telegram && isFeatureEnabled("tg_chat");
      if (ch.id === "facebook")
        return enabled.facebook && isFeatureEnabled("fb_chat");
      if (ch.id === "instagram")
        return enabled.instagram && isFeatureEnabled("ig_chat");
      if (ch.id === "twitter")
        return enabled.twitter && isFeatureEnabled("tw_chat");
      return true;
    });

    return [...filtered].sort((a, b) => {
      const aConnected = isChannelConnected(a.id);
      const bConnected = isChannelConnected(b.id);
      if (aConnected && !bConnected) return -1;
      if (!aConnected && bConnected) return 1;
      return 0;
    });
  }, [
    phoneNumbersData,
    connectedChannelsResult,
    isLoadingPhones,
    getEnabledChannels,
    isFeatureEnabled,
  ]);

  const phoneNumbers = useMemo(() => {
    const list = (phoneNumbersData as any)?.data || [];
    return list;
  }, [phoneNumbersData]);

  const dropdownOptions = useMemo(() => {
    if (selectedChannel === "whatsapp") {
      return phoneNumbers.map((p: any) => {
        const nameToDisplay = (p.verified_name && p.verified_name !== "N/A" && p.verified_name.trim() !== "")
          ? p.verified_name
          : (p.display_phone_number || p.phone_number || "");
        return {
          id: String(p.id),
          display:
            maskSensitiveData(nameToDisplay, "phone", is_demo_mode) ||
            "WhatsApp",
        };
      });
    } else {
      return omnichannelConnections.map((c: any) => ({
        id: String(c.id),
        display: c.name || "Channel",
      }));
    }
  }, [selectedChannel, phoneNumbers, omnichannelConnections, is_demo_mode]);

  const handleChannelChange = (channelId: string) => {
    setSelectedChannel(channelId);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedChannel", channelId);
    }
    if (channelId === "whatsapp") {
      if (phoneNumbers.length > 0) {
        dispatch(selSelectPhoneNumber(String(phoneNumbers[0].id)));
      } else {
        dispatch(selSelectPhoneNumber(null));
      }
    } else {
      const conns = connectedChannelsResult?.connections || [];
      const filtered = conns.filter((c: any) => c.platform === channelId);
      if (filtered.length > 0) {
        dispatch(selSelectPhoneNumber(String(filtered[0].id)));
      } else {
        dispatch(selSelectPhoneNumber(null));
      }
    }
  };

  useEffect(() => {
    dispatch(rehydrateChat());
  }, [dispatch]);

  useEffect(() => {
    if (isRehydrated) {
      if (selectedChannel === "whatsapp") {
        if (phoneNumbersData !== undefined) {
          if (phoneNumbers.length > 0) {
            const isCurrentlySelectedValid =
              selectedPhoneNumberId &&
              phoneNumbers.find(
                (p: any) => String(p.id) === String(selectedPhoneNumberId),
              );
            if (!isCurrentlySelectedValid) {
              const firstId = String(phoneNumbers[0].id);
              dispatch(selSelectPhoneNumber(firstId));
            }
          } else {
            if (selectedPhoneNumberId !== null) {
              dispatch(selSelectPhoneNumber(null));
            }
          }
        }
      } else {
        if (connectedChannelsResult !== undefined) {
          if (omnichannelConnections.length > 0) {
            const isCurrentlySelectedValid =
              selectedPhoneNumberId &&
              omnichannelConnections.find(
                (c: any) => String(c.id) === String(selectedPhoneNumberId),
              );
            if (!isCurrentlySelectedValid) {
              const firstId = String(omnichannelConnections[0].id);
              dispatch(selSelectPhoneNumber(firstId));
            }
          } else {
            if (selectedPhoneNumberId !== null) {
              dispatch(selSelectPhoneNumber(null));
            }
          }
        }
      }
    }
  }, [
    selectedChannel,
    phoneNumbers,
    omnichannelConnections,
    selectedPhoneNumberId,
    dispatch,
    isRehydrated,
    phoneNumbersData,
    connectedChannelsResult,
  ]);

  const {
    data: chatsData,
    isLoading,
    isFetching,
  } = useGetRecentChatsQuery(
    {
      page,
      limit: 15,
      search: debouncedSearch || undefined,
      whatsapp_phone_number_id: selectedPhoneNumberId || undefined,
      start_date: filters.startDate,
      end_date: filters.endDate,
      tags: filters.tagLabel,
      has_notes: filters.hasNotes,
      agent_id: filters.agentId,
      last_message_read: activeTab === "unread" ? false : undefined,
      is_assigned:
        activeTab === "assigned"
          ? true
          : activeTab === "unassigned"
            ? false
            : undefined,
    },
    {
      skip: !selectedPhoneNumberId,
    },
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [debouncedSearch, selectedPhoneNumberId, filters, activeTab]);

  const hasMore = chatsData?.pagination?.hasMore || false;

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isLoading || isFetching || !hasMore)
      return;
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      setPage((prev) => prev + 1);
    }
  }, [isLoading, isFetching, hasMore]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const [togglePinChat] = useTogglePinChatMutation();

  const sortedChats = useMemo(() => {
    if (!chatsData?.data) return [];

    return [...chatsData.data].sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;

      const dateA = new Date(a.lastMessage.createdAt).getTime();
      const dateB = new Date(b.lastMessage.createdAt).getTime();
      return dateB - dateA;
    });
  }, [chatsData]);

  useEffect(() => {
    if (contactIdFromQuery && sortedChats.length > 0 && isRehydrated) {
      const targetChat = sortedChats.find(
        (c) => c.contact.id === contactIdFromQuery,
      );
      if (targetChat && selectedChatId !== contactIdFromQuery) {
        handleSelectChat(targetChat);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactIdFromQuery, sortedChats, isRehydrated]);

  useEffect(() => {
    if (!isRehydrated) return;

    if (selectedPhoneNumberId) {
      if (chatsData !== undefined && sortedChats.length === 0 && selectedChat) {
        dispatch(selectChat(null));
      }
    } else {
      if (selectedChat) {
        dispatch(selectChat(null));
      }
    }
  }, [
    chatsData,
    sortedChats,
    selectedChat,
    selectedPhoneNumberId,
    isRehydrated,
    dispatch,
  ]);

  const handleTogglePin = async (
    e: React.MouseEvent,
    chat: RecentChatResponseItem,
  ) => {
    e.stopPropagation();
    try {
      await togglePinChat({
        contact_id: chat.contact.id,
        phone_number: chat.contact.number,
      }).unwrap();
    } catch (error: any) {
      toast.error(error?.data?.data || "Failed to toggle pin chat");
    }
  };

  const handleSelectChat = (chat: RecentChatResponseItem) => {
    dispatch(selectChat(chat));
    if (window.innerWidth <= 991) {
      dispatch(
        setLeftSidebartoggle({
          isMobile: true,
          forceState: false,
        }),
      );
    }
  };

  const handlePhoneNumberChange = (value: string) => {
    dispatch(selSelectPhoneNumber(value));
  };

  const handleSidebar = () => {
    dispatch(
      setLeftSidebartoggle({
        isMobile: window.innerWidth <= 991,
      }),
    );
  };

  const {
    isSelectionMode,
    selectedContactIds,
    isDeleteModalOpen,
    isDeleting,
    setIsDeleteModalOpen,
    handleToggleSelectionMode,
    handleToggleChatSelection,
    handleSelectAll,
    handleDeleteChats,
  } = useChatSelection({
    workspaceId: selectedWorkspace?._id,
    sortedChats,
  });

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const isSearching = searchQuery !== debouncedSearch;
  const isInitialLoading =
    !isRehydrated ||
    isLoadingPhones ||
    (phoneNumbers.length > 0 && !selectedPhoneNumberId) ||
    isLoading ||
    (isSearching && searchQuery !== "");

  return (
    <div
      className="[@media(max-width:1024px)]:z-50 w-full max-w-[320px] sm:min-w-[320px] sm:max-w-[320px] border rounded-lg border-gray-100 dark:border-(--card-border-color) flex flex-col bg-white dark:bg-(--card-color)! [@media(max-width:639px)]:left-0! [@media(max-width:639px)]:h-[calc(100vh-107px)]!  [@media(max-width:991px)]:absolute [@media(max-width:991px)]:bg-white dark:[@media(max-width:991px)]:bg-(--page-body-bg) [@media(max-width:991px)]:left-0 [@media(max-width:991px)]:h-[calc(100vh-82px-16px-16px)]"
      style={{
        backgroundColor:
          userSettingData?.bg_color == "null"
            ? "var(--background)"
            : userSettingData?.bg_color
              ? "color-mix(in srgb, var(--chat-theme-color) , white 92%)"
              : "var(--chat-bg-color)",
      }}
    >
      <div className="p-4 pb-0 border-b border-gray-200 dark:border-(--card-border-color) space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-none">
              {isSelectionMode
                ? `${selectedContactIds.length} Selected`
                : t("conversations")}
            </h2>
          </div>
          <div className="flex gap-2">
            {isSelectionMode ? (
              <div className="flex gap-1 animate-in fade-in slide-in-from-right-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleSelectAll}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-(--chat-theme-color) transition-all"
                    >
                      <ListChecks size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-primary text-white border-primary">
                    <p>Select All</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setIsDeleteModalOpen(true)}
                      disabled={selectedContactIds.length === 0}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-600 transition-all disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-red-500">
                    <p>Delete Selected</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleToggleSelectionMode}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
                    >
                      <X size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-700">
                    <p>Cancel</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ) : (
              <>                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleToggleSelectionMode}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-(--chat-theme-color) transition-all"
                    >
                      <CheckSquare size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-primary text-white border-primary">
                    <p>Select Chats</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setIsNotificationModalOpen(true)}
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-(--chat-theme-color) transition-all",
                        permission !== "granted" &&
                          "text-amber-500 hover:text-amber-600 animate-pulse bg-amber-50 dark:bg-amber-500/10",
                      )}
                    >
                      <BellRing size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-primary text-white border-primary">
                    <p>Notification Settings</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
            {isMobileScreen && (
              <Button
                onClick={handleSidebar}
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-(--table-hover) rounded-lg"
              >
                <X size={18} className="text-slate-600 dark:text-gray-500" />
              </Button>
            )}
          </div>
        </div>

        {!isSelectionMode && (
          <div className="flex flex-wrap justify-center gap-2 w-full">
            {sortedChannels.map((ch) => {
              const isChSelected = selectedChannel === ch.id;
              const isChConnected = isChannelConnected(ch.id);
              const Icon = ch.icon;
              return (
                <Tooltip key={ch.id}>
                  <TooltipTrigger asChild>
                    <Button variant="unstyled"
                      type="button"
                      onClick={() => {
                        if (isChConnected) {
                          handleChannelChange(ch.id);
                        } else {
                          setChannelToConnect(ch);
                          setConnectModalOpen(true);
                        }
                      }}
                      className={cn(
                        "h-14 rounded-lg flex flex-col items-center justify-center border relative group shadow-2xs flex-1 cursor-pointer",
                        isChSelected
                          ? `${ch.bg} scale-102`
                          : isChConnected
                            ? "bg-white dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color) text-slate-400 dark:text-neutral-500 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-(--card-border-color)"
                            : "bg-slate-50 dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color) text-slate-400 dark:text-slate-550 hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
                      )}
                    >
                      <Icon
                        size={18}
                        style={{
                          color: isChSelected
                            ? "#ffffff"
                            : isChConnected
                              ? ch.color
                              : "#94a3b8",
                        }}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                      <span className="text-[10px] font-semibold mt-1 tracking-wide leading-none">
                        {ch.label}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  {!isChConnected && (
                    <TooltipContent className="bg-slate-800 dark:bg-neutral-800 text-white border border-neutral-700">
                      <p>Click to connect {ch.label} channel</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </div>
        )}

        {!isRehydrated ? (
          <div className="w-full h-10 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg" />
        ) : (
          <Select
            value={selectedPhoneNumberId?.toString() || ""}
            onValueChange={handlePhoneNumberChange}
          >
            <SelectTrigger className="w-full h-8 bg-(--input-color) dark:border-none dark:bg-(--page-body-bg) dark:hover:bg-(--page-body-bg) border dark:border-(--card-border-color) rounded-lg focus:ring-0 dark:[@media(max-width:991px)]:bg-(--table-hover) dark:hover:[@media(max-width:991px)]:bg-(--table-hover)">
              <SelectValue>
                {selectedPhoneNumberId
                  ? dropdownOptions.find(
                      (opt: any) =>
                        String(opt.id) === String(selectedPhoneNumberId),
                    )?.display || "Selected Channel"
                  : selectedChannel === "whatsapp"
                    ? isLoadingPhones
                      ? "Loading numbers..."
                      : "Select Phone Number"
                    : "Select Account"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {dropdownOptions.map((opt: any, index: number) => (
                <SelectItem
                  className="dark:bg-(--page-body-bg)"
                  key={index}
                  value={String(opt.id)}
                >
                  {opt.display}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="flex gap-2">
          <div className="relative group flex-1">
            {isFetching && searchQuery !== "" ? (
              <Loader2
                className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-primary animate-spin"
                size={16}
              />
            ) : (
              <Search
                className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors"
                size={16}
              />
            )}
            <Input
              placeholder="Search interactions"
              className="ps-10 pe-10 bg-(--input-color) border dark:bg-(--page-body-bg) h-9 rounded-lg focus-visible:ring-1 focus-visible:ring-primary transition-all font-medium dark:[@media(max-width:991px)]:bg-(--table-hover) focus:dark:[@media(max-width:991px)]:bg-(--table-hover) dark:hover:[@media(max-width:991px)]:bg-(--card-color)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button variant="unstyled"
                onClick={() => setSearchQuery("")}
                className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={14} />
              </Button>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFilterModalOpen(true)}
            className={`h-9 w-9 rounded-lg border border-transparent ${activeFilterCount > 0 ? "bg-[var(--primary-opacity-20)] text-(--chat-theme-color) dark:bg-primary-darker/30 dark:text-(--chat-theme-color)" : "bg-slate-50 text-slate-500 dark:bg-(--page-body-bg) dark:text-gray-500 hover:bg-slate-100 dark:hover:bg-(--table-hover)"}`}
            style={
              activeFilterCount > 0
                ? {
                    color: "var(--chat-theme-color)",
                    backgroundColor:
                      "color-mix(in srgb, var(--chat-theme-color), transparent 90%)",
                  }
                : {}
            }
          >
            <div className="relative">
              <Filter size={16} />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -inset-e-1.5 h-3 w-3 bg-primary rounded-full border border-white dark:border-neutral-900" />
              )}
            </div>
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto py-1.5 table-custom-scrollbar">
          {filteredChatFilter.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-0! h-8! rounded-full text-xs font-bold transition-all whitespace-nowrap
                ${activeTab === tab.id ? "text-white shadow-sm" : "bg-slate-100 text-slate-500 dark:bg-(--page-body-bg) dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-(--table-hover)"}
              `}
              style={
                activeTab === tab.id
                  ? {
                      backgroundColor:
                        userSettingData?.theme_color == "null"
                          ? "var(--primary)"
                          : "var(--chat-theme-color)",
                    }
                  : {}
              }
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-2"
      >
        {isInitialLoading ? (
          <ChatSidebarSkeleton />
        ) : sortedChats.length === 0 ? (
          <div className="text-center p-8 dark:text-gray-400 text-slate-500 text-sm flex flex-col items-center gap-2">
            <span className="p-3 bg-slate-50 dark:bg-(--page-body-bg) rounded-full">
              <Search size={20} className="text-slate-400" />
            </span>
            <p>No chats found</p>
          </div>
        ) : (
          <>
            {sortedChats.map((chat: RecentChatResponseItem, index: number) => (
              <ChatSidebarItem
                key={index}
                chat={chat}
                isSelected={selectedContactIds.includes(chat.contact.id)}
                isSelectionMode={isSelectionMode}
                selectedChatId={selectedChatId}
                isAgent={isAgent}
                user={user}
                app_name={app_name || "W"}
                selectedPhoneNumberId={selectedPhoneNumberId || ""}
                onSelect={handleSelectChat}
                onToggleSelection={handleToggleChatSelection}
                onTogglePin={handleTogglePin}
              />
            ))}
            <div ref={loadMoreRef} className="h-10">
              {(isFetching || isLoading) && page > 1 && (
                <div className="h-10 flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <ChatFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={setFilters}
        initialFilters={filters}
      />
      <NotificationSettingsModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteChats}
        isLoading={isDeleting}
        title={
          selectedContactIds.length > 1
            ? `Delete ${selectedContactIds.length} Chats?`
            : "Delete Chat?"
        }
        subtitle={
          selectedContactIds.length > 1
            ? `Are you sure you want to delete these ${selectedContactIds.length} conversations? This action cannot be undone.`
            : "Are you sure you want to delete this conversation? This action cannot be undone."
        }
        confirmText="Delete"
        variant="danger"
      />
      <ConfirmModal
        isOpen={connectModalOpen}
        onClose={() => {
          setConnectModalOpen(false);
          setChannelToConnect(null);
        }}
        onConfirm={() => {
          setConnectModalOpen(false);
          const targetRoute =
            channelToConnect?.id === "telegram"
              ? ROUTES.TelegramConnect
              : channelToConnect?.id === "facebook"
                ? ROUTES.FacebookConnect
                : channelToConnect?.id === "instagram"
                  ? ROUTES.InstagramConnect
                  : channelToConnect?.id === "twitter"
                    ? ROUTES.TwitterConnect
                    : ROUTES.WABAConnection;
          setChannelToConnect(null);
          router.push(targetRoute);
        }}
        isLoading={false}
        title={`Connect ${channelToConnect?.label} Channel`}
        subtitle={`You are not connected to ${channelToConnect?.label} yet. Would you like to connect a new ${channelToConnect?.label} channel?`}
        confirmText="Connect Now"
        variant="primary"
      />
    </div>
  );
};

export default ChatSidebar;
