"use client";

import React from "react";
import BookingPage from "@/src/components/product/appointment_booking/BookingPage";
import ProductLayout from "@/src/components/product/ProductLayout";
import { useGetPublicPageBySlugQuery } from "@/src/redux/api/pageApi";

export default function AppointmentBookingContainer() {
  const { data: pageData, isLoading } = useGetPublicPageBySlugQuery("appointment_booking");

  if (isLoading) {
    return (
      <ProductLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </ProductLayout>
    );
  }

  return (
    <BookingPage pageData={pageData} />
  );
}
