import type { SelectedLocation } from "@/types/location";

export function getAddressComponent(
  components: google.maps.GeocoderAddressComponent[],
  type: string,
): string {
  const component = components.find((c) => c.types.includes(type));
  return component?.long_name ?? "";
}

export function parseGeocoderResult(
  result: google.maps.GeocoderResult,
  coordinates: { lat: number; lng: number },
): SelectedLocation {
  const parts = result.address_components;
  return {
    streetAddress: result.formatted_address,
    city:
      getAddressComponent(parts, "locality") ||
      getAddressComponent(parts, "administrative_area_level_2"),
    district: getAddressComponent(parts, "administrative_area_level_2"),
    postalCode: getAddressComponent(parts, "postal_code"),
    country: getAddressComponent(parts, "country") || "Sri Lanka",
    coordinates,
  };
}
