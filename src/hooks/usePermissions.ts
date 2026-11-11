import { useAppSelector } from "../redux/hooks";
import { useMemo, useCallback } from "react";
import { MENUITEMS } from "@/src/data/SidebarList";
import { ROUTES } from "../constants";

export const usePermissions = () => {
  const { permissions, isAuthenticated, user } = useAppSelector((state) => state.auth);

  const flatPermissions = useMemo(() => {
    const slugs: string[] = [];
    permissions.forEach((group) => {
      group.submodules.forEach((sub) => {
        slugs.push(sub.slug);
      });
    });
    return slugs;
  }, [permissions]);

  const hasPermission = useCallback(
    (slug?: string, overridePermissions?: string[]): boolean => {
      if (!isAuthenticated) return false;
      if (!slug) return true;

      if (user?.role === "super_admin") {
        return true;
      }

      const perms = overridePermissions || flatPermissions;
      return perms.includes(slug);
    },
    [isAuthenticated, user?.role, flatPermissions]
  );

  const hasAnyPermission = useCallback(
    (slugs: string[] | undefined): boolean => {
      if (!isAuthenticated) return false;
      if (!slugs || slugs.length === 0) return true;

      if (user?.role === "super_admin") return true;

      return slugs.some((slug) => flatPermissions.includes(slug));
    },
    [isAuthenticated, user?.role, flatPermissions]
  );

  const hasModulePermission = useCallback(
    (moduleName: string): boolean => {
      if (!isAuthenticated) return false;
      if (user?.role === "super_admin") return true;

      return permissions.some((p) => p.module === moduleName);
    },
    [isAuthenticated, user?.role, permissions]
  );

  const getFirstAvailableRoute = useCallback(
    (overridePermissions?: string[]): string => {
      if (hasPermission("view.dashboard", overridePermissions)) return ROUTES.Dashboard;

      const sortedItems = [...MENUITEMS].sort((a, b) => a.order - b.order);
      for (const item of sortedItems) {
        if (!item.permission || hasPermission(item.permission, overridePermissions)) {
          return item.path;
        }
      }
      
      return ROUTES.Workspace; // Fallback to workspace selection if no menu items are available
    },
    [hasPermission]
  );

  const isRoutePermitted = useCallback(
    (pathname: string, overridePermissions?: string[]): boolean => {
      if (pathname.startsWith(ROUTES.BillingPlans) || pathname === ROUTES.Workspace || pathname === ROUTES.Landing) {
        return true;
      }

      if (pathname === "/" || pathname === ROUTES.Dashboard) {
        return hasPermission("view.dashboard", overridePermissions);
      }

      const matchingItem = MENUITEMS.find((item) => pathname === item.path || pathname.startsWith(item.path + "/"));

      if (matchingItem) {
        if (matchingItem.roles && !matchingItem.roles.includes(user?.role || "")) {
          return false;
        }

        if (!matchingItem.permission) return true;
        return hasPermission(matchingItem.permission, overridePermissions);
      }

      return true;
    },
    [hasPermission, user?.role]
  );

  return {
    permissions,
    flatPermissions,
    hasPermission,
    hasAnyPermission,
    hasModulePermission,
    getFirstAvailableRoute,
    isRoutePermitted,
    isAuthenticated,
  };
};
