"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Input } from "@/src/elements/ui/input";
import { TeamPermission, TeamPermissionGroup } from "@/src/types/components";
import { Check, Minus, Search, ShieldCheck } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

const CustomCheckbox = memo(({ checked, indeterminate }: { checked: boolean; indeterminate?: boolean }) => {
  return (
    <div
      className={`relative h-5 w-5 shrink-0 rounded-md border transition-all flex items-center justify-center
        ${checked || indeterminate ? "bg-primary border-primary text-white shadow-sm" : "bg-white dark:bg-(--card-color) border-slate-300 dark:border-(--card-border-color) group-hover:border-primary/50"}`}
    >
      {checked && !indeterminate && <Check className="h-3.5 w-3.5 stroke-[3px]" />}
      {indeterminate && <Minus className="h-3.5 w-3.5 stroke-[3px]" />}
    </div>
  );
});
CustomCheckbox.displayName = "CustomCheckbox";

const SubmoduleItem = memo(({ sub, isSelected, onToggle }: { sub: TeamPermission; isSelected: boolean; onToggle: (slug: string) => void }) => {
  return (
    <div
      className={`flex items-center gap-3 p-2.5 rounded-lg transition-all cursor-pointer group border
        ${isSelected ? "bg-primary/5 border-primary/20 shadow-xs" : "bg-white dark:bg-(--page-body-bg) border-slate-100 dark:border-(--card-border-color) hover:border-slate-200 dark:hover:border-(--table-hover)"}`}
      onClick={(e) => {
        e.preventDefault();
        onToggle(sub.slug);
      }}
    >
      <CustomCheckbox checked={isSelected} />
      <span className={`text-sm font-semibold select-none flex-1 truncate transition-colors ${isSelected ? "text-primary" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"}`}>{sub.name.replace(/_/g, " ")}</span>
    </div>
  );
});
SubmoduleItem.displayName = "SubmoduleItem";

