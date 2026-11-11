import { 
  CreatePaymentGatewayRequest, 
  PaymentGatewayResponse, 
  PaymentGatewaysResponse, 
  UpdatePaymentGatewayRequest,
  PaymentGatewayQueryParams,
  PaymentTransactionsResponse
} from "../../types/paymentGateway";
import { baseApi } from "./baseApi";

export const paymentGatewayApi = baseApi.enhanceEndpoints({ addTagTypes: ["PaymentGateways"] }).injectEndpoints({
  endpoints: (builder) => ({
    listGateways: builder.query<PaymentGatewaysResponse, PaymentGatewayQueryParams | void>({
      query: (params) => ({
        url: "/payment_gateway",
        params: params || {},
      }),
      providesTags: ["PaymentGateways"],
    }),
    listTransactions: builder.query<PaymentTransactionsResponse, PaymentGatewayQueryParams | void>({
      query: (params) => ({
        url: "/payment_gateway/transactions",
        params: params || {},
      }),
      providesTags: ["PaymentGateways"],
    }),
    createGateway: builder.mutation<PaymentGatewayResponse, CreatePaymentGatewayRequest>({
      query: (body) => ({
        url: "/payment_gateway",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PaymentGateways"],
    }),
    updateGateway: builder.mutation<PaymentGatewayResponse, { id: string } & UpdatePaymentGatewayRequest>({
      query: ({ id, ...body }) => ({
        url: `/payment_gateway/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PaymentGateways"],
    }),
    deleteGateway: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/payment_gateway/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PaymentGateways"],
    }),
  }),
});

export const {
  useListGatewaysQuery,
  useListTransactionsQuery,
  useCreateGatewayMutation,
  useUpdateGatewayMutation,
  useDeleteGatewayMutation,
} = paymentGatewayApi;
