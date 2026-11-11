import PaymentGatewayList from "@/src/components/paymentGateway/PaymentGatewayList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Gateway",
};

export default function PaymentGatewayPage() {
  return (
    <div className="p-4 sm:p-8 bg-(--page-body-bg) dark:bg-(--dark-body) pt-0! min-h-full">
      <PaymentGatewayList />
    </div>
  );
}
