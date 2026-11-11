/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PLATFORMS } from "@/src/data/facebook";
import { Checkbox } from "@/src/elements/ui/checkbox";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { cn } from "@/src/lib/utils";
import { useFormikContext } from "formik";
import { Settings } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import GeoLocationSelector from "./GeoLocationSelector";

export const Step2AdSet: React.FC = () => {
  const { t } = useTranslation();
  const { values, errors, touched, setFieldValue, handleBlur } =
    useFormikContext<any>();

  const handlePlatformToggle = (platform: string, checked: boolean) => {
    const currentPlatforms =
      values.ad_sets[0].targeting.publisher_platforms || [];
    let nextPlatforms;
    if (checked) {
      nextPlatforms = [...currentPlatforms, platform];
    } else {
      nextPlatforms = currentPlatforms.filter((p: string) => p !== platform);
    }
    setFieldValue("ad_sets[0].targeting.publisher_platforms", nextPlatforms);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col gap-1 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 text-primary dark:text-primary">
          <Settings size={18} className="sm:w-5 sm:h-5" />
          <h2 className="text-lg sm:text-xl font-bold">{t("ad_set_info")}</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t("ad_set_info_desc")}
        </p>
      </div>

      <div className="space-y-2.5">
        <Label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
          {t("ad_set_name")} <span className="text-red-500">*</span>
        </Label>
        <Input
          name="ad_sets[0].name"
          placeholder={t("enter_ad_set_name")}
          value={values.ad_sets[0].name}
          onChange={(e) => setFieldValue("ad_sets[0].name", e.target.value)}
          onBlur={handleBlur}
          className={cn(
            "h-10 sm:h-11 bg-slate-50/50 dark:bg-(--page-body-bg) border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-600/20 transition-all text-sm sm:text-base",
            (touched.ad_sets as any)?.[0]?.name &&
              (errors.ad_sets as any)?.[0]?.name
              ? "border-red-500 bg-red-50/10"
              : "",
          )}
        />
        {(touched.ad_sets as any)?.[0]?.name &&
          (errors.ad_sets as any)?.[0]?.name && (
            <p className="text-[10px] sm:text-xs text-red-500 mt-1 font-medium">
              {(errors.ad_sets as any)?.[0]?.name}
            </p>
          )}
      </div>

      <div className="p-4 sm:p-6 rounded-lg border border-slate-200/60 dark:border-(--card-border-color) bg-slate-50/30 dark:bg-(--card-color) space-y-6 sm:space-y-10">
        <div className="flex items-center gap-3 mb-2 sm:mb-4">
          <div className="w-1 h-5 sm:w-1.5 sm:h-6 bg-primary rounded-full"></div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
            {t("targeting_configuration")}
          </h3>
        </div>

        {/* Geo-Targeting Section */}
        <div className="pb-6 sm:pb-8 border-b border-slate-200/60 dark:border-(--card-border-color)">
          <GeoLocationSelector
            selectedCountries={
              values.ad_sets[0].targeting.geo_locations.countries || []
            }
            onChange={(countries: string[]) =>
              setFieldValue(
                "ad_sets[0].targeting.geo_locations.countries",
                countries,
              )
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 border-b border-slate-200/60 dark:border-(--card-border-color) pb-6 sm:pb-10">
          <div className="space-y-4">
            <Label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t("age_targeting")}
            </Label>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] sm:text-[12px] font-medium text-slate-400">
                  {t("min_age")}
                </Label>
                <Input
                  type="number"
                  className="h-10 sm:h-11 bg-white dark:bg-(--page-body-bg) border-slate-200 text-sm sm:text-base"
                  value={values?.ad_sets[0]?.targeting?.age_range?.[0] ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFieldValue(
                      "ad_sets[0].targeting.age_range[0]",
                      val === "" ? "" : parseInt(val),
                    );
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] sm:text-[12px] font-medium text-slate-400">
                  {t("max_age")}
                </Label>
                <Input
                  type="number"
                  className="h-10 sm:h-11 bg-white dark:bg-(--page-body-bg) border-slate-200 text-sm sm:text-base"
                  value={values?.ad_sets[0]?.targeting?.age_range?.[1] ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFieldValue(
                      "ad_sets[0].targeting.age_range[1]",
                      val === "" ? "" : parseInt(val),
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t("gender_targeting")}
            </Label>
            <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 pt-1 sm:pt-2">
              <div
                key="gender-male"
                className="p-3 sm:p-4.5 rounded-lg flex-1 flex items-center gap-3 group cursor-pointer bg-white! dark:bg-(--page-body-bg)! border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <Checkbox
                  id="gender-male"
                  checked={values?.ad_sets[0]?.targeting?.genders?.includes(1)}
                  onCheckedChange={(checked) => {
                    const currentGenders =
                      values.ad_sets[0].targeting.genders || [];
                    const nextGenders = checked
                      ? [...currentGenders, 1]
                      : currentGenders.filter((g: number) => g !== 1);
                    setFieldValue("ad_sets[0].targeting.genders", nextGenders);
                  }}
                  className="w-4 h-4 sm:w-5 sm:h-5 border-slate-300 dark:border-(--card-border-color) data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor="gender-male"
                  className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {t("male")}
                </Label>
              </div>
              <div
                key="gender-female"
                className="p-3 sm:p-4.5 rounded-lg flex-1 flex items-center gap-3 group cursor-pointer bg-white! dark:bg-(--page-body-bg)! border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <Checkbox
                  id="gender-female"
                  checked={values?.ad_sets[0]?.targeting?.genders?.includes(2)}
                  onCheckedChange={(checked) => {
                    const currentGenders =
                      values.ad_sets[0].targeting.genders || [];
                    const nextGenders = checked
                      ? [...currentGenders, 2]
                      : currentGenders.filter((g: number) => g !== 2);
                    setFieldValue("ad_sets[0].targeting.genders", nextGenders);
                  }}
                  className="w-4 h-4 sm:w-5 sm:h-5 border-slate-300 dark:border-(--card-border-color) data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor="gender-female"
                  className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {t("female")}
                </Label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="space-y-3">
            <Label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t("platforms")}
            </Label>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6 pt-1 sm:pt-2">
              {PLATFORMS.map((platform) => (
                <div
                  key={platform.value}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <Checkbox
                    id={`platform-${platform.value}`}
                    checked={values?.ad_sets[0]?.targeting?.publisher_platforms?.includes(
                      platform.value,
                    )}
                    onCheckedChange={(checked) =>
                      handlePlatformToggle(platform.value, !!checked)
                    }
                    className="w-4 h-4 sm:w-5 sm:h-5 border-slate-300 dark:border-(--card-border-color) data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label
                    htmlFor={`platform-${platform.value}`}
                    className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {platform.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2AdSet;
