/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import {
  useConnectChannelMutation,
  useLazyGetTwitterConfigQuery,
} from "@/src/redux/api/channelsApi";
import { TwitterConnectModalProps } from "@/src/types/channel";
import { Key, Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Label } from "@/src/elements/ui/label";
import { Input } from "@/src/elements/ui/input";



function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

async function generateCodeChallenge(verifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function generateState() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const TwitterConnectModal: React.FC<TwitterConnectModalProps> = ({
  isOpen,
  onOpenChange,
  workspaceId,
  onSuccess,
}) => {
  const [getTwitterConfig] = useLazyGetTwitterConfigQuery();
  const [connectChannel, { isLoading: isConnecting }] =
    useConnectChannelMutation();

  const [isStartingOAuth, setIsStartingOAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<"oauth2" | "sdk">("oauth2");

  // SDK Method state
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [accessTokenSecret, setAccessTokenSecret] = useState("");

  const popupRef = useRef<Window | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Listen for postMessage from the popup (OAuth 2.0 callback)
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type !== "TWITTER_AUTH_CALLBACK") return;

      const { code, state, error } = event.data;

      if (intervalRef.current) clearInterval(intervalRef.current);

      const storedState = sessionStorage.getItem("twitter_oauth_state");
      const codeVerifier = sessionStorage.getItem("twitter_oauth_verifier");
      const redirectUri = sessionStorage.getItem("twitter_oauth_redirect_uri");

      sessionStorage.removeItem("twitter_oauth_state");
      sessionStorage.removeItem("twitter_oauth_verifier");
      sessionStorage.removeItem("twitter_oauth_redirect_uri");

      if (error) {
        toast.error(`Twitter authorization failed: ${error}`);
        setIsStartingOAuth(false);
        return;
      }

      if (state !== storedState) {
        toast.error("State mismatch — authorization failed. Please try again.");
        setIsStartingOAuth(false);
        return;
      }

      if (!code || !codeVerifier || !redirectUri) {
        toast.error("Missing authorization data. Please try again.");
        setIsStartingOAuth(false);
        return;
      }

      try {
        const response = await connectChannel({
          platform: "twitter",
          workspace_id: workspaceId,
          code,
          code_verifier: codeVerifier,
          redirect_uri: redirectUri,
        }).unwrap();

        if (response.success) {
          toast.success(response.message || "Twitter connected successfully!");
          onOpenChange(false);
          onSuccess();
        } else {
          toast.error(response.error || "Failed to connect Twitter");
        }
      } catch (err: any) {
        toast.error(
          err?.data?.error || "An error occurred while connecting Twitter",
        );
      } finally {
        setIsStartingOAuth(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [workspaceId, connectChannel, onOpenChange, onSuccess]);

  // Cleanup popup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startOAuthFlow = async () => {
    if (!workspaceId) {
      toast.error("Please select a workspace first");
      return;
    }
    setIsStartingOAuth(true);

    try {
      // 1. Fetch config from backend (clientId, redirectUri, scope)
      const configRes = await getTwitterConfig().unwrap();
      if (!configRes.success || !configRes.data) {
        toast.error(
          configRes.error ||
            "Twitter is not configured. Please contact your administrator.",
        );
        setIsStartingOAuth(false);
        return;
      }

      const { clientId: twitterClientId, redirectUri, scope } = configRes.data;

      // 2. Generate PKCE values
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const state = generateState();

      // 3. Store for verification when postMessage arrives
      sessionStorage.setItem("twitter_oauth_verifier", codeVerifier);
      sessionStorage.setItem("twitter_oauth_state", state);
      sessionStorage.setItem("twitter_oauth_redirect_uri", redirectUri);

      // 4. Build the Twitter OAuth 2.0 URL
      const params = new URLSearchParams({
        response_type: "code",
        client_id: twitterClientId,
        redirect_uri: redirectUri,
        scope,
        state,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
      });

      const authUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;

      // 5. Open popup
      const width = 600,
        height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const popup = window.open(
        authUrl,
        "twitter_oauth",
        `width=${width},height=${height},left=${left},top=${top}`,
      );
      popupRef.current = popup;

      // Poll for popup closure (user closed without completing)
      intervalRef.current = setInterval(() => {
        if (popup && popup.closed) {
          clearInterval(intervalRef.current!);
          setIsStartingOAuth(false);
        }
      }, 500);
    } catch (err: any) {
      toast.error(err?.data?.error || "Failed to start Twitter authorization");
      setIsStartingOAuth(false);
    }
  };

  const handleSdkConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId) {
      toast.error("Please select a workspace first");
      return;
    }
    if (!clientId || !clientSecret || !accessToken || !accessTokenSecret) {
      toast.error("All 4 fields are required for the SDK method");
      return;
    }

    try {
      const response = await connectChannel({
        platform: "twitter",
        workspace_id: workspaceId,
        access_token: accessToken,
        access_token_secret: accessTokenSecret,
        client_id: clientId,
        client_secret: clientSecret,
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "Twitter connected successfully!");
        onOpenChange(false);
        onSuccess();
        setClientId("");
        setClientSecret("");
        setAccessToken("");
        setAccessTokenSecret("");
      } else {
        toast.error(response.error || "Failed to connect Twitter");
      }
    } catch (err: any) {
      toast.error(
        err?.data?.error || "An error occurred while connecting Twitter",
      );
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Connect Twitter (X) Account
          </DialogTitle>
          <DialogDescription>
            Choose a connection method to authorize your Twitter account for
            DMs.
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-1">
          <Button variant="unstyled"
            onClick={() => setActiveTab("oauth2")}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "oauth2"
                ? "border-black dark:border-white text-black dark:text-white"
                : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
          >
            OAuth 2.0 (App Login)
          </Button>
          <Button variant="unstyled"
            onClick={() => setActiveTab("sdk")}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "sdk"
                ? "border-black dark:border-white text-black dark:text-white"
                : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
          >
            <Key className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
            SDK / Direct Keys
          </Button>
        </div>

        {activeTab === "oauth2" ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 space-y-2">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                A popup will open to authorize your Twitter account:
              </p>
              <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1 list-disc list-inside">
                <li>Read and send Direct Messages</li>
                <li>Read your profile information</li>
                <li>Read tweets</li>
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-700 dark:text-amber-300">
                ⚠️ Credentials are managed by your administrator. Ensure the app
                has <strong>DM</strong> permissions enabled.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-1">
              <Button
                onClick={startOAuthFlow}
                disabled={isStartingOAuth || isConnecting}
                className="w-full h-12 font-bold bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black rounded-xl transition-all active:scale-[0.98]"
              >
                {isStartingOAuth ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Opening Twitter…
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Authorize with Twitter
                  </>
                )}
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="w-full h-10 rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSdkConnect} className="space-y-3">
            {[
              {
                label: "API Key (Consumer Key)",
                value: clientId,
                setter: setClientId,
                type: "text",
                placeholder: "API Key / Client ID",
              },
              {
                label: "API Secret (Consumer Secret)",
                value: clientSecret,
                setter: setClientSecret,
                type: "password",
                placeholder: "API Secret",
              },
              {
                label: "Access Token",
                value: accessToken,
                setter: setAccessToken,
                type: "text",
                placeholder: "Access Token",
              },
              {
                label: "Access Token Secret",
                value: accessTokenSecret,
                setter: setAccessTokenSecret,
                type: "password",
                placeholder: "Access Token Secret",
              },
            ].map(({ label, value, setter, type, placeholder }) => (
              <div key={label} className="space-y-1">
                <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {label}
                </Label>
                <Input unstyled
                  type={type}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={placeholder}
                  required
                  className="w-full h-11 px-4 text-sm bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-black dark:focus:border-white transition-all text-slate-900 dark:text-white"
                />
              </div>
            ))}
            <div className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                disabled={isConnecting}
                className="w-full h-12 font-bold bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black rounded-xl transition-all active:scale-[0.98]"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting…
                  </>
                ) : (
                  "Connect with SDK Credentials"
                )}
              </Button>
              <Button
                type="button"
                onClick={handleClose}
                variant="outline"
                className="w-full h-10 rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
