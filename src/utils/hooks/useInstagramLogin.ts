/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState, useEffect } from "react";
import { toast } from "sonner";
import { useConnectChannelMutation } from "@/src/redux/api/channelsApi";
import { useAppSelector } from "@/src/redux/hooks";
import { getUrlWithBasePath } from "../index";

export const useInstagramLogin = (onFinish?: (data: any) => void) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectChannel] = useConnectChannelMutation();
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const { setting } = useAppSelector((state: any) => state.setting);
  const workspaceId = selectedWorkspace?._id;

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // if (!event.origin.includes("localhost") && !event.origin.includes("ngrok-free.dev")) return;

      const { type, payload } = event.data;

      if (type === "INSTAGRAM_AUTH_SUCCESS") {
        const { code, state } = payload;

        if (state !== workspaceId) {
          toast.error("Invalid state parameter during authentication.");
          setIsConnecting(false);
          return;
        }

        try {
          const response = await connectChannel({
            platform: "instagram",
            workspace_id: workspaceId,
            code: code,
            redirect_uri: window.location.hostname === 'localhost'
              ? `https://malcontentedly-turfy-colene.ngrok-free.dev/instagram-callback`
              : `${process.env.NEXT_PUBLIC_STORAGE_URL}/instagram-callback`,
          }).unwrap();

          toast.success(response.message || "Instagram connected successfully!");
          if (onFinish) {
            onFinish(response);
          }
        } catch (error: any) {
          console.error(error);
          toast.error(error?.data?.error || "Failed to connect Instagram account.");
        } finally {
          setIsConnecting(false);
        }
      } else if (type === "INSTAGRAM_AUTH_ERROR") {
        setIsConnecting(false);
        toast.error(`Instagram login failed: ${payload.error_reason || payload.error}`);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [connectChannel, onFinish, workspaceId]);

  const startLogin = useCallback(() => {
    if (!workspaceId) {
      toast.error("No active workspace selected.");
      return;
    }

    if (!setting?.ig_app_id) {
      toast.error("Instagram App ID is missing in settings. Please configure it in the Admin Panel.");
      return;
    }

    setIsConnecting(true);

    const redirectUri = window.location.hostname === 'localhost'
      ? `https://malcontentedly-turfy-colene.ngrok-free.dev/instagram-callback`
      : `${process.env.NEXT_PUBLIC_STORAGE_URL}/instagram-callback`;
    const scopes = [
      "instagram_business_basic",
      "instagram_business_manage_messages",
      "instagram_business_manage_comments",
      "instagram_business_content_publish"
    ].join(",");

    const authUrl = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${setting.ig_app_id}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scopes}&state=${workspaceId}`;

    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(authUrl, "InstagramLogin", `width=${width},height=${height},left=${left},top=${top}`);

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      setIsConnecting(false);
      toast.error("Popup was blocked by the browser. Please allow popups for this site.");
    }
  }, [workspaceId, setting]);

  return { startLogin, isConnecting };
};
