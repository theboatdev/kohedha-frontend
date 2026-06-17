"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  MapPin,
  Search,
  Navigation,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGoogleMaps } from "@/lib/google-maps/use-google-maps";
import { parseGeocoderResult } from "@/lib/google-maps/parse-address";
import type { SelectedLocation } from "@/types/location";

interface LocationMapSelectorProps {
  value: SelectedLocation | null;
  onChange: (location: SelectedLocation | null) => void;
  error?: string;
  /** When true, the map and marker are visible but all interaction is disabled */
  disabled?: boolean;
}

const COLOMBO = { lat: 6.9271, lng: 79.8612 };
const AUTOCOMPLETE_DEBOUNCE_MS = 300;

export function LocationMapSelector({
  value,
  onChange,
  error,
  disabled = false,
}: LocationMapSelectorProps) {
  const { isLoaded, loadError } = useGoogleMaps();

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Reverse geocode and propagate the result to the parent
  const applyCoordinates = useCallback(
    async (lat: number, lng: number) => {
      const geocoder = new window.google.maps.Geocoder();
      try {
        const response = await geocoder.geocode({ location: { lat, lng } });
        const result = response.results[0];
        onChange(
          result
            ? parseGeocoderResult(result, { lat, lng })
            : { coordinates: { lat, lng } },
        );
      } catch {
        onChange({ coordinates: { lat, lng } });
      }
    },
    [onChange],
  );

  const placeMarker = useCallback(
    (lat: number, lng: number) => {
      if (!mapInstanceRef.current) return;
      if (markerRef.current) markerRef.current.setMap(null);

      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapInstanceRef.current,
        draggable: !disabled,
        title: "Selected Location",
      });

      if (!disabled) {
        marker.addListener("dragend", (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          applyCoordinates(e.latLng.lat(), e.latLng.lng());
        });
      }

      markerRef.current = marker;
      mapInstanceRef.current.panTo({ lat, lng });
    },
    [applyCoordinates, disabled],
  );

  // Initialise map once API is ready
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    const center = value?.coordinates ?? COLOMBO;

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 14,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      gestureHandling: disabled ? "none" : "auto",
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    mapInstanceRef.current = map;

    if (value?.coordinates) {
      placeMarker(value.coordinates.lat, value.coordinates.lng);
    }

    if (!disabled) {
      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        placeMarker(lat, lng);
        applyCoordinates(lat, lng);
      });
    }
  }, [isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  // When value changes externally (e.g. on load in venue-details), sync the marker
  const prevCoordsRef = useRef<{ lat: number; lng: number } | null>(null);
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;
    const coords = value?.coordinates ?? null;
    if (
      coords &&
      (coords.lat !== prevCoordsRef.current?.lat ||
        coords.lng !== prevCoordsRef.current?.lng)
    ) {
      placeMarker(coords.lat, coords.lng);
      prevCoordsRef.current = coords;
    }
    if (!coords && markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
      prevCoordsRef.current = null;
    }
  }, [value, isLoaded, placeMarker]);

  // Fetch autocomplete predictions as the user types (debounced)
  const fetchPredictions = useCallback(
    (query: string) => {
      if (!query.trim() || !window.google) {
        setPredictions([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        {
          input: `${query.trim()}, Sri Lanka`,
          types: ["establishment", "geocode"],
        },
        (results, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            results
          ) {
            setPredictions(results.slice(0, 6));
          } else {
            setPredictions([]);
          }
          setIsSearching(false);
        },
      );
    },
    [],
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setPredictions([]);
      setIsSearching(false);
      return;
    }
    if (!isLoaded) return;
    setIsSearching(true);
    debounceRef.current = setTimeout(
      () => fetchPredictions(value),
      AUTOCOMPLETE_DEBOUNCE_MS,
    );
  };

  const handleSelectPrediction = (
    prediction: google.maps.places.AutocompletePrediction,
  ) => {
    setPredictions([]);
    setSearchQuery("");

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div"),
    );

    service.getDetails(
      {
        placeId: prediction.place_id,
        fields: ["geometry", "formatted_address", "address_components", "name"],
      },
      (place, status) => {
        if (
          status !== window.google.maps.places.PlacesServiceStatus.OK ||
          !place?.geometry?.location
        )
          return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        placeMarker(lat, lng);
        applyCoordinates(lat, lng);
      },
    );
  };

  const handleUseCurrentLocation = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    setIsGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setIsGeolocating(false);
        placeMarker(coords.latitude, coords.longitude);
        applyCoordinates(coords.latitude, coords.longitude);
      },
      () => {
        setIsGeolocating(false);
        setGeoError(
          "Location access denied. Please select manually on the map.",
        );
      },
      { timeout: 10000 },
    );
  };

  const handleClear = () => {
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
    onChange(null);
    setGeoError(null);
  };

  // ─── Error state ──────────────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium font-poppins text-red-800">
            Map unavailable
          </p>
          <p className="text-xs text-red-600 font-poppins mt-0.5">
            {loadError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Search bar — hidden when disabled */}
      {!disabled && (
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
              )}
              <Input
                type="text"
                placeholder="Search for a location in Sri Lanka..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setPredictions([]);
                    setSearchQuery("");
                  }
                }}
                className="pl-10 pr-10 font-poppins h-11 border-gray-200 focus:border-gray-900"
                autoComplete="off"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleUseCurrentLocation}
              disabled={isGeolocating || !isLoaded}
              title="Use my current location"
              className="h-11 px-3 shrink-0"
            >
              {isGeolocating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Autocomplete dropdown */}
          {predictions.length > 0 && (
            <div className="absolute z-50 top-full left-0 right-10 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg divide-y divide-gray-100 overflow-hidden">
              {predictions.map((prediction) => (
                <button
                  key={prediction.place_id}
                  type="button"
                  onClick={() => handleSelectPrediction(prediction)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <p className="text-sm font-medium font-poppins text-gray-900 truncate">
                    {prediction.structured_formatting.main_text}
                  </p>
                  <p className="text-xs text-gray-500 font-poppins truncate">
                    {prediction.structured_formatting.secondary_text}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Geolocation error */}
      {geoError && (
        <p className="text-xs text-amber-600 font-poppins flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {geoError}
        </p>
      )}

      {/* Map */}
      <div
        className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm"
        style={{ pointerEvents: disabled ? "none" : undefined }}
      >
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        )}
        <div ref={mapRef} className={disabled ? "w-full h-[280px]" : "w-full h-[380px]"} />
      </div>

      {!disabled && (
        <p className="text-xs text-gray-500 font-poppins text-center">
          Click anywhere on the map or drag the pin to set your location
        </p>
      )}

      {/* Selected location confirmation */}
      {value?.coordinates && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 min-w-0">
              <MapPin className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm font-medium font-poppins text-green-900">
                  Location selected
                </p>
                {value.streetAddress && (
                  <p className="text-xs text-green-700 font-poppins mt-0.5 truncate">
                    {value.streetAddress}
                  </p>
                )}
                {(value.city || value.district) && (
                  <p className="text-xs text-green-700 font-poppins">
                    {[value.city, value.district].filter(Boolean).join(", ")}
                  </p>
                )}
                <p className="text-xs text-green-600 font-poppins font-mono mt-1">
                  {value.coordinates.lat.toFixed(6)},{" "}
                  {value.coordinates.lng.toFixed(6)}
                </p>
              </div>
            </div>
            {!disabled && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="shrink-0 h-7 w-7 p-0 text-green-700 hover:text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Validation error */}
      {error && (
        <p className="text-xs text-red-500 font-poppins flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
