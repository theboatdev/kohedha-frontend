import {CalendarIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        })
      ]
    }),
    defineField({
      name: 'eventDate',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventEndDate',
      type: 'datetime',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'googleMapsLocation',
      description: 'Enhanced location information with Google Maps integration for accurate coordinates and address parsing'
    }),
    defineField({
      name: 'category',
      type: 'reference',
      to: {type: 'eventCategory'},
    }),
    defineField({
      name: 'organizer',
      type: 'reference',
      to: {type: 'organizer'},
    }),
    defineField({
      name: 'ticketPrice',
      type: 'number',
      title: 'Ticket Price (LKR)',
    }),
    defineField({
      name: 'isFree',
      type: 'boolean',
      title: 'Free Event',
      initialValue: false,
    }),
    defineField({
      name: 'capacity',
      type: 'number',
      title: 'Event Capacity',
    }),
    defineField({
      name: 'status',
      type: 'string',
      options: {
        list: [
          {title: 'Upcoming', value: 'upcoming'},
          {title: 'Ongoing', value: 'ongoing'},
          {title: 'Completed', value: 'completed'},
          {title: 'Cancelled', value: 'cancelled'},
        ],
      },
      initialValue: 'upcoming',
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      title: 'Featured Event',
      initialValue: false,
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
      title: 'Event Details',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      eventDate: 'eventDate',
      location: 'location.name',
      city: 'location.city',
      media: 'mainImage',
    },
    prepare(selection) {
      const {title, eventDate, location, city} = selection
      const locationText = location && city ? `${location}, ${city}` : location || city || 'Location TBD'
      return {
        ...selection,
        subtitle: eventDate ? `${new Date(eventDate).toLocaleDateString()} at ${locationText}` : locationText,
      }
    },
  },
}) 