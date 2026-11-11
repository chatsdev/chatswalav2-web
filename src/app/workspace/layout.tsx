import ImpersonationBanner from "@/src/components/layouts/ImpersonationBanner";
import React from "react";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ImpersonationBanner />
      <div className="flex-1">{children}</div>
    </div>
  );
}
