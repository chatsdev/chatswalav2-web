"use client";

import React from "react";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";

interface PlanFeatureProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PlanFeature: React.FC<PlanFeatureProps> = ({ feature, children, fallback = null }) => {
  const { isFeatureEnabled, isLoading } = useFeatureAccess();

  if (isLoading) return null;

  const enabled = isFeatureEnabled(feature);

  return enabled ? <>{children}</> : <>{fallback}</>;
};

export default PlanFeature;
