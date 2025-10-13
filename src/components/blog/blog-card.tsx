import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/lib/blogMetadata";
import { formatDate } from "@/lib/searchUtils";
import { Calendar, Clock, User } from "lucide-react";

interface BlogCardProps {
  post: BlogPost;
  showExcerpt?: boolean;
  featured?: boolean;
}

export function BlogCard({ post, showExcerpt = true, featured = false }: BlogCardProps) {
  return (
    <Link href={`/articles/${post.slug}`} className="group">
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/50">
        {featured && post.featured && (
          <div className="h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500" />
        )}

        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge variant="secondary" className="font-medium">
              {post.category}
            </Badge>
            {post.featured && (
              <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                ⭐ Featured
              </Badge>
            )}
          </div>

          <CardTitle className="text-xl md:text-2xl group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </CardTitle>

          <CardDescription className="flex flex-wrap items-center gap-4 text-sm mt-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.publishedDate)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime} min read
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author}
            </span>
          </CardDescription>
        </CardHeader>

        {showExcerpt && (
          <CardContent>
            <p className="text-muted-foreground line-clamp-3">{post.description}</p>
          </CardContent>
        )}

        <CardFooter className="flex flex-wrap gap-2">
          {post.tags.slice(0, 5).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {post.tags.length > 5 && (
            <Badge variant="outline" className="text-xs">
              +{post.tags.length - 5} more
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
