import { MapPinIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const placeType = defineType({
  name: "place",
  title: "Place",
  type: "document",
  icon: MapPinIcon,
  fields: [
    defineField({
      name: "name",
      title: "Place Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "The name of the restaurant, cafe, or venue",
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: "Auto-generated URL-friendly identifier",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
      description: "Brief description of the place",
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative Text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
      description: "Primary image for the place (displayed in listings)",
    }),
    defineField({
      name: "images",
      title: "Images & Gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative Text",
              type: "string",
              description: "Description of the image for accessibility",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
              description: "Optional caption for the image",
            }),
          ],
        },
      ],
      description: "Additional images and gallery photos",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "googleMapsLocation",
      description:
        "Enhanced location information with Google Maps integration for accurate coordinates and address parsing",
    }),
    defineField({
      name: "category",
      title: "Place Category",
      type: "reference",
      to: { type: "placeCategory" },
      validation: (Rule) => Rule.required(),
      description:
        "Category classification for the place (Restaurant, Cafe, etc.)",
    }),
    defineField({
      name: "cuisine",
      title: "Cuisine Type",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Sri Lankan", value: "sri-lankan" },
          { title: "Indian", value: "indian" },
          { title: "Chinese", value: "chinese" },
          { title: "Italian", value: "italian" },
          { title: "Japanese", value: "japanese" },
          { title: "Thai", value: "thai" },
          { title: "Western", value: "western" },
          { title: "Fusion", value: "fusion" },
          { title: "Fast Food", value: "fast-food" },
          { title: "Vegetarian", value: "vegetarian" },
          { title: "Vegan", value: "vegan" },
          { title: "Seafood", value: "seafood" },
          { title: "Desserts", value: "desserts" },
          { title: "Beverages", value: "beverages" },
        ],
      },
      description: "Types of cuisine served",
    }),
    defineField({
      name: "vibe",
      title: "Vibes",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Romantic", value: "romantic" },
          { title: "Rooftop", value: "rooftop" },
          { title: "Live Music", value: "live-music" },
          { title: "Family Friendly", value: "family-friendly" },
          { title: "Trendy", value: "trendy" },
          { title: "Authentic", value: "authentic" },
          { title: "Casual", value: "casual" },
          { title: "Fine Dining", value: "fine-dining" },
          { title: "Cozy", value: "cozy" },
          { title: "Instagram Worthy", value: "instagram-worthy" },
        ],
      },
      description: "The vibe or the atmosphere of the place",
    }),

    defineField({
      name: "priceRange",
      title: "Price Range",
      type: "string",
      options: {
        list: [
          { title: "Budget (Under LKR 1,000)", value: "budget" },
          { title: "Moderate (LKR 1,000 - 3,000)", value: "moderate" },
          { title: "Expensive (LKR 3,000 - 7,000)", value: "expensive" },
          { title: "Fine Dining (Above LKR 7,000)", value: "fine-dining" },
        ],
      },
      description: "Average price range for a meal",
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule) => Rule.min(1).max(5),
      description: "Place rating from 1-5 stars",
    }),
    defineField({
      name: "openingHours",
      title: "Opening Hours",
      type: "object",
      fields: [
        defineField({
          name: "monday",
          title: "Monday",
          type: "string",
          description: "e.g., 9:00 AM - 10:00 PM or Closed",
        }),
        defineField({
          name: "tuesday",
          title: "Tuesday",
          type: "string",
        }),
        defineField({
          name: "wednesday",
          title: "Wednesday",
          type: "string",
        }),
        defineField({
          name: "thursday",
          title: "Thursday",
          type: "string",
        }),
        defineField({
          name: "friday",
          title: "Friday",
          type: "string",
        }),
        defineField({
          name: "saturday",
          title: "Saturday",
          type: "string",
        }),
        defineField({
          name: "sunday",
          title: "Sunday",
          type: "string",
        }),
      ],
      description: "Operating hours for each day of the week",
    }),
    defineField({
      name: "features",
      title: "Features & Amenities",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "WiFi", value: "wifi" },
          { title: "Parking", value: "parking" },
          { title: "Air Conditioning", value: "air-conditioning" },
          { title: "Outdoor Seating", value: "outdoor-seating" },
          { title: "Live Music", value: "live-music" },
          { title: "Rooftop", value: "rooftop" },
          { title: "Pet Friendly", value: "pet-friendly" },
          { title: "Wheelchair Accessible", value: "wheelchair-accessible" },
          { title: "Reservations", value: "reservations" },
          { title: "Takeout", value: "takeout" },
          { title: "Delivery", value: "delivery" },
          { title: "Bar", value: "bar" },
          { title: "Private Dining", value: "private-dining" },
          { title: "Kids Menu", value: "kids-menu" },
        ],
      },
      description: "Available features and amenities",
    }),
    defineField({
      name: "contactInfo",
      title: "Contact Information",
      type: "object",
      fields: [
        defineField({
          name: "phone",
          title: "Phone Number",
          type: "string",
          description: "Contact phone number",
        }),
        defineField({
          name: "email",
          title: "Email Address",
          type: "email",
          description: "Contact email address",
        }),
        defineField({
          name: "whatsapp",
          title: "WhatsApp",
          type: "string",
          description: "WhatsApp number (with country code)",
        }),
        defineField({
          name: "website",
          title: "Website",
          type: "url",
          description: "Official website URL",
        }),
      ],
      description: "Contact information for the place",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "object",
      fields: [
        defineField({
          name: "facebook",
          title: "Facebook",
          type: "url",
          description: "Facebook page URL",
        }),
        defineField({
          name: "instagram",
          title: "Instagram",
          type: "url",
          description: "Instagram profile URL",
        }),
        defineField({
          name: "twitter",
          title: "Twitter/X",
          type: "url",
          description: "Twitter/X profile URL",
        }),
      ],
      description: "Social media links",
    }),
    defineField({
      name: "body",
      title: "Detailed Description",
      type: "blockContent",
      description: "Full description and details about the place",
    }),
    defineField({
      name: "status",
      title: "Place Status",
      type: "string",
      options: {
        list: [
          { title: "Open", value: "open" },
          { title: "Closed", value: "closed" },
          { title: "Temporarily Closed", value: "temporarily-closed" },
          { title: "Coming Soon", value: "coming-soon" },
        ],
      },
      initialValue: "open",
      validation: (Rule) => Rule.required(),
      description: "Current status of the place",
    }),
    defineField({
      name: "featured",
      title: "Featured Place",
      type: "boolean",
      initialValue: false,
      description: "Whether this place should be featured prominently",
    }),
    defineField({
      name: "priority",
      title: "Priority Level",
      type: "number",
      validation: (Rule) => Rule.min(1).max(10),
      initialValue: 5,
      description: "Priority for display order (1=highest, 10=lowest)",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      description: "Tags for easy categorization and search",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      description: "When the place was published",
    }),
    defineField({
      name: "updatedAt",
      title: "Last Updated",
      type: "datetime",
      description: "When the place was last modified",
    }),
  ],
  preview: {
    select: {
      title: "name",
      category: "category.title",
      status: "status",
      location: "location.city",
      media: "mainImage",
    },
    prepare(selection) {
      const { title, category, status, location } = selection;
      const locationText = location ? `in ${location}` : "";
      return {
        ...selection,
        subtitle:
          category && status
            ? `${category} • ${status}${locationText ? ` • ${locationText}` : ""}`
            : status || category || locationText,
      };
    },
  },
  orderings: [
    {
      title: "Name A-Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
    {
      title: "Name Z-A",
      name: "nameDesc",
      by: [{ field: "name", direction: "desc" }],
    },
    {
      title: "Newest First",
      name: "newestFirst",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Oldest First",
      name: "oldestFirst",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
    {
      title: "Priority High to Low",
      name: "priorityHighToLow",
      by: [{ field: "priority", direction: "asc" }],
    },
    {
      title: "Rating High to Low",
      name: "ratingHighToLow",
      by: [{ field: "rating", direction: "desc" }],
    },
  ],
});