const ModuleCard = memo(({ perm, selectedSlugs, onToggleModule, onToggleSlug }: { perm: TeamPermissionGroup; selectedSlugs: Set<string>; onToggleModule: (perm: TeamPermissionGroup) => void; onToggleSlug: (slug: string) => void }) => {
  const slugsInModule = useMemo(() => perm.submodules.map((s) => s.slug), [perm.submodules]);
  const selectedInModule = useMemo(() => slugsInModule.filter((s) => selectedSlugs.has(s)), [slugsInModule, selectedSlugs]);

  const isAllSelected = slugsInModule.length > 0 && selectedInModule.length === slugsInModule.length;
  const isIndeterminate = !isAllSelected && selectedInModule.length > 0;

  return (
    <div className="rounded-lg border border-slate-200 dark:border-(--card-border-color) bg-white dark:bg-(--page-body-bg) sm:p-5 p-4 space-y-4 hover:shadow-md transition-all group/card overflow-hidden relative">
      <div className="absolute top-0 right-0 h-1 w-full bg-slate-100 dark:bg-(--page-body-bg)">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(selectedInModule.length / slugsInModule.length) * 100}%` }}></div>
      </div>

      <div
        className="flex items-center justify-between gap-3 cursor-pointer group"
        onClick={(e) => {
          e.preventDefault();
          onToggleModule(perm);
        }}
      >
        <div className="flex items-center gap-3 flex-1 px-1">
          <CustomCheckbox checked={isAllSelected} indeterminate={isIndeterminate} />
          <div className="flex flex-col">
            <span className="text-base font-semibold capitalize text-slate-900 dark:text-white group-hover:text-primary transition-colors">{perm.module.replace(/_/g, " ")}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              {selectedInModule.length} of {slugsInModule.length} enabled
            </span>
          </div>
        </div>
        <div className={`p-2 rounded-lg transition-colors ${isAllSelected ? "bg-primary/10 text-primary" : "bg-slate-100 dark:bg-(--dark-body) text-slate-400"}`}>
          <ShieldCheck size={18} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {perm.submodules.map((sub) => (
          <SubmoduleItem key={sub.slug} sub={sub} isSelected={selectedSlugs.has(sub.slug)} onToggle={onToggleSlug} />
        ))}
      </div>
    </div>
  );
});
ModuleCard.displayName = "ModuleCard";

const PermissionPicker = ({ permissions = [], selectedSlugs = [], onChange }: { permissions: TeamPermissionGroup[]; selectedSlugs: string[]; onChange: (slugs: string[]) => void }) => {
  const [search, setSearch] = useState("");
  const [selection, setSelection] = useState<Set<string>>(new Set(selectedSlugs));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelection(new Set(selectedSlugs));
  }, [selectedSlugs]);

  const filteredPermissions = useMemo(() => {
    if (!search.trim()) return permissions;
    const q = search.toLowerCase();
    return permissions
      .map((perm) => ({
        ...perm,
        submodules: perm.submodules.filter((sub) => perm.module.toLowerCase().includes(q) || sub.name.toLowerCase().includes(q) || sub.slug.toLowerCase().includes(q)),
      }))
      .filter((perm) => perm.submodules.length > 0);
  }, [permissions, search]);

  const { slugToViewSlugMap, viewSlugToOtherSlugsMap } = useMemo(() => {
    const slugToView: Record<string, string> = {};
    const viewToOthers: Record<string, string[]> = {};

    permissions.forEach((perm) => {
      const viewSub = perm.submodules.find((s) => s.name.toLowerCase() === "view");
      if (viewSub) {
        const others: string[] = [];
        perm.submodules.forEach((sub) => {
          slugToView[sub.slug] = viewSub.slug;
          if (sub.slug !== viewSub.slug) {
            others.push(sub.slug);
          }
        });
        viewToOthers[viewSub.slug] = others;
      }
    });

    return { slugToViewSlugMap: slugToView, viewSlugToOtherSlugsMap: viewToOthers };
  }, [permissions]);

  const onToggleSlug = useCallback(
    (slug: string) => {
      const next = new Set(selection);
      const viewSlug = slugToViewSlugMap[slug];

      if (next.has(slug)) {
        next.delete(slug);
        if (slug === viewSlug) {
          const others = viewSlugToOtherSlugsMap[slug] || [];
          others.forEach((s) => next.delete(s));
        }
      } else {
        next.add(slug);
        if (viewSlug) {
          next.add(viewSlug);
        }
      }

      setSelection(next);
      onChange(Array.from(next));
    },
    [selection, onChange, slugToViewSlugMap, viewSlugToOtherSlugsMap]
  );

  const onToggleModule = useCallback(
    (perm: TeamPermissionGroup) => {
      const slugsInModule = perm.submodules.map((s) => s.slug);
      const allSelected = slugsInModule.every((s) => selection.has(s));

      const next = new Set(selection);
      if (allSelected) {
        slugsInModule.forEach((s) => next.delete(s));
      } else {
        slugsInModule.forEach((s) => next.add(s));
      }

      setSelection(next);
      onChange(Array.from(next));
    },
    [selection, onChange]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <div className="w-full flex items-center gap-4 flex-col sm:flex-row sticky top-0">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter by module or action..." className="pl-11 h-12 bg-white dark:bg-(--page-body-bg) border-slate-200 dark:border-none rounded-lg focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
          </div>
          <div className={`flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-(--page-body-bg) rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-xs transition-opacity duration-300 ${selection.size > 0 ? "opacity-100" : "opacity-50"}`}>
            <Badge className="bg-primary text-white font-bold h-6 min-w-6 flex items-center justify-center rounded-md px-1">{selection.size}</Badge>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Permits Enabled</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 [@media(max-width:1499px)]:grid-cols-2 [@media(max-width:574)]:grid-cols-1 custom-scrollbar max-h-[550px] overflow-auto">
        {filteredPermissions.map((perm) => (
          <ModuleCard key={perm._id} perm={perm} selectedSlugs={selection} onToggleModule={onToggleModule} onToggleSlug={onToggleSlug} />
        ))}

        {filteredPermissions.length === 0 && (
          <div className="col-span-full py-24 text-center space-y-3 bg-white dark:bg-(--page-body-bg) rounded-lg border-2 border-dashed border-slate-200 dark:border-(--card-border-color) transition-all">
            <div className="h-16 w-16 bg-slate-50 dark:bg-(--dark-body) rounded-full flex items-center justify-center mx-auto text-slate-300">
              <Search size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-slate-900 dark:text-white">No matches found</p>
              <p className="text-sm text-slate-500 font-medium">Try searching for a different keyword or module name</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionPicker;
