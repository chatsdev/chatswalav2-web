"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Card } from "@/src/elements/ui/card";
import { Skeleton } from "@/src/elements/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/elements/ui/table";
import { CreativePerformanceTableProps } from "@/src/types/facebook";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

const CreativePerformanceTable: React.FC<CreativePerformanceTableProps> = ({
  data = [],
  isLoading,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Card className="border-slate-200 dark:border-(--card-border-color) dark:bg-(--card-color) shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-(--card-border-color) flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="p-0">
          <div className="space-y-4 p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 dark:bg-(--card-color) dark:border-(--card-border-color) shadow-sm overflow-hidden flex flex-col h-full">
      <div className="sm:p-6 p-4 border-b border-slate-100 dark:bg-(--card-color) dark:border-(--card-border-color) bg-slate-50/50 flex flex-col gap-1">
        <h4 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white leading-tight">
          {t("creative_performance", "Creative Performance")}
        </h4>
        <p className="text-[11px] sm:text-sm text-slate-400 font-bold">
          {t(
            "ad_level_metrics",
            "Performance breakdown by individual ad creative",
          )}
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-100 dark:border-(--card-border-color)">
              <TableHead className="font-bold text-[12px] capitalize text-slate-500">
                {t("creative", "Creative")}
              </TableHead>
              <TableHead className="font-bold text-[12px] capitalize text-slate-500">
                {t("ad_id", "Ad ID")}
              </TableHead>
              <TableHead className="font-bold text-[12px] capitalize text-slate-500 text-right">
                {t("spend", "Spend")}
              </TableHead>
              <TableHead className="font-bold text-[12px] capitalize text-slate-500 text-right">
                {t("results", "Results")}
              </TableHead>
              <TableHead className="font-bold text-[12px] capitalize text-slate-500 text-right">
                {t("cpr", "CPR")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-slate-400 font-bold"
                >
                  {t(
                    "no_creative_data",
                    "No creative performance data available",
                  )}
                </TableCell>
              </TableRow>
            ) : (
              data.map((ad) => (
                <TableRow
                  key={ad.ad_id}
                  className="border-slate-100 dark:border-(--card-border-color) hover:bg-slate-50/50 dark:hover:bg-(--table-hover) transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-lg bg-slate-100 dark:bg-(--dark-body) overflow-hidden shrink-0 flex items-center justify-center">
                        {ad.image ? (
                          <Image
                            src={ad.image}
                            alt={ad.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {ad.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-[12px] px-1.5 py-0.5 bg-slate-100 dark:bg-(--dark-body) rounded font-bold text-slate-500">
                      {ad.ad_id}
                    </code>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      ${ad.spend.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20 font-black"
                    >
                      {ad.results}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm font-bold text-slate-500">
                      ${ad.cost_per_result.toFixed(2)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default CreativePerformanceTable;
