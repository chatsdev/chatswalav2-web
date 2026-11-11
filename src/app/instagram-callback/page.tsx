"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getUrlWithBasePath } from "@/src/utils";

let isDispatched = false;

export default function InstagramCallback() {
  useEffect(() => {
    if (isDispatched) return;
    isDispatched = true;

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const error = urlParams.get("error");
    const error_reason = urlParams.get("error_reason");

    if (window.opener) {
      if (code) {
        // Send the authorization code back to the parent window
        window.opener.postMessage(
          {
            type: "INSTAGRAM_AUTH_SUCCESS",
            payload: { code, state },
          },
          "*"
        );
      } else if (error) {
        window.opener.postMessage(
          {
            type: "INSTAGRAM_AUTH_ERROR",
            payload: { error, error_reason },
          },
          "*"
        );
      }

      // Close this popup after a short delay to ensure message was sent
      setTimeout(() => {
        window.close();
      }, 500);
    } else {
      // If opened directly (not as a popup), we could redirect back to the app manually
      if (code) {
        window.location.href = getUrlWithBasePath(`/connect_channel?ig_code=${code}&state=${state}`);
      } else {
        window.location.href = getUrlWithBasePath(`/connect_channel?ig_error=true`);
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <Loader2 className="w-10 h-10 animate-spin text-pink-600 mb-4" />
      <h2 className="text-lg font-semibold text-slate-700">Connecting to Instagram...</h2>
      <p className="text-sm text-slate-500">Please wait while we finalize the connection. This window will close automatically.</p>
    </div>
  );
}

