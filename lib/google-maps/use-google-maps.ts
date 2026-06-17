"use client";

import { useState, useEffect } from "react";

type UseGoogleMapsResult = {
  isLoaded: boolean;
  loadError: string | null;
};

const SCRIPT_ID = "google-maps-script";

export function useGoogleMaps(): UseGoogleMapsResult {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already loaded
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    // Script already injected (by Sanity or a previous render) — wait for it
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      const onLoad = () => setIsLoaded(true);
      const onError = () => setLoadError("Failed to load Google Maps");
      existing.addEventListener("load", onLoad);
      existing.addEventListener("error", onError);
      return () => {
        existing.removeEventListener("load", onLoad);
        existing.removeEventListener("error", onError);
      };
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setLoadError("Google Maps API key is not configured");
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setLoadError("Failed to load Google Maps");
    document.head.appendChild(script);
  }, []);

  return { isLoaded, loadError };
}
