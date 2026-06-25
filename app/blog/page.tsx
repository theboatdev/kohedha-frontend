import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, Clock, User } from "lucide-react"
import { getPosts } from "@/lib/sanity"
import { C } from "@/lib/brand-theme"

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

export default async function BlogPage() {
  const blogPosts = await getPosts()

  return (
    <div className="font-dm-sans" style={{ background: C.bg, color: C.text, minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ background: C.dark, color: "white", padding: "80px 48px 72px", textAlign: "center" }}>
        <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, marginBottom: "16px" }}>
          Stories & Guides
        </p>
        <h1 className="font-display" style={{ fontSize: "clamp(36px,5vw,60px)", letterSpacing: "-0.02em", marginBottom: "20px", lineHeight: 1.15 }}>
          Kohedha Blog
        </h1>
        <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.65)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
          Insights, tips, and stories from Sri Lanka's vibrant food and event scene.
        </p>
      </section>

      {/* Posts */}
      <section style={{ padding: "72px 48px", maxWidth: "1200px", margin: "0 auto" }}>
        {blogPosts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <h2 className="font-display" style={{ fontSize: "28px", color: C.text, marginBottom: "14px" }}>No posts yet</h2>
            <p style={{ color: C.muted, marginBottom: "28px" }}>Check back soon for the latest articles.</p>
            <Link href="/studio" style={{ background: C.accent, color: C.text, padding: "12px 28px", borderRadius: "40px", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
            {blogPosts.map((post: BlogPost) => (
              <div key={post.id} className="group" style={{ background: C.cream, borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(13,13,13,0.08)" }}>
                <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div style={{ position: "absolute", top: "14px", left: "14px", background: C.dark, color: "white", borderRadius: "40px", padding: "4px 12px", fontSize: "11px", fontWeight: 500 }}>
                    {post.categories?.[0] || "General"}
                  </div>
                  {post.publishedAt === null && (
                    <div style={{ position: "absolute", top: "14px", right: "14px", background: "#B45309", color: "white", borderRadius: "40px", padding: "4px 12px", fontSize: "11px", fontWeight: 500 }}>
                      Draft
                    </div>
                  )}
                </div>
                <div style={{ padding: "20px 22px 22px" }}>
                  <h2 className="font-display" style={{ fontSize: "20px", color: C.text, marginBottom: "10px", lineHeight: 1.25 }}>
                    {post.title}
                  </h2>
                  <p style={{ fontSize: "13px", color: C.muted, lineHeight: 1.65, marginBottom: "16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {post.excerpt}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "12px", color: C.muted, marginBottom: "18px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={11} />{post.date}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={11} />{post.readTime}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <User size={11} />{post.author || "Anonymous"}
                    </span>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(13,13,13,0.08)", paddingTop: "14px", display: "flex", justifyContent: "flex-end" }}>
                    <Link href={`/blog/${post.id}`} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: 600, color: C.accent, textDecoration: "none" }}>
                      Read Article <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section style={{ background: C.dark, color: "white", padding: "80px 48px" }}>
        <div style={{ maxWidth: "540px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, marginBottom: "16px" }}>
            Stay in the loop
          </p>
          <h2 className="font-display" style={{ fontSize: "36px", letterSpacing: "-0.02em", marginBottom: "16px" }}>
            Stay Updated
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "32px", lineHeight: 1.7 }}>
            Subscribe to receive the latest posts and updates about Sri Lanka's food and event scene.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{ flex: 1, minWidth: "200px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "40px", padding: "12px 20px", color: "white", fontSize: "14px", outline: "none" }}
            />
            <button style={{ background: C.accent, color: C.text, border: "none", borderRadius: "40px", padding: "12px 24px", fontSize: "14px", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
