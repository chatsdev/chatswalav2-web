export const formatCurrencyValue = (
  amount: number,
  symbol: string,
  decimalNumber = 2,
  locale = "en-US"
) => {
  return `${symbol} ${new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimalNumber,
    maximumFractionDigits: decimalNumber,
  }).format(amount)}`;
};
