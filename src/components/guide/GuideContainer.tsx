/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Input } from "@/src/elements/ui/input";
import { useGetPublicGuidesQuery } from "@/src/redux/api/guideApi";
import { useAppDispatch } from "@/src/redux/hooks";
import { setSidebarToggle } from "@/src/redux/reducers/layoutSlice";
import { Guide } from "@/src/types/guide";
import { getResolvedImageUrl } from "@/src/utils/image";
import { ChevronRight, HelpCircle, LayoutList, Search, Signpost, X } from "lucide-react";
import { Button } from "@/src/elements/ui/button";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { GuideSkeleton } from "./GuideSkeleton";
import { useTranslation } from "react-i18next";

const GuideContainer = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { data: guideResponse, isLoading } = useGetPublicGuidesQuery();
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(setSidebarToggle(true));

    return () => {
      dispatch(setSidebarToggle(false));
    };
  }, [dispatch]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return t("recently", "Recently");
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? dateString : date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const guides = useMemo(() => {
    if (!guideResponse) return [];
    return Array.isArray(guideResponse.data) ? guideResponse.data : [];
  }, [guideResponse]);

  useEffect(() => {
    if (guides.length > 0 && !selectedGuide) {
      setSelectedGuide(guides[0]);
    }
  }, [guides, selectedGuide]);

  const filteredGuides = useMemo(() => {
    return guides.filter((g) => g.title?.toLowerCase().includes(searchQuery.toLowerCase()) || g.category?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [guides, searchQuery]);

  const groupedGuides = useMemo(() => {
    return filteredGuides.reduce((acc: Record<string, Guide[]>, guide) => {
      const category = guide.category || t("general", "General");
      if (!acc[category]) acc[category] = [];
      acc[category].push(guide);
      return acc;
    }, {} as Record<string, Guide[]>);
  }, [filteredGuides, t]);

  const handleGuideSelect = (guide: Guide) => {
    setSelectedGuide(guide);
    setSidebarOpen(false);
  };

  if (isLoading) {
    return <GuideSkeleton />;
  }

  return (
    <div className="flex h-[calc(100vh-75px)] bg-white dark:bg-(--card-color) overflow-hidden relative">
      {/* Backdrop for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[105] lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Internal Sidebar - Documentation Navigation */}
      <aside
        className={`
          fixed top-0 ltr:left-0 rtl:right-0 h-full z-[110] transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:z-auto lg:h-full lg:shrink-0
          w-80 flex flex-col ltr:border-r rtl:border-l border-gray-100 dark:border-(--card-border-color) bg-white dark:bg-(--card-color)
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full lg:translate-x-0 lg:rtl:translate-x-0"}
        `}
      >
        <div className="sm:p-6 p-4 pb-3 relative">
          <Button onClick={() => setSidebarOpen(false)} className="lg:hidden absolute top-3 right-3 rtl:right-[unset] rtl:left-3 z-50 w-8 h-8 rounded-lg bg-white dark:bg-(--card-color) flex items-center justify-center text-slate-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-(--table-hover) transition-colors shadow-sm" aria-label="Close sidebar">
            <X size={16} />
          </Button>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            {t("user_guide", "User Guide")}
          </h2>
          <div className="relative group">
            <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <Input placeholder={t("search_help_topics", "Search help topics...")} className="ltr:pl-10 rtl:pr-10 h-11 rounded-xl bg-white dark:bg-(--dark-body) border-gray-200 dark:border-white/10 focus:ring-primary/20 transition-all shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-8 space-y-6 custom-scrollbar">
          {Object.entries(groupedGuides).map(([category, categoryGuides]) => (
            <div key={category} className="space-y-1">
              <h3 className="px-3 py-2 text-sm font-black text-slate-400 dark:text-gray-500">{category}</h3>
              <div className="space-y-0.5">
                {categoryGuides.map((guide) => (
                  <Button key={guide._id} onClick={() => handleGuideSelect(guide)} className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-between group ${selectedGuide?._id === guide._id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-600 bg-[unset]! dark:text-gray-400 hover:bg-white dark:hover:bg-white/5 ltr:hover:translate-x-1 rtl:hover:-translate-x-1"}`}>
                    <span className="text-sm font-semibold truncate leading-none">{guide.title}</span>
                    <ChevronRight className={`w-4 h-4 transition-all duration-300 rtl:rotate-180 ${selectedGuide?._id === guide._id ? "translate-x-0 opacity-100" : "opacity-0 ltr:-translate-x-2 rtl:translate-x-2 group-hover:translate-x-0"}`} />
                  </Button>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(groupedGuides).length === 0 && (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-sm font-bold text-gray-500">{t("no_matching_guides", "No matching guides")}</p>
              <p className="text-xs text-gray-400 mt-1">{t("try_different_search_term", "Try a different search term")}</p>
            </div>
          )}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-(--card-color) flex flex-col">
        {/* Mobile Toggle Header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-(--card-border-color) bg-white dark:bg-(--card-color) shrink-0">
          <Button onClick={() => setSidebarOpen(true)} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-light-primary dark:bg-primary/10 text-primary border border-[var(--primary-opacity-20)] dark:border-primary/20 text-sm font-semibold hover:bg-[var(--primary-opacity-20)] dark:hover:bg-primary/20 transition-colors shadow-sm" aria-label="Open Guide menu">
            <LayoutList size={16} />
            <span>{t("guide_menu", "Guide Menu")}</span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {selectedGuide ? (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="sm:mb-8 mb-4">
                <div className="flex items-center gap-2 text-primary mb-6">
                  <span className="px-2.5 py-1 rounded-md bg-primary/10 text-[10px] font-black uppercase tracking-widest ltr:mr-2 rtl:ml-2">{selectedGuide.category}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("last_updated", "Last updated")}: {formatDate(selectedGuide.updated_at)}</span>
                </div>

                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">{selectedGuide.title}</h1>

                {selectedGuide.sub_title && <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{selectedGuide.sub_title}</p>}
              </header>

              {selectedGuide.description && (
                <section className="sm:mb-12 mb-4">
                  <div className="prose prose-slate dark:prose-invert max-w-none ck-content text-lg leading-relaxed text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: selectedGuide.description }} />
                </section>
              )}

              <div className="space-y-20">
                {selectedGuide.sections?.map((section, idx) => (
                  <article key={idx} className="relative m-0!">
                    <div className="absolute ltr:-left-12 rtl:-right-12 top-0 hidden xl:flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 text-primary text-xs font-black">{idx + 1}</div>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:mb-6 mb-4 tracking-tight flex items-center gap-4 xl:gap-0">
                      <span className="xl:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-primary/5 text-primary text-sm font-black shrink-0">{idx + 1}</span>
                      {section.title}
                    </h2>

                    <div className="prose prose-slate dark:prose-invert max-w-none ck-content mb-10 text-slate-600 dark:text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content }} />

                    {section.images && section.images.length > 0 && (
                      <div className={`grid gap-8 mt-10 ${(section.images?.length || 0) > 1 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
                        {section.images.map((img, imgIdx) => (
                          <figure key={imgIdx} className="space-y-4 group">
                            <div className="relative rounded-lg overflow-hidden border border-slate-100 dark:border-white/5 shadow-2xl shadow-slate-200/50 dark:shadow-none bg-slate-50 dark:bg-white/2">
                              <Image src={getResolvedImageUrl(img.url)} alt={img.caption || section.title} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]" width={100} height={100} unoptimized />
                              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                            {img.caption && <figcaption className="text-sm text-center text-slate-500 font-bold ">{img.caption}</figcaption>}
                          </figure>
                        ))}
                      </div>
                    )}

                    {idx < (selectedGuide.sections?.length || 0) - 1 && <div className="sm:mt-6 mt-4 pt-2 border-t border-slate-50 dark:border-white/2 w-full" />}
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-300 p-12">
              <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-white/2 flex items-center justify-center mb-8 relative">
                <Signpost className="w-12 h-12 text-slate-200 dark:text-slate-700" />
                <div className="absolute -right-2 -bottom-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                  <HelpCircle className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3">{t("guide_center", "Guide Center")}</h3>
              <p className="text-center max-w-sm text-slate-500 dark:text-slate-400 font-medium">{t("browse_guides_desc", "Browse through our comprehensive guides to learn how to set up and optimize your WhatsApp CRM experience.")}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GuideContainer;
