/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import { useFacebookReady } from "@/src/app/FacebookSDKProvider";
import { useConnectFacebookMutation } from "@/src/redux/api/facebookApi";
import { toast } from "sonner";

export const useFacebookLogin = (onFinish?: (data: any) => void) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const fbReady = useFacebookReady();
  const [connectFacebook] = useConnectFacebookMutation();

  const startLogin = useCallback(() => {
    if (!fbReady || !window.FB) {
      toast.error("Facebook SDK is not ready yet.");
      return;
    }

    setIsConnecting(true);

    window.FB.login(
      (res: any) => {
        if (res.authResponse?.accessToken) {
          const accessToken = res.authResponse.accessToken;
          const handleAuth = async () => {
            try {
              const response = await connectFacebook({ access_token: accessToken }).unwrap();
              toast.success(response.message || "Facebook connected successfully!");
              if (onFinish) {
                try {
                  onFinish(response);
                } catch (finishError) {
                  console.error("Error in onFinish callback:", finishError);
                }
              }
            } catch (error: any) {
              toast.error(error?.data?.error || "Failed to connect Facebook account.");
            } finally {
              setIsConnecting(false);
            }
          };
          handleAuth();
        } else {
          setIsConnecting(false);
          toast.error("Facebook login was cancelled or failed.");
        }
      },
      {
        scope: "email,public_profile,business_management,catalog_management,instagram_basic,ads_management,ads_read,leads_retrieval,pages_manage_ads,pages_manage_metadata,pages_read_engagement,pages_show_list,pages_manage_engagement,whatsapp_business_management,whatsapp_business_messaging",
        return_scopes: true,
      }
    );
  }, [fbReady, connectFacebook, onFinish]);

  return { startLogin, isConnecting, fbReady };
};
