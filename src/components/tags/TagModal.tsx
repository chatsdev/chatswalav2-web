/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/elements/ui/alert-dialog";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { useGetTagsQuery } from "@/src/redux/api/tagsApi";
import { Tag, TagModalProps } from "@/src/types/components";
import { Label } from "@radix-ui/react-label";
import { Check, Loader2, Palette, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import React, { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../elements/ui/tabs";

const TagModal: React.FC<TagModalProps> = ({ isOpen, onClose, onSave, onAssign, tag, isLoading, fromProfile }) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");
  const [selectedExistingTags, setSelectedExistingTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"existing" | "new">("existing");
  const colorInputRef = useRef<HTMLInputElement>(null);

  const { data: allTagsData } = useGetTagsQuery({}, { skip: !fromProfile });
  const allTags = allTagsData?.data?.tags || [];

  useEffect(() => {
    if (fromProfile && allTags.length === 0) {
      setActiveTab("new");
    } else if (fromProfile && allTags.length > 0) {
      setActiveTab("existing");
    }
  }, [fromProfile, allTags.length, isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (tag) {
        setName(tag?.label || "");
        setColor(tag?.color || "#000000");
      } else {
        setName("");
        setColor("#000000");
      }
      setSelectedExistingTags([]);
    }
  }, [isOpen, tag]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "existing" && onAssign) {
      if (selectedExistingTags.length > 0) {
        const response = await onAssign(selectedExistingTags);
        if (response?.success) {
          onClose();
          setSelectedExistingTags([]);
        }
      } else {
        toast.error(t("please_select_at_least_one_tag"));
      }
    } else {
      if (!name.trim()) {
        toast.error(t("tag_name_required"));
        return;
      }
      const response = await onSave(name.trim(), color);
      if (response?.success) {
        setName("");
        setColor("#000000");
        if (!onAssign) {
          onClose();
        } else {
          setActiveTab("existing");
        }
      }
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="flex flex-row items-center justify-between">
          <div>
            <AlertDialogTitle className="text-xl text-left rtl:text-right font-bold">{tag ? t("edit_tag") : t("add_tag")}</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500">{tag ? t("update_tag_filter") : t("add_tags_filter")}</AlertDialogDescription>
          </div>
          <Button onClick={onClose} className="p-1 hover:bg-gray-100! bg-transparent dark:bg-transparent rounded-lg transition-colors absolute right-4 top-4 rtl:right-auto rtl:left-4 dark:hover:bg-(--table-hover)!">
            <X size={20} className="dark:text-amber-50 text-gray-500" />
          </Button>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-2">
          {fromProfile && !tag ? (
            <Tabs>
              <TabsList className="grid grid-cols-1 sm:grid-cols-2 sm:mb-2 mb-8 bg-slate-100/50 dark:bg-(--page-body-bg)">
                {/* <TabsTrigger className="w-56.75 shadow-none hover:bg-primary hover:text-white dark:hover:bg-[unset]!" active={activeTab === "existing"} onClick={() => setActiveTab("existing")}>
                  {t("select_existing_tag")}
                </TabsTrigger>
                <TabsTrigger className="w-56.75 shadow-none hover:bg-primary hover:text-white dark:hover:bg-[unset]!" active={activeTab === "new"} onClick={() => setActiveTab("new")}>
                  {t("add_new_tag")}
                </TabsTrigger> */}
                <TabsTrigger
                  className={`w-56.75 shadow-none transition-colors ${activeTab === "existing"
                    ? "bg-primary! text-white"
                    : "bg-unset text-slate-800 dark:text-white hover:bg-gray-100"
                    }`}
                  active={activeTab === "existing"}
                  onClick={() => setActiveTab("existing")}
                >
                  {t("select_existing_tag")}
                </TabsTrigger>

                <TabsTrigger
                  className={`w-56.75 shadow-none transition-colors ${activeTab === "new"
                    ? "bg-primary! text-white"
                    : "bg-unset text-slate-800 dark:text-white hover:bg-gray-100"
                    }`}
                  active={activeTab === "new"}
                  onClick={() => setActiveTab("new")}
                >
                  {t("add_new_tag")}
                </TabsTrigger>
              </TabsList>

              <TabsContent active={activeTab === "existing"} className="mt-4">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t("select_existing_tag")}</Label>
                  {allTags.length > 0 ? (
                    <div className="flex  flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1 pt-1">
                      {allTags.map((t: Tag) => {
                        const isSelected = selectedExistingTags.includes(t._id);
                        return (
                          <Button
                            key={t._id}
                            type="button"
                            onClick={() => {
                              setSelectedExistingTags((prev) => (isSelected ? prev.filter((id) => id !== t._id) : [...prev, t._id]));
                              setName("");
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 hover:scale-105 break-all active:scale-95"
                            style={{
                              backgroundColor: isSelected ? t.color : `${t.color}18`,
                              borderColor: t.color,
                              color: isSelected ? "#fff" : t.color,
                            }}
                          >
                            {isSelected && <Check size={11} strokeWidth={3} />}
                            <span className="break-all whitespace-normal line-clamp-2 max-w-[160px]!">{t.label}</span>
                          </Button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-slate-400 italic">
                      <p className="text-sm">{t("no_tags_created_yet")}</p>
                      <Button variant="link" onClick={() => setActiveTab("new")} className="text-xs text-primary mt-1">
                        {t("create_one_now")}
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent active={activeTab === "new"} className="mt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t("tag_name")}</Label>
                    <Input
                      placeholder={t("enter_tag_name")}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (e.target.value) setSelectedExistingTags([]);
                      }}
                      className="h-11 focus:border-primary focus-visible:shadow-none border mt-2 border-gray-200 bg-(--input-color) dark:border-(--card-border-color)"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-3 flex-col">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t("tag_color")}</Label>
                    <div className="flex gap-2">
                      <div className="border w-14 h-14 flex justify-center items-center rounded-lg relative cursor-pointer" onClick={() => colorInputRef.current?.click()}>
                        <Palette size={20} color="gray" />
                        <Input type="color" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" ref={colorInputRef} value={color} onChange={handleColorChange} />
                      </div>
                      <div className="border w-14 h-14 flex justify-center items-center rounded-lg" style={{ backgroundColor: color }}></div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("tag_name")}</Label>
                <Input
                  placeholder={t("enter_tag_name")}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  className="h-11 focus:border-primary focus-visible:shadow-none border mt-2 border-gray-200 bg-(--input-color) dark:border-(--card-border-color)"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 flex-col">
                <Label>{t("tag_color")}</Label>
                <div className="flex gap-2">
                  <div className="border w-14 h-14 flex justify-center items-center rounded-lg relative cursor-pointer" onClick={() => colorInputRef.current?.click()}>
                    <Palette size={20} color="gray" />
                    <Input type="color" className="absolute top-0 left-0 h-full opacity-0 cursor-pointer" ref={colorInputRef} value={color} onChange={handleColorChange} />
                  </div>
                  <div className="border w-14 h-14 flex justify-center items-center rounded-lg" style={{ backgroundColor: color }}></div>
                </div>
              </div>
            </div>
          )}

          <AlertDialogFooter className="sm:justify-start">
            <Button type="submit" className="bg-primary text-white px-10 h-11 font-semibold w-full sm:w-auto">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t("saving")}...</span>
                </div>
              ) : tag ? (
                t("update")
              ) : activeTab === "existing" && selectedExistingTags.length > 0 ? (
                `${t("assign")}${selectedExistingTags.length > 1 ? ` (${selectedExistingTags.length})` : ""}`
              ) : (
                t("add")
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TagModal;
