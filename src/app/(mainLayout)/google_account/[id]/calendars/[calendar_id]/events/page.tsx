"use client";

import React, { use } from "react";
import GoogleCalendarEventList from "@/src/components/google/GoogleCalendarEventList";

const CalendarEventsPage = ({ params }: { params: Promise<{ calendar_id: string }> }) => {
  const resolvedParams = use(params);
  const calendarId = resolvedParams.calendar_id;

  return (
    <div className="sm:p-8 p-4">
      <GoogleCalendarEventList calendarId={calendarId} />
    </div>
  );
};

export default CalendarEventsPage;
