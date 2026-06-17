import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Clock, Facebook, Instagram, Twitter, User } from "lucide-react"
import { getPost, getRelatedPosts } from "@/lib/sanity"
import { PortableText } from "@portabletext/react"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import StructuredData from "@/components/structured-data"

const C = {
  bg: "#E8E4DA", bg2: "#DDD9CE", text: "#2A2620",
  muted: "#7A7368", accent: "#C4724A", accent2: "#B85E38",
  cream: "#F2EEE6", dark: "#1E1B17",
}

interface BlogPostPageProps {
  params: { slug: string }
}

interface RelatedPost {
  id: string
  title: string
  image: string
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug)

  if (!post) {
    return { title: "Post Not Found", description: "The requested blog post could not be found." }
  }

  return {
    title: post.title,
    description: post.excerpt || `Read ${post.title} by ${post.author} on Kohedha. Discover the best of Sri Lanka's food and culture.`,
    keywords: [post.category, "Sri Lanka", "restaurants", "food", "culture", "travel", "blog", ...(post.categories || [])],
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read ${post.title} by ${post.author} on Kohedha.`,
      type: "article",
      url: `https://kohedha.lk/blog/${post.id}`,
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
      authors: [post.author],
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      section: post.category,
      tags: post.categories || [post.category],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || `Read ${post.title} by ${post.author} on Kohedha.`,
      images: [post.image],
      creator: "@kohedha",
    },
    alternates: { canonical: `/blog/${post.id}` },
    other: {
      "article:published_time": post.publishedAt,
      "article:modified_time": post.publishedAt,
      "article:author": post.author,
      "article:section": post.category,
      "article:tag": (post.categories || [post.category]).join(", "),
    },
  }
}

export default async function BlogPost({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(params.slug)

  return (
    <div className="font-dm-sans" style={{ background: C.bg, color: C.text, minHeight: "100vh" }}>
      <StructuredData type="article" data={post} />

      {/* Breadcrumb */}
      <div style={{ background: C.bg2, borderBottom: "1px solid rgba(42,38,32,0.08)", padding: "14px 48px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: C.muted, textDecoration: "none", fontWeight: 500 }}>
            <ArrowLeft size={14} />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div style={{ position: "relative", height: "clamp(260px,42vh,460px)", overflow: "hidden" }}>
        <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.65))" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", padding: "40px 48px" }}>
          <div style={{ maxWidth: "720px" }}>
            <div style={{ background: C.accent, color: "white", borderRadius: "40px", padding: "5px 14px", fontSize: "12px", fontWeight: 500, display: "inline-block", marginBottom: "14px" }}>
              {post.category}
            </div>
            <h1 className="font-dm-serif" style={{ color: "white", fontSize: "clamp(26px,4vw,44px)", lineHeight: 1.2, marginBottom: "16px" }}>
              {post.title}
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Calendar size={12} />{post.date}</span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Clock size={12} />{post.readTime}</span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><User size={12} />{post.author}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "56px 48px" }}>

        {/* Author bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", paddingBottom: "28px", borderBottom: "1px solid rgba(42,38,32,0.1)", marginBottom: "36px" }}>
          <Image
            src={post.authorImage || "/placeholder.svg"}
            alt={post.author}
            width={52}
            height={52}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, color: C.text }}>{post.author}</p>
            <p style={{ fontSize: "13px", color: C.muted }}>Food & Travel Writer</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {[Facebook, Twitter, Instagram].map((Icon, i) => (
              <div key={i} style={{ width: "32px", height: "32px", border: "1px solid rgba(42,38,32,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Icon size={13} style={{ color: C.muted }} />
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <article className="prose prose-lg max-w-none prose-headings:font-dm-serif prose-a:text-[#C4724A]">
          {post.body && <PortableText value={post.body} />}
        </article>

        {/* App CTA */}
        <div style={{ margin: "56px 0", background: C.dark, borderRadius: "20px", padding: "36px", color: "white", display: "flex", gap: "28px", alignItems: "center" }}>
          <div style={{ position: "relative", width: "100px", height: "180px", borderRadius: "16px", overflow: "hidden", flexShrink: 0, border: "2px solid rgba(255,255,255,0.1)" }}>
            <Image src="/placeholder.svg?height=800&width=450" alt="Kohedha App" fill className="object-cover" />
          </div>
          <div>
            <h3 className="font-dm-serif" style={{ fontSize: "24px", marginBottom: "10px" }}>Discover More with Kohedha</h3>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "20px" }}>
              Find the best restaurants and events in Sri Lanka with our mobile app.
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button style={{ background: "white", color: C.dark, border: "none", borderRadius: "40px", padding: "10px 22px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                Download Now
              </button>
              <button style={{ background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "40px", padding: "10px 22px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h2 className="font-dm-serif" style={{ fontSize: "28px", color: C.text, marginBottom: "24px" }}>Related Articles</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {relatedPosts.map((relatedPost: RelatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.id}`}
                  className="group"
                  style={{ background: C.cream, borderRadius: "16px", overflow: "hidden", textDecoration: "none", border: "1px solid rgba(42,38,32,0.08)" }}
                >
                  <div style={{ position: "relative", height: "160px", overflow: "hidden" }}>
                    <Image
                      src={relatedPost.image || "/placeholder.svg"}
                      alt={relatedPost.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div style={{ padding: "16px 18px" }}>
                    <h3 className="font-dm-serif" style={{ fontSize: "16px", color: C.text, lineHeight: 1.3 }}>{relatedPost.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
