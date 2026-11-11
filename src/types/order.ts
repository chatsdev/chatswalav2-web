// Order and Order Template types

export interface OrderItem {
  _id: string;
  product_retailer_id: string;
  quantity: number;
  price: number;
  name: string | null;
  raw?: {
    product_retailer_id: string;
    quantity: number;
    item_price: number;
    currency: string;
  };
  product_details: {
    name: string;
    image_urls: string[];
  } | null;
}

export interface Order {
  _id: string;
  user_id: string;
  contact_id: {
    _id: string;
    phone_number: string;
    name: string;
    email: string;
  };
  wa_message_id: string;
  wa_order_id: string | null;
  currency: string | null;
  total_price: number;
  status: string;
  payment_status: "paid" | "unpaid";
  payment_link_sent: boolean;
  payment_link?: string | null;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export interface StatusTemplate {
  _id: string;
  user_id: string;
  status: string;
  message_template: string;
  is_active: boolean;
  use_approved_template?: boolean;
  approved_template_id?: any;
  variable_mappings?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface StatusTemplatesResponse {
  success: boolean;
  data: StatusTemplate[];
}

export interface ParsedSegment {
  text: string;
  isVariable: boolean;
}

export interface OrderItemsModalProps {
  items: OrderItem[];
  onClose: () => void;
}

export interface OrderItemsModalPropsData {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  orderId: string | null;
}

export interface ParsedSegmentProps {
  text: string;
  isVariable: boolean;
}

export interface StatusTemplateCardProps {
  index: number;
  statusKey: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  existing?: StatusTemplate;
}

export interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
  currentStatus: string;
}