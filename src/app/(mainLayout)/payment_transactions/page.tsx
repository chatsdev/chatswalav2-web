import PaymentTransactionList from "@/src/components/paymentGateway/PaymentTransactionList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Transactions",
};

export default function PaymentTransactionsPage() {
  return (
    <div className="p-4 sm:p-8 bg-(--page-body-bg) dark:bg-(--dark-body)  pt-0! ">
      <PaymentTransactionList />
    </div>
  );
}
