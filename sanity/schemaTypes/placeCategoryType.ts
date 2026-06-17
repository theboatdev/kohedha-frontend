import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const placeCategoryType = defineType({
  name: 'placeCategory',
  title: 'Place Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Category Title',
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
      title: 'Category Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'icon',
      title: 'Category Icon',
      type: 'string',
      description: 'Icon name or emoji for the category',
    }),
    defineField({
      name: 'color',
      title: 'Category Color',
      type: 'string',
      description: 'Hex color code for the category',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Category',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'icon',
    },
  },
})

