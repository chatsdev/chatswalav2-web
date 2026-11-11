"use client";

import { signIn, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ROUTES } from "@/src/constants";
import { useAppDispatch } from "@/src/redux/hooks";
import { setLogout } from "@/src/redux/reducers/authSlice";
import { clearWorkspace } from "@/src/redux/reducers/workspaceSlice";
import { resetChatState } from "@/src/redux/reducers/messenger/chatSlice";
import { getUrlWithBasePath } from "@/src/utils";

export default function ImpersonatePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const type = searchParams.get("type");
  const [error, setError] = useState<string | null>(null);

  const isSelfTenant = type === "self-tenant";
  const modeName = isSelfTenant ? "Self-Tenant Mode" : "Impersonation";

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(`No ${modeName.toLowerCase()} token found`);
      toast.error(`Invalid ${modeName.toLowerCase()} request`);
      router.push(ROUTES.Login);
      return;
    }

    const handleImpersonation = async () => {
      try {
        // 1. Clear Local Storage
        if (typeof window !== "undefined") {
          localStorage.removeItem("selectedChat");
          localStorage.removeItem("selectedPhoneNumberId");
          localStorage.removeItem("app_settings");
          localStorage.removeItem("selectedWorkspace");
          localStorage.removeItem("selected_language");
        }

        // 2. Clear Redux State
        dispatch(setLogout());
        dispatch(clearWorkspace());
        dispatch(resetChatState());

        // 3. Clear old session if it exists
        if (token) {
          await signOut({ redirect: false });
        }

        const result = await signIn("impersonation", {
          token,
          redirect: false,
        });

        if (result?.error) {
          setError(result.error);
          toast.error(`${modeName} failed: ` + result.error);
          router.push(ROUTES.Login);
        } else {
          toast.success(`${modeName} started successfully`);
          // Use window.location.href to force a full reload and ensure clean state
          window.location.href = getUrlWithBasePath(ROUTES.Dashboard);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(`${modeName} error:`, err);
        setError("An unexpected error occurred");
        toast.error(`Failed to start ${modeName.toLowerCase()}`);
        router.push(ROUTES.Login);
      }
    };

    handleImpersonation();
  }, [token, router, dispatch, isSelfTenant, modeName]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{error ? `${modeName} Failed` : `Starting ${modeName}...`}</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">{error || "Please wait while we set up your session"}</p>
      </div>
    </div>
  );
}
