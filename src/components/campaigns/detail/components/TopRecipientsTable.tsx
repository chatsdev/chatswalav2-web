interface TopRecipientsTableProps {
  list: Array<{
    contact: string;
    phone: string;
    status: string;
    reason: string;
  }>;
}

export const TopRecipientsTable = ({ list }: TopRecipientsTableProps) => {
  if (!list || list.length === 0) {
    return (
      <p className="text-xs text-slate-400 font-bold py-12 text-center">
        No recipient logs found.
      </p>
    );
  }

  return (
    <div className="overflow-hidden border border-slate-200/60 dark:border-(--card-border-color) rounded-lg">
      <div className="overflow-x-auto max-h-76 custom-scrollbar">
        <table className="w-full text-left border-collapse bg-white dark:bg-slate-900/20">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-slate-200/60 dark:border-(--card-border-color) text-sm font-black text-slate-500 bg-slate-50 dark:bg-(--page-body-bg)">
              <th className="py-2.5 px-4">Contact</th>
              <th className="py-2.5 px-4">Phone Number</th>
              <th className="py-2.5 px-4 text-center">Status</th>
              <th className="py-2.5 px-4">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm font-bold text-slate-700 dark:text-slate-350">
            {list.map((item, idx) => {
              let statusColor =
                "bg-slate-100 text-slate-700 dark:bg-(--dark-body) dark:text-slate-300";
              if (item.status === "delivered" || item.status === "sent") {
                statusColor =
                  "bg-light-primary text-primary dark:bg-primary-darker/20 dark:text-primary";
              } else if (item.status === "read") {
                statusColor =
                  "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400";
              } else if (item.status === "failed") {
                statusColor =
                  "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400";
              }

              return (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10"
                >
                  <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {item.contact}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                    {item.phone}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span
                      className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded ${statusColor}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td
                    className="py-2.5 px-4 text-slate-500 dark:text-slate-400 max-w-[200px] truncate"
                    title={item.reason}
                  >
                    {item.reason || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
