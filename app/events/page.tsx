import { getEvents } from "@/lib/sanity-events"
import EventsPageClient from "./events-client"

export interface SanityEvent {
  id: string
  title: string
  description: string
  image: string
  date: string
  time: string
  location: {
    name: string
    address: string
    city: string
  }
  category: string
  organizer: string
  price: string
  status: string
}

export default async function EventsPage() {
  const events: SanityEvent[] = await getEvents()
  return <EventsPageClient events={events} />
}
