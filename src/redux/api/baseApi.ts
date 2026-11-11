import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { getSession, signOut } from "next-auth/react";
import { setLogout } from "../reducers/authSlice";
import { setRTL } from "../reducers/layoutSlice";
import { resetChatState } from "../reducers/messenger/chatSlice";
import { clearWorkspace } from "../reducers/workspaceSlice";
import { ROUTES } from "@/src/constants";

const API_BASE_URL = typeof window === "undefined" ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api" : process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

const EXPIRATION_MESSAGES = ["Session expired or logged out", "Token is invalid or expired", "Session expired", "Token expired", "Please log in again", "Invalid token: user not found"];

let sessionPromise: Promise<any> | null = null;

const getCachedSession = async () => {
  if (typeof window === "undefined") return null;

  if (sessionPromise) return sessionPromise;

  sessionPromise = getSession().finally(() => {
    setTimeout(() => {
      sessionPromise = null;
    }, 2000);
  });

  return sessionPromise;
};

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: async (headers, { getState }) => {
    const session = await getCachedSession();
    if (session?.accessToken) {
      headers.set("Authorization", `Bearer ${session.accessToken}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = getState() as any;
    const workspaceId = state?.workspace?.selectedWorkspace?._id;
    if (workspaceId) {
      headers.set("x-workspace-id", workspaceId);
    }

    return headers;
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isSessionExpired = (message: any): boolean => {
  if (typeof message !== "string") return false;
  return EXPIRATION_MESSAGES.some((expMsg) => message.toLowerCase().includes(expMsg.toLowerCase()));
};

const baseQueryWithLogout: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = result.error.data as any;
    const message = data?.error || data?.message || "";

    if (isSessionExpired(message)) {
      api.dispatch(resetChatState());
      api.dispatch(clearWorkspace());
      api.dispatch(setLogout());
      api.dispatch(setRTL(false));

      signOut({ callbackUrl: ROUTES.Login, redirect: true });
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  tagTypes: ["Chats", "Messages", "WhatsappCallAgent", "WhatsappCallLog", "AppointmentConfig", "AppointmentBooking", "PaymentGateways", "Templates", "GoogleAccounts", "GoogleCalendars", "GoogleEvents", "GoogleSheets", "GoogleSheetsData", "GoogleForms", "Segment"],
  baseQuery: baseQueryWithLogout,
  endpoints: () => ({}),
});
