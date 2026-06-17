import React from 'react'
import { defineField, defineType } from 'sanity'
import { LocationInput } from './LocationInput'

export const locationField = defineType({
  name: 'location',
  title: 'Location',
  type: 'object',
  components: {
    input: LocationInput
  },
  fields: [
    {
      name: 'name',
      title: 'Venue/Business Name',
      type: 'string',
      description: 'Name of the venue, restaurant, or business'
    },
    {
      name: 'address',
      title: 'Street Address',
      type: 'string',
      description: 'Full street address'
    },
    {
      name: 'city',
      title: 'City',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'City where the location is'
    },
    {
      name: 'district',
      title: 'District',
      type: 'string',
      description: 'District or area within the city'
    },
    {
      name: 'postalCode',
      title: 'Postal Code',
      type: 'string',
      description: 'Postal/ZIP code'
    },
    {
      name: 'country',
      title: 'Country',
      type: 'string',
      initialValue: 'Sri Lanka',
      description: 'Country where the location is'
    },
    {
      name: 'coordinates',
      title: 'GPS Coordinates',
      type: 'object',
      fields: [
        {
          name: 'lat',
          title: 'Latitude',
          type: 'number',
          description: 'Latitude coordinate for mapping'
        },
        {
          name: 'lng',
          title: 'Longitude',
          type: 'number',
          description: 'Longitude coordinate for mapping'
        },
      ],
      description: 'GPS coordinates for map integration'
    },
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
