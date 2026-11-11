"use client";

import AppointmentConfigList from "@/src/components/appointment/AppointmentConfigList";
import WabaGuard from "@/src/shared/WabaGuard";

export default function AppointmentBookingPage() {
  return (
    <WabaGuard>
      <div className="p-4 sm:p-8 bg-(--page-body-bg) dark:bg-(--dark-body) pt-0!">
        <AppointmentConfigList />
      </div>
    </WabaGuard>
  );
}
