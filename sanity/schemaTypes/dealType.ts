import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const dealType = defineType({
  name: 'deal',
  title: 'Deal',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Deal Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'The name/title of the deal or offer'
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: 'Auto-generated URL-friendly identifier'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
      description: 'Detailed description of the deal'
    }),
    defineField({
      name: 'redirectLink',
      title: 'Redirect Link',
      type: 'url',
      description: 'Link to the actual deal site where users can redeem the offer'
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'googleMapsLocation',
      description: 'Enhanced location information with Google Maps integration for accurate coordinates and address parsing'
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5),
      description: 'Deal rating from 1-5 stars'
    }),

    defineField({
      name: 'category',
      title: 'Deal Category',
      type: 'reference',
      to: {type: 'dealCategory'},
      validation: (Rule) => Rule.required(),
      description: 'Category classification for the deal'
    }),
    defineField({
      name: 'couponsOffers',
      title: 'Coupons & Offers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'code',
              title: 'Coupon Code',
              type: 'string',
              description: 'The actual coupon code (e.g., SAVE20)'
            }),
            defineField({
              name: 'discount',
              title: 'Discount Amount',
              type: 'string',
              description: 'Discount description (e.g., 20% off, LKR 500 off)'
            }),
            defineField({
              name: 'minimumSpend',
              title: 'Minimum Spend',
              type: 'number',
              description: 'Minimum amount required to use this offer'
            }),
            defineField({
              name: 'maxDiscount',
              title: 'Maximum Discount',
              type: 'number',
              description: 'Maximum discount amount that can be applied'
            }),
            defineField({
              name: 'usageLimit',
              title: 'Usage Limit',
              type: 'number',
              description: 'How many times this coupon can be used'
            }),
          ],
        },
      ],
      description: 'Available coupons and special offers'
    }),
    defineField({
      name: 'couponValidityInfo',
      title: 'Coupon Validity Information',
      type: 'object',
      fields: [
        defineField({
          name: 'startDate',
          title: 'Valid From',
          type: 'datetime',
          description: 'When the coupon becomes valid'
        }),
        defineField({
          name: 'endDate',
          title: 'Valid Until',
          type: 'datetime',
          description: 'When the coupon expires'
        }),
        defineField({
          name: 'isActive',
          title: 'Currently Active',
          type: 'boolean',
          initialValue: true,
          description: 'Whether the coupon is currently active'
        }),
        defineField({
          name: 'validDays',
          title: 'Valid Days',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            list: [
              {title: 'Monday', value: 'monday'},
              {title: 'Tuesday', value: 'tuesday'},
              {title: 'Wednesday', value: 'wednesday'},
              {title: 'Thursday', value: 'thursday'},
              {title: 'Friday', value: 'friday'},
              {title: 'Saturday', value: 'saturday'},
              {title: 'Sunday', value: 'sunday'},
            ],
          },
          description: 'Days of the week when the coupon is valid'
        }),
        defineField({
          name: 'validHours',
          title: 'Valid Hours',
          type: 'object',
          fields: [
            defineField({
              name: 'start',
              title: 'Start Time',
              type: 'string',
              description: 'Start time in 24-hour format (e.g., 09:00)'
            }),
            defineField({
              name: 'end',
              title: 'End Time',
              type: 'string',
              description: 'End time in 24-hour format (e.g., 18:00)'
            }),
          ],
          description: 'Time window when the coupon is valid'
        }),
      ],
    }),
    defineField({
      name: 'planValidityInfo',
      title: 'Plan Validity Information',
      type: 'object',
      fields: [
        defineField({
          name: 'planType',
          title: 'Plan Type',
          type: 'string',
          options: {
            list: [
              {title: 'One-time Use', value: 'one-time'},
              {title: 'Daily', value: 'daily'},
              {title: 'Weekly', value: 'weekly'},
              {title: 'Monthly', value: 'monthly'},
              {title: 'Yearly', value: 'yearly'},
              {title: 'Lifetime', value: 'lifetime'},
            ],
          },
          description: 'How long the deal plan is valid'
        }),
        defineField({
          name: 'validityPeriod',
          title: 'Validity Period',
          type: 'number',
          description: 'Number of days/months/years the plan is valid'
        }),
        defineField({
          name: 'renewable',
          title: 'Auto-renewable',
          type: 'boolean',
          initialValue: false,
          description: 'Whether the plan automatically renews'
        }),
        defineField({
          name: 'gracePeriod',
          title: 'Grace Period (Days)',
          type: 'number',
          description: 'Additional days after expiry when the plan can still be used'
        }),
      ],
    }),
    defineField({
      name: 'notes',
      title: 'Notes & Additional Information',
      type: 'blockContent',
      description: 'Additional details, terms, conditions, or special notes'
    }),
    defineField({
      name: 'images',
      title: 'Images & Media',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
              description: 'Description of the image for accessibility'
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional caption for the image'
            }),
          ],
        },
      ],
      description: 'Images and media related to the deal'
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
      description: 'Primary image for the deal (displayed in listings)'
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        defineField({
          name: 'facebook',
          title: 'Facebook',
          type: 'url',
          description: 'Facebook page or post URL'
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
          description: 'Instagram post or story URL'
        }),
        defineField({
          name: 'twitter',
          title: 'Twitter/X',
          type: 'url',
          description: 'Twitter/X post URL'
        }),
        defineField({
          name: 'website',
          title: 'Website',
          type: 'url',
          description: 'Official website URL'
        }),
      ],
      description: 'Social media and website links'
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        defineField({
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
          description: 'Contact phone number'
        }),
        defineField({
          name: 'email',
          title: 'Email Address',
          type: 'email',
          description: 'Contact email address'
        }),
        defineField({
          name: 'whatsapp',
          title: 'WhatsApp',
          type: 'string',
          description: 'WhatsApp number (with country code)'
        }),
        defineField({
          name: 'viber',
          title: 'Viber',
          type: 'string',
          description: 'Viber number (with country code)'
        }),
      ],
      description: 'Contact information for the deal'
    }),
    defineField({
      name: 'status',
      title: 'Deal Status',
      type: 'string',
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'Expired', value: 'expired'},
          {title: 'Coming Soon', value: 'coming-soon'},
          {title: 'Paused', value: 'paused'},
          {title: 'Sold Out', value: 'sold-out'},
        ],
      },
      initialValue: 'active',
      validation: (Rule) => Rule.required(),
      description: 'Current status of the deal'
    }),
    defineField({
      name: 'featured',
      title: 'Featured Deal',
      type: 'boolean',
      initialValue: false,
      description: 'Whether this deal should be featured prominently'
    }),
    defineField({
      name: 'priority',
      title: 'Priority Level',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(10),
      initialValue: 5,
      description: 'Priority for display order (1=highest, 10=lowest)'
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      description: 'Tags for easy categorization and search'
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: 'When the deal was published'
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      description: 'When the deal was last modified'
    }),
  ],
  preview: {
    select: {
      title: 'name',
      category: 'category.title',
      status: 'status',
      location: 'location.city',
      media: 'mainImage',
    },
    prepare(selection) {
      const {title, category, status, location} = selection
      const locationText = location ? `in ${location}` : ''
      return {
        ...selection,
        subtitle: category && status ? `${category} • ${status}${locationText ? ` • ${locationText}` : ''}` : status || category || locationText,
      }
    },
  },
  orderings: [
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
    {
      title: 'Name Z-A',
      name: 'nameDesc',
      by: [{field: 'name', direction: 'desc'}],
    },
    {
      title: 'Newest First',
      name: 'newestFirst',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Oldest First',
      name: 'oldestFirst',
      by: [{field: 'publishedAt', direction: 'asc'}],
    },
    {
      title: 'Priority High to Low',
      name: 'priorityHighToLow',
      by: [{field: 'priority', direction: 'asc'}],
    },
    {
      title: 'Rating High to Low',
      name: 'ratingHighToLow',
      by: [{field: 'rating', direction: 'desc'}],
    },
  ],
})
