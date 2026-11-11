import { ChangePasswordPayload, ForgotPasswordRequest, GenericResponse, RegisterPayload, RegisterResponse, ResendOtpRequest, ResetPasswordRequest, UpdateProfilePayload, VerifyOtpRequest, User, GetRolesResponse, PermissionGroup, ResetPasswordViaTokenRequest, AuthPageSetupResponse } from "@/src/types/auth";
import { baseApi } from "./baseApi";

export const authApi = baseApi.enhanceEndpoints({ addTagTypes: ["User"] }).injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterPayload>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    forgotPassword: builder.mutation<GenericResponse, ForgotPasswordRequest>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    verifyOtp: builder.mutation<GenericResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),
    resendOTP: builder.mutation<GenericResponse, ResendOtpRequest>({
      query: (data) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<GenericResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPasswordViaToken: builder.mutation<GenericResponse, ResetPasswordViaTokenRequest>({
      query: (data) => ({
        url: "/auth/reset-password-via-token",
        method: "POST",
        body: data,
      }),
    }),
    getProfile: builder.query<{ user: User }, void>({
      query: () => ({
        url: "/auth/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<GenericResponse, UpdateProfilePayload>({
      query: (data) => ({
        url: "/auth/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation<GenericResponse, ChangePasswordPayload>({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
    getIsDemoMode: builder.query<
      {
        success: boolean;
        is_demo_mode: boolean;
        logo_light_url?: string;
        logo_dark_url?: string;
        favicon_url?: string;
        demo_user_email?: string;
        demo_user_password?: string;
        demo_agent_email?: string;
        demo_agent_password?: string;
      },
      void
    >({
      query: () => "/is-demo-mode",
    }),
    getRoles: builder.query<GetRolesResponse, void>({
      query: () => ({
        url: "/roles",
        method: "GET",
      }),
    }),
    getMyPermissions: builder.query<{ success: boolean; data: PermissionGroup[] }, string | undefined>({
      query: (workspace_id) => ({
        url: "/auth/my-permissions",
        method: "GET",
        params: workspace_id ? { workspace_id } : undefined,
      }),
    }),
    getAuthPageSetup: builder.query<AuthPageSetupResponse, void>({
      query: () => "/auth-page-setup",
    }),
    backToAdmin: builder.mutation<{ success: boolean; token: string; message: string }, void>({
      query: () => ({
        url: "/self-tenant/back-to-admin",
        method: "POST",
      }),
    }),
    verifySignUpOTP: builder.mutation<GenericResponse, { identifier: string; otp: string }>({
      query: (data) => ({
        url: "/auth/verify-signup-otp",
        method: "POST",
        body: data,
      }),
    }),
    resendSignUpOTP: builder.mutation<GenericResponse, { identifier: string }>({
      query: (data) => ({
        url: "/auth/resend-signup-otp",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useRegisterMutation, useForgotPasswordMutation, useVerifyOtpMutation, useResetPasswordMutation, useResetPasswordViaTokenMutation, useResendOTPMutation, useUpdateProfileMutation, useChangePasswordMutation, useGetProfileQuery, useGetIsDemoModeQuery, useGetRolesQuery, useGetMyPermissionsQuery, useGetAuthPageSetupQuery, useBackToAdminMutation, useVerifySignUpOTPMutation, useResendSignUpOTPMutation } = authApi;
