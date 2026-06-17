import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const organizerType = defineType({
  name: 'organizer',
  title: 'Organizer',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'email',
      type: 'string',
      title: 'Contact Email',
    }),
    defineField({
      name: 'phone',
      type: 'string',
      title: 'Contact Phone',
    }),
    defineField({
      name: 'website',
      type: 'url',
      title: 'Website',
    }),
    defineField({
      name: 'socialMedia',
      type: 'object',
      title: 'Social Media',
      fields: [
        defineField({
          name: 'facebook',
          type: 'url',
          title: 'Facebook',
        }),
        defineField({
          name: 'instagram',
          type: 'url',
          title: 'Instagram',
        }),
        defineField({
          name: 'twitter',
          type: 'url',
          title: 'Twitter',
        }),
      ]
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
}) 