import React, { Suspense } from "react";
import FacebookInsightsDashboard from "@/src/components/facebook/insights/FacebookInsightsDashboard";
import { RotateCw } from "lucide-react";

export const metadata = {
  title: "Facebook Ad Insights",
  description: "View detailed performance metrics for your Facebook ad campaigns.",
};

export default function FacebookInsightsPage() {
  return (
    <div className="flex-1 overflow-auto bg-slate-50/30 dark:bg-slate-900/10">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-100 gap-4">
            <RotateCw className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm font-medium text-slate-500">Loading insights...</p>
          </div>
        }
      >
        <FacebookInsightsDashboard />
      </Suspense>
    </div>
  );
}
