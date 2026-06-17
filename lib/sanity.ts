import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'
import { groq } from 'next-sanity'

// GROQ query to get all blog posts with their related data
// Original query (only published posts):
// export const postsQuery = groq`
//   *[_type == "post" && publishedAt != null] | order(publishedAt desc) {
//     _id,
//     title,
//     slug,
//     mainImage,
//     publishedAt,
//     "author": author->name,
//     "authorImage": author->image,
//     "categories": categories[]->title,
//     "excerpt": pt::text(body[0...200]) + "..."
//   }
// `

// Modified query to show all posts (including unpublished ones) for development
export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    "author": author->name,
    "authorImage": author->image,
    "categories": categories[]->title,
    "excerpt": pt::text(body[0...200]) + "..."
  }
`

// GROQ query to get a single blog post by slug
export const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    "author": author->name,
    "authorImage": author->image,
    "categories": categories[]->title,
    body
  }
`

// GROQ query to get related posts (excluding current post)
export const relatedPostsQuery = groq`
  *[_type == "post" && slug.current != $slug && publishedAt != null] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    mainImage
  }
`

// Function to get all blog posts
export async function getPosts() {
  const posts = await client.fetch(postsQuery)
  return posts.map((post: any) => ({
    ...post,
    image: post.mainImage ? urlForImage(post.mainImage).url() : '/placeholder.svg?height=400&width=600',
    authorImage: post.authorImage ? urlForImage(post.authorImage).url() : '/placeholder.svg?height=100&width=100',
    date: post.publishedAt 
      ? new Date(post.publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'Draft', // Show "Draft" for unpublished posts
    readTime: '5 min read', // You can calculate this based on content length if needed
    id: post.slug.current
  }))
}

// Function to get a single blog post
export async function getPost(slug: string) {
  const post = await client.fetch(postQuery, { slug })
  if (!post) return null
  
  return {
    ...post,
    image: post.mainImage ? urlForImage(post.mainImage).url() : '/placeholder.svg?height=600&width=1200',
    authorImage: post.authorImage ? urlForImage(post.authorImage).url() : '/placeholder.svg?height=100&width=100',
    date: new Date(post.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    readTime: '5 min read',
    id: post.slug.current,
    category: post.categories?.[0] || 'General'
  }
}

// Function to get related posts
export async function getRelatedPosts(currentSlug: string) {
  const posts = await client.fetch(relatedPostsQuery, { slug: currentSlug })
  return posts.map((post: any) => ({
    ...post,
    image: post.mainImage ? urlForImage(post.mainImage).url() : '/placeholder.svg?height=400&width=600',
    id: post.slug.current
  }))
} 