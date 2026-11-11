/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { COUNTRIES } from "@/src/data/Countries";
import { Label } from "@/src/elements/ui/label";
import { MultiSelect } from "@/src/elements/ui/multi-select";
import { GeoLocationSelectorProps } from "@/src/types/facebook";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Globe, Loader2, MapPin } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { toast } from "sonner";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const ChangeView = ({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const MapEvents = ({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const GeoLocationSelector: React.FC<GeoLocationSelectorProps> = ({
  selectedCountries,
  onChange,
}) => {
  const { t } = useTranslation();
  const [markers, setMarkers] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]); // Default world center
  const [mapZoom, setMapZoom] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Cache for country coordinates to avoid repeated API calls
  const [coordsCache, setCoordsCache] = useState<
    Record<string, { lat: number; lng: number }>
  >({});

  const countryOptions = COUNTRIES.map((c) => ({
    value: c.code,
    label: c.name,
  }));

  const geocodeCountry = useCallback(
    async (countryName: string, countryObject?: any) => {
      // 1. Check if coordinates are already in the country object (fallback)
      if (countryObject?.lat && countryObject?.lng) {
        return {
          lat: countryObject.lat,
          lng: countryObject.lng,
          name: countryName,
        };
      }

      // 2. Check cache
      if (coordsCache[countryName])
        return { ...coordsCache[countryName], name: countryName };

      try {
        // 3. Fallback to API with rate limit handling
        await new Promise((resolve) => setTimeout(resolve, 1100));

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(countryName)}&limit=1`,
          { headers: { "User-Agent": "CRM-Ads-Wizard" } },
        );
        const data = await response.json();
        if (data && data.length > 0) {
          const coords = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          };
          setCoordsCache((prev) => ({ ...prev, [countryName]: coords }));
          return { ...coords, name: countryName };
        }
      } catch (error) {
        console.error(`Geocoding failed for ${countryName}:`, error);
      }
      return null;
    },
    [coordsCache],
  );

  const handleMapClick = async (lat: number, lng: number) => {
    if (isLocating) return;
    setIsLocating(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=3&addressdetails=1`,
        { headers: { "User-Agent": "CRM-Ads-Wizard" } },
      );
      const data = await response.json();
      const countryCode = data?.address?.country_code?.toUpperCase();

      if (countryCode) {
        const country = COUNTRIES.find((c) => c.code === countryCode);
        if (country) {
          if (!selectedCountries.includes(country.code)) {
            onChange([...selectedCountries, country.code]);
            toast.success(`${t("added")} ${country.name}`);
          } else {
            toast.info(`${country.name} ${t("already_selected")}`);
          }
        } else {
          toast.error(
            t(
              "country_not_supported",
              "This country is not currently supported for targeting",
            ),
          );
        }
      } else {
        toast.error(
          t(
            "could_not_identify_country",
            "Could not identify country from this location",
          ),
        );
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      toast.error(
        t("error_identifying_location", "Error identifying location"),
      );
    } finally {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    let active = true;

    const updateMarkers = async () => {
      if (selectedCountries.length === 0) {
        if (active) setMarkers([]);
        return;
      }

      setIsLoading(true);
      try {
        const newMarkers = [];
        for (const code of selectedCountries) {
          if (!active) break;
          const country = COUNTRIES.find((c) => c.code === code);
          if (country) {
            const coords = await geocodeCountry(country.name, country);
            if (coords && active) {
              newMarkers.push(coords);
            }
          }
        }

        if (!active) return;

        const prevCount = markers.length;
        setMarkers(newMarkers);

        // Auto-center on the newly added location
        if (
          newMarkers.length > prevCount &&
          !isLocating &&
          newMarkers.length > 0
        ) {
          const lastMarker = newMarkers[newMarkers.length - 1];
          setMapCenter([lastMarker.lat, lastMarker.lng]);
          setMapZoom(4);
        }
      } catch (err) {
        console.error("Error updating markers:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    updateMarkers();
    return () => {
      active = false;
    };
  }, [selectedCountries, geocodeCountry, isLocating]);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <Globe size={14} className="text-primary" />
          {t("location_targeting")}
        </Label>
        <div className="relative group">
          <MultiSelect
            options={countryOptions}
            selected={selectedCountries}
            onChange={onChange}
            placeholder={t("select_countries")}
            className="min-h-12 bg-white dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color) focus:ring-primary/20"
          />
          {(isLoading || isLocating) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            </div>
          )}
        </div>
      </div>

      <div className="relative h-75 sm:h-100 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner group">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          attributionControl={false}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeView center={mapCenter} zoom={mapZoom} />
          <MapEvents onMapClick={handleMapClick} />
          {markers.map((marker) => (
            <Marker
              key={marker.name}
              position={[marker.lat, marker.lng]}
              icon={customIcon}
            />
          ))}
        </MapContainer>

        <div className="absolute top-4 right-4 z-1000 flex flex-col gap-2">
          <div className="bg-white/90 dark:bg-(--dark-body) backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
            {isLocating ? (
              <>
                <Loader2 size={12} className="animate-spin text-primary" />
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  {t("identifying_country")}
                </span>
              </>
            ) : (
              <>
                <MapPin size={14} className="text-primary" />
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  {selectedCountries.length} {t("locations_selected")}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="absolute bottom-4 left-4 z-1000 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[2px] px-2 py-1 rounded text-[10px] text-slate-400 border border-slate-200/30">
          {t("click_map_to_select")}
        </div>
      </div>
    </div>
  );
};

export default GeoLocationSelector;
