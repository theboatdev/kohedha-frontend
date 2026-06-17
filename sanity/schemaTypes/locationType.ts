import { defineField, defineType } from 'sanity'
import { PinIcon } from '@sanity/icons'

export const locationType = defineType({
  name: 'location',
  title: 'Location',
  type: 'object',
  icon: PinIcon,
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
  ],
  preview: {
    select: {
      name: 'name',
      city: 'city',
      country: 'country'
    },
    prepare(selection) {
      const { name, city, country } = selection
      return {
        title: name || 'Unnamed Location',
        subtitle: city && country ? `${city}, ${country}` : city || country || 'Location TBD'
      }
    },
  },
})
