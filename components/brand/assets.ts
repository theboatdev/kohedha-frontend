/** Photography in /public/home and app store links, shared by the public site and /vendors. */

export type PhotoKey =
  | "rooftop"
  | "cocktail"
  | "seafood"
  | "market"
  | "fusion"
  | "feast"
  | "stall"
  | "teahouse"
  | "bakery"
  | "juice"
  | "sweets"
  | "culture"
  | "spices";

export const PHOTO_ALT: Record<PhotoKey, string> = {
  rooftop: "Candlelit rooftop restaurant overlooking the Colombo skyline at night",
  cocktail: "A busy cocktail bar with warm lighting and people at the counter",
  seafood: "Beachside seafood tables set on the sand at sunset",
  market: "A crowded street-food market at dusk with trays of curries",
  fusion: "A modern restaurant dining room with patterned tiles",
  feast: "Chefs behind a long table of Sri Lankan curries and juices",
  stall: "Two cooks smiling behind a street-food stall full of curries",
  teahouse: "A wooden tea house in the misty Kandy hills",
  bakery: "A baker holding a tray of fresh buns in a wood-fired bakery",
  juice: "A juice bar stacked with pineapples, mangoes and dragon fruit",
  sweets: "A sweet shop counter piled high with colourful desserts",
  culture: "Kandyan dancers performing at a street festival",
  spices: "A spice stall with baskets of turmeric, chilli and pepper",
};

export const APP_STORE_URL = "https://apps.apple.com/lk/app/kohedha/id6748849700";
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.theboat.kohedaapp";
