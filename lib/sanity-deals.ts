import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'
import { groq } from 'next-sanity'

// GROQ query to get all deals with their related data
export const dealsQuery = groq`
  *[_type == "deal" && status != "expired"] | order(priority asc, publishedAt desc) {
    _id,
    name,
    slug,
    description,
    redirectLink,
    rating,
    address,
    "category": category->title,
    "categoryColor": category->color,
    couponsOffers,
    couponValidityInfo,
    planValidityInfo,
    mainImage {
      asset->,
      alt
    },
    images[] {
      asset->,
      alt,
      caption
    },
    socialLinks,
    contactInfo,
    status,
    featured,
    priority,
    tags,
    publishedAt,
    updatedAt
  }
`

// GROQ query to get a single deal by slug
export const dealQuery = groq`
  *[_type == "deal" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    redirectLink,
    rating,
    address,
    "category": category->title,
    "categoryColor": category->color,
    couponsOffers,
    couponValidityInfo,
    planValidityInfo,
    notes,
    mainImage {
      asset->,
      alt
    },
    images[] {
      asset->,
      alt,
      caption
    },
    socialLinks,
    contactInfo,
    status,
    featured,
    priority,
    tags,
    publishedAt,
    updatedAt
  }
`

// GROQ query to get featured deals
export const featuredDealsQuery = groq`
  *[_type == "deal" && featured == true && status == "active"] | order(priority asc, publishedAt desc)[0...6] {
    _id,
    name,
    slug,
    description,
    redirectLink,
    mainImage {
      asset->,
      alt
    },
    "category": category->title,
    couponsOffers[0],
    status
  }
`

// GROQ query to get deals by category
export const dealsByCategoryQuery = groq`
  *[_type == "deal" && category->title == $category && status == "active"] | order(priority asc, publishedAt desc) {
    _id,
    name,
    slug,
    description,
    redirectLink,
    mainImage {
      asset->,
      alt
    },
    address,
    couponsOffers[0],
    status
  }
`

// Function to get all deals
export async function getDeals() {
  const deals = await client.fetch(dealsQuery)
  return deals.map((deal: any) => ({
    ...deal,
    image: getImageUrl(deal.mainImage),
    images: deal.images?.map((img: any) => ({
      ...img,
      url: getImageUrl(img),
    })).filter((img: any) => img.url !== '/placeholder.svg') || [],
    formattedAddress: formatAddress(deal.address),
    id: deal.slug?.current || deal._id,
    validCoupons: getValidCoupons(deal.couponsOffers, deal.couponValidityInfo),
    isActive: deal.status === 'active' && isCouponActive(deal.couponValidityInfo),
  }))
}

// Function to get a single deal
export async function getDeal(slug: string) {
  const deal = await client.fetch(dealQuery, { slug })
  if (!deal) return null
  
  return {
    ...deal,
    image: getImageUrl(deal.mainImage),
    images: deal.images?.map((img: any) => ({
      ...img,
      url: getImageUrl(img),
    })).filter((img: any) => img.url !== '/placeholder.svg') || [],
    formattedAddress: formatAddress(deal.address),
    id: deal.slug?.current || deal._id,
    validCoupons: getValidCoupons(deal.couponsOffers, deal.couponValidityInfo),
    isActive: deal.status === 'active' && isCouponActive(deal.couponValidityInfo),
    publishedDate: deal.publishedAt ? new Date(deal.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : null,
  }
}

// Function to get featured deals
export async function getFeaturedDeals() {
  const deals = await client.fetch(featuredDealsQuery)
  return deals.map((deal: any) => ({
    ...deal,
    image: getImageUrl(deal.mainImage),
    id: deal.slug?.current || deal._id,
    primaryCoupon: deal.couponsOffers?.[0] || null,
  }))
}

// Function to get deals by category
export async function getDealsByCategory(category: string) {
  const deals = await client.fetch(dealsByCategoryQuery, { category })
  return deals.map((deal: any) => ({
    ...deal,
    image: getImageUrl(deal.mainImage),
    formattedAddress: formatAddress(deal.address),
    id: deal.slug?.current || deal._id,
    primaryCoupon: deal.couponsOffers?.[0] || null,
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

// Helper function to format address
function formatAddress(address: any) {
  if (!address) return ''
  
  const parts = [
    address.street,
    address.city,
    address.district,
    address.country
  ].filter(Boolean)
  
  return parts.join(', ')
}

// Helper function to get valid coupons
function getValidCoupons(coupons: any[], validityInfo: any) {
  if (!coupons || !Array.isArray(coupons)) return []
  
  const now = new Date()
  const currentDay = now.toLocaleDateString('en', { weekday: 'long' }).toLowerCase() // monday, tuesday, etc.
  const currentHour = now.getHours()
  
  return coupons.filter(coupon => {
    if (!validityInfo) return true
    
    // Check date range
    if (validityInfo.startDate && new Date(validityInfo.startDate) > now) return false
    if (validityInfo.endDate && new Date(validityInfo.endDate) < now) return false
    
    // Check valid days
    if (validityInfo.validDays && validityInfo.validDays.length > 0) {
      if (!validityInfo.validDays.includes(currentDay)) return false
    }
    
    // Check valid hours
    if (validityInfo.validHours && validityInfo.validHours.start && validityInfo.validHours.end) {
      const startHour = parseInt(validityInfo.validHours.start.split(':')[0])
      const endHour = parseInt(validityInfo.validHours.end.split(':')[0])
      if (currentHour < startHour || currentHour > endHour) return false
    }
    
    return validityInfo.isActive !== false
  })
}

// Helper function to check if coupon is currently active
function isCouponActive(validityInfo: any) {
  if (!validityInfo) return true
  
  const now = new Date()
  
  // Check date range
  if (validityInfo.startDate && new Date(validityInfo.startDate) > now) return false
  if (validityInfo.endDate && new Date(validityInfo.endDate) < now) return false
  
  return validityInfo.isActive !== false
}
