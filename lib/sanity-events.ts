import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'
import { groq } from 'next-sanity'

// GROQ query to get all events with their related data
export const eventsQuery = groq`
  *[_type == "event" && status != "cancelled"] | order(eventDate asc) {
    _id,
    title,
    slug,
    description,
    mainImage,
    eventDate,
    eventEndDate,
    location,
    "category": category->title,
    "organizer": organizer->name,
    "organizerImage": organizer->image,
    ticketPrice,
    isFree,
    capacity,
    status,
    featured
  }
`

// GROQ query to get a single event by slug
export const eventQuery = groq`
  *[_type == "event" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    mainImage,
    eventDate,
    eventEndDate,
    location,
    "category": category->title,
    "organizer": organizer->name,
    "organizerImage": organizer->image,
    "organizerEmail": organizer->email,
    "organizerPhone": organizer->phone,
    "organizerWebsite": organizer->website,
    ticketPrice,
    isFree,
    capacity,
    status,
    featured,
    body
  }
`

// GROQ query to get featured events
export const featuredEventsQuery = groq`
  *[_type == "event" && featured == true && status != "cancelled"] | order(eventDate asc)[0...3] {
    _id,
    title,
    slug,
    description,
    mainImage,
    eventDate,
    location,
    "category": category->title,
    "organizer": organizer->name,
    ticketPrice,
    isFree
  }
`

// GROQ query to get latest events (ordered by creation date)
export const latestEventsQuery = groq`
  *[_type == "event" && status != "cancelled"] | order(_createdAt desc)[0...3] {
    _id,
    title,
    slug,
    description,
    mainImage,
    eventDate,
    location,
    "category": category->title,
    "organizer": organizer->name,
    ticketPrice,
    isFree,
    status
  }
`

// Function to get all events
export async function getEvents() {
  const events = await client.fetch(eventsQuery)
  return events.map((event: any) => ({
    ...event,
    image: event.mainImage ? urlForImage(event.mainImage).url() : '/placeholder.svg?height=400&width=600',
    organizerImage: event.organizerImage ? urlForImage(event.organizerImage).url() : '/placeholder.svg?height=100&width=100',
    date: new Date(event.eventDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    time: new Date(event.eventDate).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    id: event.slug.current,
    price: event.isFree ? 'Free' : `LKR ${event.ticketPrice}`
  }))
}

// Function to get a single event
export async function getEvent(slug: string) {
  const event = await client.fetch(eventQuery, { slug })
  if (!event) return null
  
  return {
    ...event,
    image: event.mainImage ? urlForImage(event.mainImage).url() : '/placeholder.svg?height=600&width=1200',
    organizerImage: event.organizerImage ? urlForImage(event.organizerImage).url() : '/placeholder.svg?height=100&width=100',
    date: new Date(event.eventDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    time: new Date(event.eventDate).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    id: event.slug.current,
    price: event.isFree ? 'Free' : `LKR ${event.ticketPrice}`
  }
}

// Function to get featured events
export async function getFeaturedEvents() {
  const events = await client.fetch(featuredEventsQuery)
  return events.map((event: any) => ({
    ...event,
    image: event.mainImage ? urlForImage(event.mainImage).url() : '/placeholder.svg?height=400&width=600',
    date: new Date(event.eventDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    time: new Date(event.eventDate).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    id: event.slug.current,
    price: event.isFree ? 'Free' : `LKR ${event.ticketPrice}`
  }))
} 

// Function to get latest events
export async function getLatestEvents() {
  const events = await client.fetch(latestEventsQuery)
  return events.map((event: any) => ({
    ...event,
    image: event.mainImage ? urlForImage(event.mainImage).url() : '/placeholder.svg?height=400&width=600',
    date: new Date(event.eventDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    time: new Date(event.eventDate).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    id: event.slug.current,
    slug: event.slug.current,
    price: event.isFree ? 'Free' : `LKR ${event.ticketPrice}`
  }))
} 