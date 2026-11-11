"use client";

import AppointmentConfigForm from "@/src/components/appointment/AppointmentConfigForm";

export default function AppointmentConfigEditPage() {
  return (
    <div className="p-4 sm:p-8 bg-(--page-body-bg) dark:bg-(--dark-body) pt-0!">
      <AppointmentConfigForm />
    </div>
  );
}
