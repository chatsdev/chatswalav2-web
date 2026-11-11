"use client";

import { paymentColors, statusColors } from "@/src/data/appointment";
import { Badge } from "@/src/elements/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Skeleton } from "@/src/elements/ui/skeleton";
import { useGetBookingDetailsQuery } from "@/src/redux/api/appointmentApi";
import { BookingDetailsModalProps } from "@/src/types/appointment";
import dayjs from "dayjs";
import {
  Calendar,
  Clock,
  CreditCard,
  Info,
  MapPin,
  MessageSquare,
  User,
} from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  isOpen,
  onClose,
  bookingId,
}) => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useGetBookingDetailsQuery(
    bookingId || "",
    { skip: !bookingId },
  );

  const booking = data?.booking;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg! max-w-[calc(100%-2rem)]! dark:bg-(--card-color) max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Info className="text-primary" size={20} />
            {t("booking_details")}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            {t("failed_to_load_booking_details", {
              defaultValue: "Failed to load booking details.",
            })}
          </div>
        ) : booking ? (
          <div className="space-y-6 py-2">
            <div className="p-4 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border border-slate-100 dark:border-(--card-border-color) grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">
                  {t("status")}
                </p>
                <Badge
                  className={`${statusColors[booking.status]} px-2.5 py-0.5 font-bold`}
                >
                  {t(`booking_status_${booking.status}`)}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">
                  {t("payment_status")}
                </p>
                <Badge
                  className={`${paymentColors[booking.payment_status]} px-2.5 py-0.5 font-bold`}
                >
                  {t(`payment_status_${booking.payment_status}`)}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                {t("appointment_time", { defaultValue: "Appointment Time" })}
              </h3>
              <div className="p-4 rounded-lg border border-slate-100 dark:border-(--card-border-color) space-y-2">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Calendar size={14} className="text-slate-400" />
                  <span className="font-medium">
                    {dayjs(booking.start_time).format("dddd, DD MMMM YYYY")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Clock size={14} className="text-slate-400" />
                  <span className="font-medium">
                    {dayjs(booking.start_time).format("hh:mm A")} -{" "}
                    {dayjs(booking.end_time).format("hh:mm A")}
                  </span>
                </div>
                {booking.google_meet_link && (
                  <div className="flex items-center gap-2 text-blue-600 mt-2">
                    <MapPin size={14} />
                    <a
                      href={booking.google_meet_link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline font-medium"
                    >
                      Google Meet Link
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User size={16} className="text-primary" />
                {t("customer_information", {
                  defaultValue: "Customer Information",
                })}
              </h3>
              <div className="p-4 rounded-lg border border-slate-100 dark:border-(--card-border-color) grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">{t("customer_name")}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {booking?.contact_id?.name || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">
                    {t("customer_email")}
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {booking?.contact_id?.email || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">
                    {t("customer_phone")}
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {booking?.contact_id?.phone || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {booking.answers && Object.keys(booking.answers).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare size={16} className="text-primary" />
                  {t("additional_details", {
                    defaultValue: "Questionnaire Answers",
                  })}
                </h3>
                <div className="p-4 rounded-lg border border-slate-100 dark:border-(--card-border-color) divide-y divide-slate-100 dark:divide-(--card-border-color)">
                  {Object.entries(booking.answers).map(([key, value]) => {
                    if (["full_name", "name", "email", "phone"].includes(key))
                      return null;
                    return (
                      <div key={key} className="py-2 first:pt-0 last:pb-0">
                        <p className="text-xs text-slate-500 mb-0.5 capitalize">
                          {key.replace(/_/g, " ")}
                        </p>
                        <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">
                          {String(value)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard size={16} className="text-primary" />
                {t("financial_details", { defaultValue: "Financial Details" })}
              </h3>
              <div className="p-4 rounded-lg border border-slate-100 dark:border-(--card-border-color) grid gap-4 grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">{t("amount_due")}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {booking.amount_due?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">{t("amount_paid")}</p>
                  <p className="text-sm font-bold text-primary">
                    {booking.amount_paid?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsModal;
