"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { LocationMapPickerProps } from "@/src/types/shared";
import { Loader2, MapPin, Navigation, Search } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";

// Dynamic import of the inner Leaflet map to avoid SSR issues
const LeafletMapInner = dynamic(
  () =>
    import("@/src/components/response-resources/sequence-step/LeafletMapInner"),
  { ssr: false },
);

const LocationMapPicker: React.FC<LocationMapPickerProps> = ({
  value,
  onChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [position, setPosition] = useState<[number, number]>([
    parseFloat(value.latitude) || 19.076,
    parseFloat(value.longitude) || 72.8777,
  ]);

  // Keep internal position in sync if parent changes value programmatically
  useEffect(() => {
    const lat = parseFloat(value.latitude);
    const lng = parseFloat(value.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      setPosition([lat, lng]);
    }
  }, [value.latitude, value.longitude]);

  const fetchAddress = useCallback(
    async (lat: number, lng: number) => {
      setIsReverseGeocoding(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          { headers: { "User-Agent": "CRM-Chat-App" } },
        );
        const data = await res.json();
        const displayName: string =
          data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        const shortName: string =
          data.address?.amenity ||
          data.address?.building ||
          data.address?.road ||
          data.address?.suburb ||
          data.address?.city ||
          "";
        onChange({
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
          name: shortName,
          address: displayName,
        });
      } catch {
        onChange({
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
          name: value.name || "",
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        });
      } finally {
        setIsReverseGeocoding(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onChange],
  );

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      setPosition([lat, lng]);
      fetchAddress(lat, lng);
    },
    [fetchAddress],
  );

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
        { headers: { "User-Agent": "CRM-Chat-App" } },
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setPosition([lat, lng]);
        onChange({
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
          name: data[0].display_name?.split(",")[0] || "",
          address: data[0].display_name,
        });
      }
    } catch {
      // silent fail
    } finally {
      setIsSearching(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);
        fetchAddress(lat, lng);
        setIsLocating(false);
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true },
    );
  };

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="relative">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a place or address…"
          className="pl-10 pr-10 h-11 rounded-xl bg-slate-50 dark:bg-(--dark-body) border-slate-200 dark:border-slate-700 focus-visible:ring-primary"
        />
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
        />
        {isSearching && (
          <Loader2
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary animate-spin"
            size={15}
          />
        )}
      </form>

      {/* Leaflet Map */}
      <div className="relative h-60 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
        <LeafletMapInner
          position={position}
          onLocationSelect={handleMapClick}
        />

        {/* GPS button overlay */}
        <div className="absolute top-2 right-2 z-[1000]">
          <Button
            type="button"
            size="icon"
            title="Use my location"
            onClick={getCurrentLocation}
            disabled={isLocating}
            className="h-9 w-9 rounded-lg shadow-md bg-white dark:bg-(--card-color) text-slate-500 hover:text-primary dark:text-slate-300 border border-slate-200 dark:border-slate-700"
          >
            {isLocating ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Navigation size={15} />
            )}
          </Button>
        </div>
      </div>

      {/* Selected location summary card */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-(--page-body-bg) border border-slate-100 dark:border-slate-800 flex gap-3 items-start">
        <div className="p-1.5 rounded-lg bg-primary/10 shrink-0 mt-0.5">
          <MapPin size={14} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0 space-y-0.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Selected Location
          </p>
          {isReverseGeocoding ? (
            <div className="flex items-center gap-2 text-slate-500">
              <Loader2 size={12} className="animate-spin" />
              <span className="text-xs">Fetching address…</span>
            </div>
          ) : (
            <>
              <p className="text-xs font-semibold text-slate-700 dark:text-white leading-snug break-words">
                {value.address || "Click on the map to pin a location"}
              </p>
              <p className="text-[10px] font-mono text-slate-400">
                {value.latitude && value.longitude
                  ? `${value.latitude}, ${value.longitude}`
                  : "—"}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Editable name / address overrides */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Name (Optional)
          </Label>
          <Input
            value={value.name || ""}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            placeholder="e.g. Main Office"
            className="h-10 rounded-lg text-xs bg-slate-50 dark:bg-(--dark-body) border-slate-200 dark:border-slate-700"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Address (Optional)
          </Label>
          <Input
            value={value.address || ""}
            onChange={(e) => onChange({ ...value, address: e.target.value })}
            placeholder="e.g. 123 Street"
            className="h-10 rounded-lg text-xs bg-slate-50 dark:bg-(--dark-body) border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>
    </div>
  );
};

export default LocationMapPicker;
