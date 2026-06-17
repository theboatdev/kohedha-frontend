import { defineField, defineType } from 'sanity'
import { PinIcon } from '@sanity/icons'

export const googleMapsLocationType = defineType({
  name: 'googleMapsLocation',
  title: 'Location with Google Maps',
  type: 'object',
  icon: PinIcon,
  description: 'Enhanced location field with Google Maps integration for accurate coordinates and address parsing',
  fields: [
    defineField({
      name: 'name',
      title: 'Venue/Business Name',
      type: 'string',
      description: 'Name of the venue, restaurant, or business'
    }),
    defineField({
      name: 'address',
      title: 'Street Address',
      type: 'string',
      description: 'Full street address'
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'City where the location is'
    }),
    defineField({
      name: 'district',
      title: 'District',
      type: 'string',
      description: 'District or area within the city'
    }),
    defineField({
      name: 'postalCode',
      title: 'Postal Code',
      type: 'string',
      description: 'Postal/ZIP code'
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      initialValue: 'Sri Lanka',
      description: 'Country where the location is'
    }),
    defineField({
      name: 'coordinates',
      title: 'GPS Coordinates',
      type: 'object',
      fields: [
        defineField({
          name: 'lat',
          title: 'Latitude',
          type: 'number',
          description: 'Latitude coordinate for mapping (automatically filled from map or search)'
        }),
        defineField({
          name: 'lng',
          title: 'Longitude',
          type: 'number',
          description: 'Longitude coordinate for mapping (automatically filled from map or search)'
        }),
      ],
      description: 'GPS coordinates for map integration'
    }),
    defineField({
      name: 'mapData',
      title: 'Map Integration Data',
      type: 'object',
      fields: [
        defineField({
          name: 'placeId',
          title: 'Google Place ID',
          type: 'string',
          description: 'Unique Google Places identifier for the location'
        }),
        defineField({
          name: 'formattedAddress',
          title: 'Formatted Address',
          type: 'string',
          description: 'Google-formatted address string'
        }),
        defineField({
          name: 'lastUpdated',
          title: 'Last Updated',
          type: 'datetime',
          description: 'When the location data was last updated from Google Maps'
        })
      ],
      description: 'Additional data from Google Maps integration'
    })
  ],
  preview: {
    select: {
      name: 'name',
      city: 'city',
      country: 'country',
      coordinates: 'coordinates'
    },
    prepare(selection) {
      const { name, city, country, coordinates } = selection
      const hasCoordinates = coordinates && coordinates.lat && coordinates.lng
      const coordText = hasCoordinates ? '📍' : '❌'
      
      return {
        title: name || 'Unnamed Location',
        subtitle: `${coordText} ${city && country ? `${city}, ${country}` : city || country || 'Location TBD'}`
      }
    },
  },
})
