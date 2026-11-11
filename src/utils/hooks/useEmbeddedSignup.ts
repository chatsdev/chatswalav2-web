/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "@/src/redux/hooks";
import { useFacebookReady } from "@/src/app/FacebookSDKProvider";

export const useEmbeddedSignup = (onFinish: (code: string, data: any) => void) => {
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [signupData, setSignupData] = useState<any>(null);
  const fbReady = useFacebookReady();
  const { setting } = useAppSelector((state) => state.setting);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (!event.origin.includes("facebook")) return;

      try {
        const payload = typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (
          payload.type === "WA_EMBEDDED_SIGNUP" &&
          (payload.event === "FINISH" || payload.event === "FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING")
        ) {
          setSignupData(payload.data);
        }
      } catch {}
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    if (authCode && signupData) {
      onFinish(authCode, signupData);
      setAuthCode(null);
      setSignupData(null);
    }
  }, [authCode, signupData, onFinish]);

  const startSignup = useCallback(() => {
    if (!fbReady || !window.FB) return;

    window.FB.login(
      (res: any) => {
        if (res.authResponse?.code) {
          setAuthCode(res.authResponse.code);
        }
      },
      {
        config_id: setting?.configuration_id,
        response_type: "code",
        override_default_response_type: true,
        extras: {
          setup: {},
          sessionInfoVersion: 3,
          featureType: "whatsapp_business_app_onboarding",
        },
      }
    );
  }, [fbReady, setting?.configuration_id]);

  return { startSignup, fbReady };
};
