"use client";

import { ComparisonTableProps } from "@/src/types/channel";

export default function ComparisonTable({
  comparison,
  primaryColor,
}: ComparisonTableProps) {
  if (!comparison.title) return null;

  return (
    <section className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))]">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
        <div className="text-center max-w-4xl mx-auto mb-[calc(18px+(64-18)*((100vw-320px)/(1920-320)))]">
          {comparison.badge && (
            <span
              className="text-[12px] font-bold text-primary uppercase tracking-wide px-4.5 py-1.5 rounded-full inline-block mb-3.5 "
              style={{ backgroundColor: primaryColor + "33" }}
            >
              {comparison.badge}
            </span>
          )}
          <h2 className="text-[calc(22px+14*((100vw-320px)/1600))] font-bold text-slate-900 tracking-tight leading-tight">
            {comparison.title}
          </h2>
          {comparison.subtitle && (
            <p className="mt-4 text-[15px] font-medium text-slate-600 leading-relaxed">
              {comparison.subtitle}
            </p>
          )}
        </div>

        <div className="max-w-6xl mx-auto overflow-hidden bg-white/70 backdrop-blur-md rounded-lg border border-slate-200/80 shadow-[0_15px_45px_rgba(0,0,0,0.03)] p-[1px]">
          <div className="overflow-x-auto table-custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="py-5 px-6 text-[13px] font-bold text-slate-500 w-[40%]">
                    Platform Feature
                  </th>
                  <th className="py-5 px-6 text-[13px] font-bold text-slate-400 w-[30%]">
                    WhatsApp App
                  </th>
                  <th
                    className="py-5 px-6 text-[13px] font-bold w-[30%] bg-[#25D366]/5"
                    style={{
                      color: primaryColor,
                      backgroundColor: primaryColor + "0d",
                    }}
                  >
                    Official API
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[14.5px] font-medium text-slate-700">
                {comparison.platform_feature_array.map(
                  (row: any, idx: number) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/30 transition-colors"
                    >
                      <td className="py-4 px-6 text-slate-900 font-extrabold [@media(max-width:991px)]:min-w-[320px]">
                        {row.platform_feature}
                      </td>
                      <td className="py-4 px-6 text-slate-400 [@media(max-width:991px)]:min-w-[320px]">
                        {row.whatsapp_feature}
                      </td>
                      <td
                        className="py-4 px-6 text-slate-700 [@media(max-width:991px)]:min-w-[320px]"
                        style={{ backgroundColor: primaryColor + "0d" }}
                      >
                        {row.official_api}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
