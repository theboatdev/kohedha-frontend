export const BUSINESS_CATEGORIES = [
  { value: "cafe", label: "Cafe" },
  { value: "restaurant", label: "Restaurant" },
  { value: "hotel", label: "Hotel" },
  { value: "pub", label: "Pub" },
  { value: "bar", label: "Bar" },
] as const;

export type BusinessCategoryValue = (typeof BUSINESS_CATEGORIES)[number]["value"];
