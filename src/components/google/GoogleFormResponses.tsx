"use client";

import {
  useReadFormQuery,
  useReadFormResponsesQuery,
} from "@/src/redux/api/googleApi";
import CommonHeader from "@/src/shared/CommonHeader";
import { DataTable } from "@/src/shared/DataTable";
import { Column } from "@/src/types/shared";
import { formatDateTime } from "@/src/utils";
import useDebounce from "@/src/utils/hooks/useDebounce";
import { Calendar, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { use, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface GoogleFormResponsesProps {
  paramsPromise: Promise<{ id: string; formId: string }>;
}

const GoogleFormResponses: React.FC<GoogleFormResponsesProps> = ({
  paramsPromise,
}) => {
  const params = use(paramsPromise);
  const accountId = params.id as string;
  const formId = params.formId as string;
  const router = useRouter();
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // 1. Fetch Google Form details to get title/description
  const { data: formResult, isLoading: isFormLoading } = useReadFormQuery({
    formId,
  });

  // 2. Fetch Form responses
  const {
    data: responsesResult,
    isLoading: isResponsesLoading,
    isFetching: isResponsesFetching,
    refetch,
  } = useReadFormResponsesQuery({
    formId,
    page,
    limit,
  });

  const formInfo = formResult?.form?.info;
  const responses = responsesResult?.data?.responses ?? [];

  // Extract unique questions dynamically across the fetched responses to render as columns
  const uniqueQuestions = useMemo(() => {
    const questionsSet = new Set<string>();
    responses.forEach((res: any) => {
      res.answers?.forEach((ans: any) => {
        if (ans.question) {
          questionsSet.add(ans.question);
        }
      });
    });
    return Array.from(questionsSet);
  }, [responses]);

  // Client-side search filtering on the paginated responses
  const searchedResponses = useMemo(() => {
    if (!debouncedSearchTerm) return responses;
    const lowerSearch = debouncedSearchTerm.toLowerCase();
    return responses.filter((res: any) => {
      const emailMatch = res.respondentEmail?.toLowerCase().includes(lowerSearch);
      const answerMatch = res.answers?.some((ans: any) =>
        ans.answer?.toLowerCase().includes(lowerSearch)
      );
      return emailMatch || answerMatch;
    });
  }, [responses, debouncedSearchTerm]);

  const columns: Column<any>[] = useMemo(() => {
    const cols: Column<any>[] = [
      {
        header: "Respondent Email",
        accessorKey: "respondentEmail",
        cell: (row) => (
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-900 dark:text-slate-200 text-sm truncate max-w-48">
              {row.respondentEmail || "Anonymous"}
            </span>
          </div>
        ),
      },
      {
        header: "Submitted At",
        accessorKey: "submittedAt",
        cell: (row) => (
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-400 shrink-0" />
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {row.submittedAt ? formatDateTime(row.submittedAt) : "-"}
            </span>
          </div>
        ),
      },
    ];

    // Append dynamic question columns
    uniqueQuestions.forEach((q) => {
      cols.push({
        header: q,
        accessorKey: q,
        cell: (row) => {
          const answerObj = row.answers?.find((ans: any) => ans.question === q);
          return (
            <span className="text-slate-600 dark:text-slate-300 text-sm font-medium block max-w-xs truncate">
              {answerObj?.answer || "-"}
            </span>
          );
        },
      });
    });

    return cols;
  }, [uniqueQuestions]);

  const handleRefresh = () => {
    refetch();
    toast.success("Responses refreshed");
  };

  return (
    <div className="space-y-8 bg-(--page-body-bg) dark:bg-(--dark-body) animate-in fade-in duration-500">
      <CommonHeader
        title={formInfo?.title || "Form Responses"}
        description={
          formInfo?.description ||
          "View and analyze submissions received for this Google Form."
        }
        onSearch={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        searchTerm={searchTerm}
        searchPlaceholder="Search responses..."
        onRefresh={handleRefresh}
        isLoading={isFormLoading || isResponsesLoading}
        backBtn={true}
        onBack={() => router.push(`/google_account/${accountId}/forms`)}
      />

      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) overflow-hidden shadow-sm">
        <DataTable
          data={searchedResponses}
          columns={columns}
          isLoading={isResponsesLoading}
          isFetching={isResponsesFetching}
          totalCount={responsesResult?.data?.pagination?.totalItems || 0}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          getRowId={(item) => item.responseId || ""}
          emptyMessage={
            searchTerm
              ? `No responses found matching "${searchTerm}"`
              : "No responses submitted for this form yet."
          }
          className="border-none shadow-none rounded-none"
        />
      </div>
    </div>
  );
};

export default GoogleFormResponses;
