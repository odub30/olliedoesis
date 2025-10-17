import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const relatedPosts = [
  {
    title: "Building a High-Performance Portfolio: The Tech Stack Decision",
    description: "Deep dive into choosing the right technologies for a blazing-fast portfolio website.",
    href: "/blog/tech-stack-decision",
    readTime: "12 min read",
  },
  {
    title: "Achieving 100/100 Lighthouse Scores: A Case Study",
    description: "Step-by-step guide to optimizing every aspect of web performance for perfect scores.",
    href: "/blog/lighthouse-optimization",
    readTime: "15 min read",
  },
  {
    title: "Designing an Accessible Portfolio: Beyond WCAG Compliance",
    description: "Creating truly inclusive web experiences that go beyond checkbox compliance.",
    href: "/blog/accessibility-guide",
    readTime: "10 min read",
  },
]

export function RelatedPosts() {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Link key={post.href} href={post.href}>
            <Card className="h-full hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-2">{post.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{post.readTime}</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
