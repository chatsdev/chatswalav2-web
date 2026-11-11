"use client";

import { cn } from "@/src/lib/utils";
import { DollarSign } from "lucide-react";
import { COUNTRIES } from "../data/Countries";

interface CurrencyIconProps {
  fromCode: string;
  className?: string;
  size?: number;
}


const CurrencyIcon = ({
  fromCode,
  className,
  size = 16,
}: CurrencyIconProps) => {
  const currency = COUNTRIES.find((c) => c.currency === fromCode);

  const symbol = currency?.symbol;

  if (!symbol) {
    return <DollarSign className={className} size={size} />;
  }

  return (
    <span
      className={cn(
        "font-bold text-sm flex items-center justify-center",
        className,
      )}
      style={{
        width: size,
        height: size,
      }}
    >
      {symbol}
    </span>
  );
};
export default CurrencyIcon;
