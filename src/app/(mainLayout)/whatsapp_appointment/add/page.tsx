"use client";

import AppointmentConfigForm from "@/src/components/appointment/AppointmentConfigForm";

export default function AppointmentConfigAddPage() {
  return (
    <div className="p-4 sm:p-8 bg-(--page-body-bg) dark:bg-(--dark-body) h-full ">
      <AppointmentConfigForm />
    </div>
  );
}
