import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const relatedPosts = [
  {
    title: "Building a High-Performance Portfolio: The Tech Stack Decision",
    description: "Deep dive into choosing the right technologies for optimal performance and developer experience.",
    image: "/modern-tech-stack-architecture-diagram.jpg",
    readTime: "12 min",
    category: "Architecture",
    slug: "/blog/tech-stack-decision",
  },
  {
    title: "Optimizing Images for the Web: Formats, Compression, and Responsive Loading",
    description: "Complete guide to image optimization techniques including WebP, AVIF, and responsive images.",
    image: "/image-optimization-comparison.jpg",
    readTime: "10 min",
    category: "Performance",
    slug: "/blog/image-optimization",
  },
  {
    title: "Implementing Smooth Page Transitions Without Sacrificing Performance",
    description: "How to add delightful animations and transitions while maintaining perfect Lighthouse scores.",
    image: "/smooth-page-transitions-animation.jpg",
    readTime: "8 min",
    category: "UX",
    slug: "/blog/page-transitions",
  },
]

export function RelatedPosts() {
  return (
    <section id="related-posts" className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-3">Continue Learning</h2>
        <p className="text-lg text-muted-foreground">
          Explore related articles to deepen your understanding of web performance optimization.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Card key={post.slug} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="aspect-video relative overflow-hidden bg-muted">
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded">{post.category}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">{post.title}</CardTitle>
              <CardDescription className="line-clamp-2">{post.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={post.slug}>
                <Button variant="ghost" className="w-full group/btn">
                  Read Article
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Newsletter CTA */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Want more performance tips?</h3>
          <p className="text-muted-foreground mb-6">
            Subscribe to get weekly insights on web performance, optimization strategies, and development best
            practices.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border bg-background"
            />
            <Button className="sm:w-auto">
              Subscribe
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
