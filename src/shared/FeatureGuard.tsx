/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useAppSelector } from "@/src/redux/hooks";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Loading from "../app/loading";
import { ROUTES } from "../constants";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";

const RESTRICTED_PATHS = [ROUTES.Orders, ROUTES.Catalogues, ROUTES.Webhooks, ROUTES.AppointmentBooking, ROUTES.WhatsappForm, ROUTES.AICall, ROUTES.AICallAgents, ROUTES.AICallLogs, ROUTES.AICallAgentsCreate, ROUTES.AICallAgentsEdit];

interface FeatureGuardProps {
  children: React.ReactNode;
}

const FeatureGuard: React.FC<FeatureGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const { isAuthenticated, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { isPathEnabled, isLoading: featureLoading } = useFeatureAccess();
  const isBaileys = selectedWorkspace?.waba_type === "baileys";

  const isRestricted = useMemo(() => {
    if (featureLoading) return false;
    // 1. Baileys restriction
    if (isBaileys && RESTRICTED_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"))) {
      return true;
    }
    // 2. Plan feature restriction
    if (!isPathEnabled(pathname)) {
      return true;
    }
    return false;
  }, [isBaileys, pathname, isPathEnabled, featureLoading]);

  useEffect(() => {
    if (isAuthenticated && isRestricted) {
      setIsRedirecting(true);
      router.replace(ROUTES.Dashboard);
    }
  }, [isAuthenticated, isRestricted, router]);

  useEffect(() => {
    if (!isRestricted && isRedirecting) {
      setIsRedirecting(false);
    }
  }, [pathname, isRestricted, isRedirecting]);

  if (authLoading || featureLoading || (isRestricted && isRedirecting)) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default FeatureGuard;
