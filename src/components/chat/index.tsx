/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { RootState } from "@/src/redux/store";
import { useSelector } from "react-redux";
import ChatArea from "./ChatArea";
import ChatProfile from "./ChatProfile";
import ChatSidebar from "./ChatSidebar";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setIsMobileScreen, setLeftSidebartoggle, setProfileToggleStatus } from "@/src/redux/reducers/messenger/chatSlice";
import { setSidebarToggle } from "@/src/redux/reducers/layoutSlice";
import { setPageTitle } from "@/src/redux/reducers/settingSlice";
import { ChevronLeft } from "lucide-react";
import WabaRequired from "@/src/shared/WabaRequired";
import { useGetWorkspacesQuery } from "@/src/redux/api/workspaceApi";
import { useGetConnectedChannelsQuery } from "@/src/redux/api/channelsApi";
import Image from "next/image";
import { getUrlWithBasePath } from "@/src/utils";
import { Loader2 } from "lucide-react";

const Chat = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { selectedChat, profileToggle, isRehydrated, leftSidebartoggle } = useSelector((state: RootState) => state.chat);
  const { selectedWorkspace }: any = useAppSelector((state) => state.workspace);
  const { data: workspacesData } = useGetWorkspacesQuery();

  const latestWorkspace = workspacesData?.data?.find((ws: any) => ws._id === selectedWorkspace?._id);
  const isBaileys = (latestWorkspace?.waba_type || selectedWorkspace?.waba_type) === "baileys";
  const currentStatus = latestWorkspace?.connection_status || selectedWorkspace?.connection_status;
  const currentWabaId = latestWorkspace?.waba_id || selectedWorkspace?.waba_id;

  const { data: channelsData, isLoading: isLoadingChannels } = useGetConnectedChannelsQuery(
    { workspace_id: selectedWorkspace?._id },
    { skip: !selectedWorkspace?._id }
  );

  const hasOmnichannel = channelsData?.data && channelsData.data.length > 0;
  const isWabaConnected = isBaileys ? !!currentWabaId && currentStatus === "connected" : !!currentWabaId;
  const isConnected = isWabaConnected || hasOmnichannel;

  const { app_name } = useAppSelector((state) => state.setting);

  useEffect(() => {
    dispatch(setSidebarToggle(true));
    dispatch(setPageTitle("Chat"));

    return () => {
      dispatch(setSidebarToggle(false));
      dispatch(setPageTitle(""));
    };
  }, [dispatch]);

  useEffect(() => {
    let isMobile = window.innerWidth <= 991;

    const handleResize = () => {
      const currentIsMobile = window.innerWidth <= 991;
      dispatch(setIsMobileScreen(currentIsMobile));
      if (currentIsMobile !== isMobile) {
        isMobile = currentIsMobile;
        dispatch(
          setLeftSidebartoggle({
            isMobile: !currentIsMobile,
            forceState: true,
          })
        );
        dispatch(setProfileToggleStatus(!currentIsMobile));
      }
    };

    const initialIsMobile = window.innerWidth <= 991;
    dispatch(setIsMobileScreen(initialIsMobile));
    dispatch(
      setLeftSidebartoggle({
        isMobile: !initialIsMobile,
        forceState: true,
      })
    );
    dispatch(setProfileToggleStatus(!initialIsMobile));

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  const handleSidebar = () => {
    dispatch(
      setLeftSidebartoggle({
        isMobile: window.innerWidth <= 991,
      })
    );
  };


  if (isLoadingChannels) {
    return (
      <div className="flex h-[calc(100vh-82px)] items-center justify-center space-x-2 text-sm font-semibold text-slate-500 dark:text-gray-400 bg-slate-50 dark:bg-(--dark-body)"> 
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="h-[calc(100vh-82px)] bg-slate-50 dark:bg-(--dark-body)">
        <WabaRequired platform="any" />
      </div>
    );
  }

  return (
    <>
      <div className="flex h-[calc(100vh-82px)] bg-secondary-bg/50 dark:bg-(--dark-body)  dark:border-(--card-border-color)">
        <div className="flex sm:m-4 m-3 flex-1 w-auto gap-4 [@media(max-width:335px)]:w-[calc(100%-22px)] relative">
          {leftSidebartoggle && <ChatSidebar />}
          {!isRehydrated ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : selectedChat ? (
            <ChatArea />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-(--card-color) rounded-lg border border-gray-200 dark:border-(--card-border-color)">
              {!leftSidebartoggle && (
                <div onClick={handleSidebar} className="cursor-pointer absolute top-2.5 left-3">
                  <ChevronLeft size={20} />
                </div>
              )}
              <div className="h-24 w-24 bg-(--light-primary) dark:bg-(--dark-sidebar) rounded-full flex items-center justify-center mb-4">
                <Image src={getUrlWithBasePath("/assets/images/greeting.gif")} alt="greeting" width={36} height={36} className="w-8 h-8 sm:w-9 sm:h-9 object-contain ml-0.5" unoptimized />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t("welcome_to", { app: app_name })}</h2>
              <p className="text-slate-500 dark:text-gray-500 text-center max-w-md">{t("select_conversation_desc")}</p>
            </div>
          )}
          {selectedChat && profileToggle && <ChatProfile />}
        </div>
      </div>
    </>
  );
};

export default Chat;
