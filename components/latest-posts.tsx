import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getPosts } from "@/lib/sanity"

interface BlogPost {
  id: string
  title: string
  image: string
  categories?: string[]
  excerpt: string
  date: string
  readTime: string
  author: string
  publishedAt?: string | null
}

export default async function LatestPosts() {
  // Fetch the latest 3 blog posts from Sanity
  const allPosts = await getPosts()
  const latestPosts = allPosts.slice(0, 3)

  return (
    <section className="py-24 bg-white text-black">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Explore Our Blog</h2>
          <p className="text-gray-600">
            Discover insider tips, restaurant reviews, and event highlights
            across Sri Lanka.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {latestPosts.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <h3 className="text-xl font-bold mb-4">No blog posts yet</h3>
              <p className="text-gray-600 mb-6">
                Check back soon for the latest articles about Sri Lanka's food and event scene.
              </p>
            </div>
          ) : (
            latestPosts.map((post: BlogPost, index: number) => (
              <div
                key={post.id}
                className="group overflow-hidden rounded-lg border border-gray-100 bg-white hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                    {post.categories?.[0] || 'General'}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-gray-700 transition-colors">
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{post.date}</span>
                      {post.publishedAt === null && (
                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                          Draft
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/blog/${post.id}`}
                      className="flex items-center gap-1 text-sm font-medium text-black group-hover:text-gray-700 transition-colors"
                    >
                      Read More
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-12 text-center">
          <Button
            className="bg-black text-white hover:bg-gray-800"
            size="lg"
            asChild
          >
            <Link href="/blog">View All Articles</Link>
          </Button>
        </div>
      </div>
    </section>
  )
} 