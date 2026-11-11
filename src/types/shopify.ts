export interface ShopifyConfig {
  _id?: string;
  shop_domain: string;
  admin_api_access_token: string;
  client_id: string;
  client_secret: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ShopifyConfigPayload {
  shop_domain: string;
  admin_api_access_token: string;
  client_id: string;
  client_secret: string;
  is_active: boolean;
}

export interface ShopifyConfigResponse {
  success: boolean;
  message?: string;
  data?: ShopifyConfig | null;
  config?: ShopifyConfig | null;
}

export interface ShopifyGenericResponse {
  success: boolean;
  message?: string;
}

export interface ShopifyProductVariant {
  _id: string;
  name: string;
  price: string;
  retailer_id: string;
  availability: string;
  image_urls?: string[];
}

export interface ShopifyProduct {
  _id: string;
  name: string;
  description?: string;
  price: string;
  currency: string;
  image_urls?: string[];
  url?: string;
  retailer_id: string;
  variants?: ShopifyProductVariant[];
  created_at?: string;
}

export interface ShopifyProductsResponse {
  success: boolean;
  data: {
    products: ShopifyProduct[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export interface SecretInputProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export interface FormState {
  shop_domain: string;
  admin_api_access_token: string;
  client_id: string;
  client_secret: string;
  is_active: boolean;
}

export interface ShopifyConfigFormProps {
  form: FormState;
  isDirty: boolean;
  isConnected: boolean;
  isSaving: boolean;
  onChange: (field: keyof FormState, value: string | boolean) => void;
  onSave: () => void;
  onDisconnectClick: () => void;
  onRefresh: () => void;
}

export interface FormState {
  shop_domain: string;
  admin_api_access_token: string;
  client_id: string;
  client_secret: string;
  is_active: boolean;
}

export const EMPTY_FORM: FormState = {
  shop_domain: "",
  admin_api_access_token: "",
  client_id: "",
  client_secret: "",
  is_active: true,
};
