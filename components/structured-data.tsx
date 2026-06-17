import Script from 'next/script'

interface StructuredDataProps {
  type: 'website' | 'article' | 'event' | 'organization'
  data: any
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const generateStructuredData = () => {
    switch (type) {
      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Kohedha',
          description: 'Sri Lanka\'s Restaurant & Event Discovery App',
          url: 'https://kohedha.lk',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://kohedha.lk/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        }
      
      case 'article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.title,
          description: data.excerpt,
          image: data.image,
          author: {
            '@type': 'Person',
            name: data.author
          },
          publisher: {
            '@type': 'Organization',
            name: 'Kohedha',
            logo: {
              '@type': 'ImageObject',
              url: 'https://kohedha.lk/KO.png'
            }
          },
          datePublished: data.publishedAt,
          dateModified: data.publishedAt,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://kohedha.lk/blog/${data.id}`
          }
        }
      
      case 'event':
        return {
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: data.title,
          description: data.description,
          image: data.image,
          startDate: data.eventDate,
          endDate: data.eventEndDate,
          location: {
            '@type': 'Place',
            name: data.location?.name || 'Sri Lanka',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'LK'
            }
          },
          organizer: {
            '@type': 'Organization',
            name: data.organizer
          },
          offers: {
            '@type': 'Offer',
            price: data.isFree ? '0' : data.ticketPrice,
            priceCurrency: 'LKR',
            availability: 'https://schema.org/InStock'
          }
        }
      
      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Kohedha',
          description: 'Sri Lanka\'s Restaurant & Event Discovery App',
          url: 'https://kohedha.lk',
          logo: 'https://kohedha.lk/KO.png',
          sameAs: [
            'https://facebook.com/kohedha',
            'https://twitter.com/kohedha',
            'https://instagram.com/kohedha'
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            areaServed: 'LK',
            availableLanguage: 'English'
          }
        }
      
      default:
        return {}
    }
  }

  const structuredData = generateStructuredData()

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}
