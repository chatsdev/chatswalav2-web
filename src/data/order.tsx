import {
    CheckCircle2,
    Clock,
    MessageCircle,
    Package,
    PackageCheck,
    Ship,
    Truck,
} from "lucide-react";

export const STATUS_CONFIG = [
  {
    key: "first_message",
    label: "Welcome Message",
    description:
      "Triggered when a customer makes their initial order on WhatsApp",
    icon: <MessageCircle size={18} className="text-primary" />,
    color: "bg-primary/10",
  },
  {
    key: "pending",
    label: "Awaiting Confirmation",
    description: "Order has been received and is pending confirmation",
    icon: <Clock size={18} className="text-amber-500" />,
    color: "bg-amber-500/10",
  },
  {
    key: "confirmed",
    label: "Order Confirmed",
    description: "Order is verified and currently under processing",
    icon: <CheckCircle2 size={18} className="text-primary" />,
    color: "bg-primary/10",
  },
  {
    key: "ready_to_ship",
    label: "Prepared for Shipping",
    description: "Order has been packed and is prepared for dispatch or pickup",
    icon: <Package size={18} className="text-violet-500" />,
    color: "bg-violet-500/10",
  },
  {
    key: "on_the_way",
    label: "Out for Delivery",
    description:
      "Order is currently out for delivery and on its way to the customer",
    icon: <Truck size={18} className="text-orange-500" />,
    color: "bg-orange-500/10",
  },
  {
    key: "shipped",
    label: "Successfully Delivered",
    description: "Order has been delivered successfully to the customer",
    icon: <PackageCheck size={18} className="text-primary" />,
    color: "bg-primary/10",
  },
];

export const TEMPLATE_VARIABLES = [
  { key: "customer_name", label: "Customer Name", description: "Contact's full name" },
  { key: "wa_order_id", label: "WhatsApp Order ID", description: "The WhatsApp-assigned order ID" },
  { key: "status", label: "Order Status", description: "Current status of the order" },
  { key: "items_summary", label: "Items Summary", description: "Short text of ordered items & qty" },
  { key: "total_price", label: "Total Price", description: "Total value of the order" },
  { key: "currency", label: "Currency", description: "Order currency (e.g. INR, USD)" },
];

export const statusOptions = [
  { value: "pending", label: "status_pending", icon: Clock, color: "text-amber-500" },
  { value: "confirmed", label: "status_confirmed", icon: CheckCircle2, color: "text-primary" },
  { value: "ready_to_ship", label: "status_ready_to_ship", icon: Package, color: "text-blue-500" },
  { value: "on_the_way", label: "status_on_the_way", icon: Truck, color: "text-indigo-500" },
  { value: "shipped", label: "status_shipped", icon: Ship, color: "text-purple-500" },
];