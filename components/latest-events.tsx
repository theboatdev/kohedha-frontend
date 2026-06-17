'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getLatestEvents } from '@/lib/sanity-events'
import { MapPin, Clock, Heart, Share2, Star } from 'lucide-react'
import Link from 'next/link'

interface Event {
  _id: string
  id: string
  title: string
  slug: string
  description: string
  image: string
  date: string
  time: string
  location: {
    name: string
    city: string
  }
  category: string
  organizer: string
  price: string
  status: string
}

export default function LatestEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const latestEvents = await getLatestEvents()
        console.log('Latest events:', latestEvents)
        setEvents(latestEvents)
      } catch (error) {
        console.error('Error fetching latest events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="group overflow-hidden border-0 shadow-lg">
            <div className="relative h-64 bg-gray-200 animate-pulse"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse mb-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No events found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <Card key={event._id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="relative h-64 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
              style={{
                backgroundImage: `url('${event.image}')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-bebas text-2xl tracking-wide">{event.title.toUpperCase()}</h3>
              <p className="font-poppins text-sm opacity-90">{event.category} • {event.organizer}</p>
            </div>
            <div className="absolute top-4 right-4">
              <Badge className="bg-accent text-accent-foreground font-poppins">
                <Star className="h-3 w-3 mr-1" />
                {event.price}
              </Badge>
            </div>
            <div className="absolute top-4 left-4 flex gap-2">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 text-white">
                <Heart className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 text-white">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-muted-foreground font-poppins text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                {event.location?.name || 'TBD'} • {event.location?.city || 'TBD'}
              </div>
              <div className="flex items-center text-muted-foreground font-poppins text-sm">
                <Clock className="h-4 w-4 mr-1" />
                {event.date}
              </div>
            </div>
            <div className="flex gap-2 mb-3">
              <Badge variant="secondary" className="font-poppins text-xs">
                {event.category}
              </Badge>
              <Badge variant="secondary" className="font-poppins text-xs">
                {event.status}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Link href={`/events/${event.slug || event.id || '#'}`} className="flex-1">
                <Button className="w-full bg-black hover:bg-black/90 text-white font-poppins">View Details</Button>
              </Link>
              <Button variant="outline" size="sm" className="px-3 bg-transparent">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
