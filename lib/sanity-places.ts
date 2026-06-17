import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'
import { groq } from 'next-sanity'

// GROQ query to get all places with their related data
export const placesQuery = groq`
  *[_type == "place" && status != "closed"] | order(priority asc, publishedAt desc) {
    _id,
    name,
    slug,
    description,
    rating,
    priceRange,
    cuisine,
    vibe,
    features,
    "category": category->title,
    "categoryColor": category->color,
    location,
    openingHours,
    mainImage {
      asset->,
      alt
    },
    images[] {
      asset->,
      alt,
      caption
    },
    contactInfo,
    socialLinks,
    status,
    featured,
    priority,
    tags,
    publishedAt,
    updatedAt
  }
`

// GROQ query to get a single place by slug
export const placeQuery = groq`
  *[_type == "place" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    rating,
    priceRange,
    cuisine,
    vibe,
    features,
    "category": category->title,
    "categoryColor": category->color,
    location,
    openingHours,
    mainImage {
      asset->,
      alt
    },
    images[] {
      asset->,
      alt,
      caption
    },
    contactInfo,
    socialLinks,
    body,
    status,
    featured,
    priority,
    tags,
    publishedAt,
    updatedAt
  }
`

// GROQ query to get featured places
export const featuredPlacesQuery = groq`
  *[_type == "place" && featured == true && status == "open"] | order(priority asc, publishedAt desc)[0...6] {
    _id,
    name,
    slug,
    description,
    rating,
    priceRange,
    mainImage {
      asset->,
      alt
    },
    "category": category->title,
    location,
    status
  }
`

// GROQ query to get places by category
export const placesByCategoryQuery = groq`
  *[_type == "place" && category->title == $category && status == "open"] | order(priority asc, publishedAt desc) {
    _id,
    name,
    slug,
    description,
    rating,
    priceRange,
    mainImage {
      asset->,
      alt
    },
    location,
    status
  }
`

// Function to get all places
export async function getPlaces() {
  const places = await client.fetch(placesQuery)
  return places.map((place: any) => ({
    ...place,
    image: getImageUrl(place.mainImage),
    images: place.images?.map((img: any) => ({
      ...img,
      url: getImageUrl(img),
    })).filter((img: any) => img.url !== '/placeholder.svg') || [],
    formattedLocation: formatLocation(place.location),
    id: place.slug?.current || place._id,
    isOpen: isPlaceOpen(place.openingHours),
  }))
}

// Function to get a single place
export async function getPlace(slug: string) {
  const place = await client.fetch(placeQuery, { slug })
  if (!place) return null
  
  return {
    ...place,
    image: getImageUrl(place.mainImage),
    images: place.images?.map((img: any) => ({
      ...img,
      url: getImageUrl(img),
    })).filter((img: any) => img.url !== '/placeholder.svg') || [],
    formattedLocation: formatLocation(place.location),
    id: place.slug?.current || place._id,
    isOpen: isPlaceOpen(place.openingHours),
    publishedDate: place.publishedAt ? new Date(place.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : null,
  }
}

// Function to get featured places
export async function getFeaturedPlaces() {
  const places = await client.fetch(featuredPlacesQuery)
  return places.map((place: any) => ({
    ...place,
    image: getImageUrl(place.mainImage),
    formattedLocation: formatLocation(place.location),
    id: place.slug?.current || place._id,
  }))
}

// Function to get places by category
export async function getPlacesByCategory(category: string) {
  const places = await client.fetch(placesByCategoryQuery, { category })
  return places.map((place: any) => ({
    ...place,
    image: getImageUrl(place.mainImage),
    formattedLocation: formatLocation(place.location),
    id: place.slug?.current || place._id,
  }))
}

// Helper function to safely get image URL
function getImageUrl(imageObject: any, defaultSize = '400x600'): string {
  if (!imageObject) {
    return `/placeholder.svg?height=${defaultSize.split('x')[1]}&width=${defaultSize.split('x')[0]}`
  }
  
  // Check if the image object has the necessary properties
  if (!imageObject.asset && !imageObject._ref) {
    return `/placeholder.svg?height=${defaultSize.split('x')[1]}&width=${defaultSize.split('x')[0]}`
  }
  
  try {
    return urlForImage(imageObject).url()
  } catch (error) {
    console.warn('Failed to generate image URL:', error)
    return `/placeholder.svg?height=${defaultSize.split('x')[1]}&width=${defaultSize.split('x')[0]}`
  }
}

// Helper function to format location
function formatLocation(location: any) {
  if (!location) return ''
  
  const parts = [
    location.name,
    location.address,
    location.city,
    location.district,
  ].filter(Boolean)
  
  return parts.join(', ')
}

// Helper function to check if place is currently open
function isPlaceOpen(openingHours: any) {
  if (!openingHours) return null
  
  const now = new Date()
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const currentDay = dayNames[now.getDay()]
  const hours = openingHours[currentDay]
  
  if (!hours || hours.toLowerCase() === 'closed') return false
  
  // Simple check - if hours are specified and not "closed", assume open
  // You can enhance this to check actual time ranges
  return true
}

