"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { OrderItemsModalPropsData } from "@/src/types/order";
import { Package, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const OrderItemsModal = ({ isOpen, onClose, items, orderId }: OrderItemsModalPropsData) => {
  const { t } = useTranslation();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg! dark:bg-(--card-color) max-w-[calc(100%-2rem)]! gap-0! w-full p-0! overflow-hidden rounded-lg gap-0">
        <DialogHeader className="sm:px-6 px-4 pt-6 pb-4 border-b border-slate-100 dark:border-(--card-border-color)">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <ShoppingBag size={18} className="text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base font-black text-slate-800 dark:text-white">{t("order_items_title")}</DialogTitle>
              {orderId && <p className="text-xs text-slate-400 font-medium mt-0.5 font-mono">#{orderId}</p>}
            </div>
          </div>
        </DialogHeader>

        <div className="sm:px-6 px-4 py-4 space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              <Package size={36} className="mb-2 opacity-50" />
              <p className="text-sm font-medium">{t("no_items_in_order")}</p>
            </div>
          ) : (
            items.map((item, i) => (
              <div key={item._id || i} className="flex items-center gap-4 p-3.5 bg-slate-100 dark:bg-black/20 rounded-lg border border-slate-100 dark:border-(--card-border-color) hover:border-primary/20 dark:hover:border-primary/20 transition-colors group">
                <div className="shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-(--page-body-bg) border border-slate-200 dark:border-(--card-border-color)">
                  {item.product_details?.image_urls?.[0] ? (
                    <Image src={item.product_details.image_urls[0]} alt={item.product_details?.name || t("product")} width={56} height={56} className="w-full h-full object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={22} className="text-slate-300 dark:text-slate-600" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-700 dark:text-white truncate group-hover:text-primary transition-colors">{item.product_details?.name || item.name || `Product #${item.product_retailer_id}`}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5 font-mono">SKU: {item.product_retailer_id}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-bold bg-slate-100 dark:bg-(--page-body-bg) text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">{t("qty_label")} {item.quantity}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-base font-black text-primary">{item.price.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{item.raw?.currency || "INR"}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="sm:px-6 px-4 py-4 bg-slate-50/50 dark:bg-black/10 border-t border-slate-100 dark:border-(--card-border-color) flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500">
              <ShoppingBag size={15} />
              <span className="text-sm font-bold">
                {items.length} {items.length > 1 ? t("item_plural") : t("item_singular")}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400 font-bold ">{t("total_value")}</p>
              <p className="text-lg font-black text-primary">{items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderItemsModal;
