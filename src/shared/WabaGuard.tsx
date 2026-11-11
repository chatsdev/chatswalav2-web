"use client";

import { useAppSelector } from "@/src/redux/hooks";
import WabaRequired from "./WabaRequired";
import React from "react";

interface WabaGuardProps {
  children: React.ReactNode;
}

const WabaGuard: React.FC<WabaGuardProps> = ({ children }) => {
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const wabaIdFromWorkspace = selectedWorkspace?.waba_id;

  if (!wabaIdFromWorkspace) {
    return <WabaRequired />;
  }

  return <>{children}</>;
};

export default WabaGuard;
