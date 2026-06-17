export type SelectedLocation = {
  streetAddress?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  country?: string;
  coordinates: { lat: number; lng: number };
};
