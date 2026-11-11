"use client";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react";
import SessionSyncProvider from "./SessionSyncProvider";

const SessionWrapper = ({ children, session }: { children: React.ReactNode; session: Session | null }) => {
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/api/auth";
  return (
    <SessionProvider session={session} basePath={basePath}>
      <SessionSyncProvider>
        {children}
      </SessionSyncProvider>
    </SessionProvider>
  );
};

export default SessionWrapper;
