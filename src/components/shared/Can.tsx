"use client";

import { usePermissions } from "@/src/hooks/usePermissions";
import React from "react";
import { CanProps } from "@/src/types/shared";

const Can: React.FC<CanProps> = ({
  permission,
  anyPermission,
  module,
  children,
  fallback = null,
}) => {
  const { hasPermission, hasAnyPermission, hasModulePermission } =
    usePermissions();

  let allowed = false;
  if (permission) {
    allowed = hasPermission(permission);
  } else if (anyPermission) {
    allowed = hasAnyPermission(anyPermission);
  } else if (module) {
    allowed = hasModulePermission(module);
  } else {
    allowed = true;
  }

  return allowed ? <>{children}</> : <>{fallback}</>;
};

export default Can;
