import { Skeleton } from "@/src/elements/ui/skeleton";
import { HelpCircle, Search } from "lucide-react";

export const GuideSkeleton = () => {
  return (
    <div className="flex h-[calc(100vh-75px)] bg-white dark:bg-(--card-color) overflow-hidden relative">
      <aside className="hidden lg:flex w-80 flex-col border-r border-gray-100 dark:border-(--card-border-color) bg-gray-50/20 dark:bg-black/5">
        <div className="p-6 pb-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary/50" />
            <Skeleton className="h-6 w-32" />
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-6">
          {[...Array(3)].map((_, catIdx) => (
            <div key={catIdx} className="space-y-3">
              <Skeleton className="h-3 w-20 ml-3 mb-2" />
              <div className="space-y-2">
                {[...Array(catIdx === 0 ? 4 : 2)].map((_, itemIdx) => (
                  <div key={itemIdx} className="px-4 py-3 flex items-center justify-between">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-white dark:bg-(--card-color) flex flex-col">
        {/* Mobile Header Skeleton */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-(--card-border-color) bg-white dark:bg-(--card-color) shrink-0">
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto px-8 md:px-12 py-16">
            <header className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Skeleton className="h-5 w-20 rounded-md" />
                <div className="w-1 h-1 rounded-full bg-gray-200" />
                <Skeleton className="h-4 w-32" />
              </div>

              <Skeleton className="h-12 w-2/3 mb-6" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-4/5" />
            </header>

            <section className="mb-16 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </section>

            <div className="space-y-20">
              {[...Array(2)].map((_, secIdx) => (
                <article key={secIdx} className="relative">
                  <div className="absolute -left-12 top-0 hidden xl:flex items-center justify-center w-8 h-8 rounded-full bg-gray-50">
                    <Skeleton className="h-4 w-4 rounded-full" />
                  </div>

                  <Skeleton className="h-8 w-1/3 mb-6" />

                  <div className="space-y-3 mb-10">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>

                  <div className="grid gap-8 mt-10 grid-cols-1 md:grid-cols-2">
                    {[...Array(2)].map((_, imgIdx) => (
                      <div key={imgIdx} className="space-y-4">
                        <Skeleton className="aspect-video w-full rounded-3xl" />
                        <Skeleton className="h-3 w-1/2 mx-auto" />
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
