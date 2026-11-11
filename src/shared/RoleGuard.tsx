/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAppSelector } from "@/src/redux/hooks";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Loading from "../app/loading";
import { usePermissions } from "../hooks/usePermissions";
import { useGetMyPermissionsQuery } from "../redux/api/authApi";
import { useAppDispatch } from "../redux/hooks";
import { setPermissions } from "../redux/reducers/authSlice";

interface RoleGuardProps {
  children: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, permissions } = useAppSelector((state) => state.auth);
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const dispatch = useAppDispatch();

  const { isRoutePermitted, getFirstAvailableRoute } = usePermissions();

  const {
    data: permissionsRes,
    isLoading: isLoadingPermissions,
    isFetching: isFetchingPermissions,
    isError: isPermissionsError,
  } = useGetMyPermissionsQuery(selectedWorkspace?._id, {
    skip: !isAuthenticated || !user || !selectedWorkspace,
  });

  useEffect(() => {
    if (permissionsRes?.success) {
      dispatch(setPermissions(permissionsRes.data));
    }
  }, [permissionsRes, dispatch]);

  const isAllowed = useMemo(() => {
    if (!isAuthenticated) return true;

    if (isLoadingPermissions) return null;

    const effectivePermissions = permissionsRes?.data || permissions || [];
    const flatPerms: string[] = [];
    effectivePermissions.forEach((group: any) => {
      group.submodules?.forEach((sub: any) => {
        flatPerms.push(sub.slug);
      });
    });

    if (effectivePermissions.length === 0 && user?.role !== "super_admin") {
      if (!isLoadingPermissions && !isFetchingPermissions) {
        const permitted = isRoutePermitted(pathname, flatPerms);
        if (!permitted) return false;
        return true;
      }
      return null;
    }

    if (isPermissionsError) {
      return true;
    }

    const permitted = isRoutePermitted(pathname, flatPerms);
    if (!permitted) return false;

    return true;
  }, [isAuthenticated, isRoutePermitted, pathname, user?.role, permissions, isPermissionsError, isLoadingPermissions, isFetchingPermissions, permissionsRes?.data]);

  useEffect(() => {
    if (isAuthenticated && isAllowed === false && !isLoadingPermissions) {
      const fallbackRoute = getFirstAvailableRoute();

      if (fallbackRoute === pathname) {
        console.warn("Permission denied for current route, but no better fallback found.");
        return;
      }

      setTimeout(() => setIsRedirecting(true), 0);
      router.push(fallbackRoute);
    }
  }, [isAuthenticated, isAllowed, isLoadingPermissions, router, getFirstAvailableRoute, pathname]);

  useEffect(() => {
    if (isAllowed && isRedirecting) {
      setTimeout(() => setIsRedirecting(false), 0);
    }
  }, [pathname, isAllowed, isRedirecting]);

  if (isLoading || isRedirecting || isLoadingPermissions || isFetchingPermissions || isAllowed === null) {
    return <Loading />;
  }

  if (isAuthenticated && !isAllowed) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default RoleGuard;
