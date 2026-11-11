"use client";

import AppointmentBookingList from "@/src/components/appointment/AppointmentBookingList";

export default function ConfigBookingsPage() {
  return (
    <div className="p-4 sm:p-8 bg-(--page-body-bg) dark:bg-(--dark-body) pt-0!">
      <AppointmentBookingList />
    </div>
  );
}
