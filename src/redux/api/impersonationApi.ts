import { baseApi } from "./baseApi";

interface ImpersonationStatusResponse {
  success: boolean;
  isImpersonating: boolean;
  impersonatorId: string | null;
}

interface StopImpersonationResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

const impersonationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getImpersonationStatus: builder.query<ImpersonationStatusResponse, void>({
      query: () => "/impersonation/status",
    }),
    stopImpersonation: builder.mutation<StopImpersonationResponse, void>({
      query: () => ({
        url: "/impersonation/stop",
        method: "POST",
      }),
    }),
  }),
});

export const { useGetImpersonationStatusQuery, useStopImpersonationMutation } = impersonationApi;
