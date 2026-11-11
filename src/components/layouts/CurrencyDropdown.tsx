"use client";

import { useEffect, useMemo } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/elements/ui/dropdown-menu";
import { Button } from "@/src/elements/ui/button";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setSelectedCurrency } from "@/src/redux/reducers/currencySlice";
import { useGetAllCurrenciesQuery } from "@/src/redux/api/currencyApi";

const CurrencyDropdown = ({ onDark = false }: { onDark?: boolean }) => {
  const dispatch = useAppDispatch();
  const selectedCurrency = useAppSelector((state) => state.currency.selectedCurrency);

  const { data: currenciesData, isLoading } = useGetAllCurrenciesQuery({ is_active: true, limit: 100 });

  const currencies = useMemo(() => {
    const list = currenciesData?.data?.currencies ?? [];
    return list.filter((c) => c.is_active);
  }, [currenciesData]);

  useEffect(() => {
    if (currencies.length === 0) return;
    const isSelectedActive = selectedCurrency && currencies.some((c) => c._id === selectedCurrency._id);
    if (!isSelectedActive) {
      const defaultCurrency = currencies.find((c) => c.is_default) ?? currencies[0];
      dispatch(setSelectedCurrency(defaultCurrency));
    }
  }, [currencies, selectedCurrency, dispatch]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" disabled={isLoading} className={`bg-transparent shadow-sm flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-2.5 rounded-lg cursor-pointer transition-colors border-none disabled:opacity-50 disabled:cursor-not-allowed ${onDark ? "text-white hover:bg-white/10 hover:text-white!" : "text-slate-900 dark:text-amber-50 hover:bg-gray-100 dark:bg-(--page-body-bg) dark:hover:bg-(--table-hover)"}`}>
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              <span className="text-sm font-semibold">{selectedCurrency?.symbol ?? "¤"}</span>
              <span className="text-sm font-medium hidden sm:inline uppercase">{selectedCurrency?.code ?? "---"}</span>
              <ChevronDown size={14} className="text-slate-400 shrink-0 hidden sm:block" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52 max-h-80 overflow-y-auto bg-white dark:bg-(--card-color) custom-scrollbar border border-gray-200 dark:border-gray-800 shadow-xl rounded-lg p-1">
        {currencies?.length === 0 ? (
          <div className="px-3 py-4 text-sm text-center text-slate-400">No currencies available</div>
        ) : (
          currencies?.map((currency) => {
            const isActive = selectedCurrency?._id === currency._id;
            return (
              <DropdownMenuItem key={currency._id} onClick={() => dispatch(setSelectedCurrency(currency))} className={`cursor-pointer rounded-md flex items-center gap-2.5 p-2 mb-0.5 last:mb-0 transition-colors ${isActive ? "bg-green-50 text-primary dark:bg-primary-darker/20 dark:text-primary focus:bg-green-50 dark:focus:bg-primary-darker/20" : "hover:bg-slate-50 dark:hover:bg-(--dark-sidebar) focus:bg-slate-50 dark:focus:bg-(--focus-bg-color)/30"}`}>
                <span className="w-7 text-base font-semibold shrink-0 text-center">{currency.symbol}</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium leading-none">{currency?.code}</span>
                  <span className="text-xs text-slate-400 truncate mt-0.5">{currency?.name}</span>
                </div>
                {isActive && <Check size={14} className="text-primary shrink-0 ml-auto" />}
              </DropdownMenuItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencyDropdown;
