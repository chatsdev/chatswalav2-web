import BillingHistoryList from "@/src/components/subscription/BillingHistoryList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing History",
};

export default function BillingHistoryPage() {
  return (
    <div className="p-4 sm:p-8 bg-(--page-body-bg) dark:bg-(--dark-body) pt-0!">
      <BillingHistoryList />
    </div>
  );
}
