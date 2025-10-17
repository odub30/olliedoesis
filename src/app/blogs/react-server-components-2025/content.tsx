// app/blogs/react-server-components-2025/content.tsx
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import fs from 'fs'
import path from 'path'

// Configure marked options for better rendering
marked.setOptions({
  gfm: true,
  breaks: true,
})

export function RSCContent() {
  // Read from the SAME folder as this component
  const markdownPath = path.join(
    process.cwd(),
    'src/app/blogs/react-server-components-2025/react-server-components-2025.md'
  )
  const markdownContent = fs.readFileSync(markdownPath, 'utf-8')
  
  // Convert markdown to HTML
  const rawHtml = marked(markdownContent) as string
  
  // Sanitize the HTML to prevent XSS attacks
  const contentHtml = DOMPurify.sanitize(rawHtml)

  return (
    <article 
      className="prose prose-lg max-w-none
        prose-headings:font-bold prose-headings:text-foreground
        prose-h1:text-4xl prose-h1:mb-4
        prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
        prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
        prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground prose-strong:font-semibold
        prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:before:content-[''] prose-code:after:content-['']
        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
        prose-ul:text-muted-foreground prose-ul:my-4
        prose-ol:text-muted-foreground prose-ol:my-4
        prose-li:my-2
        prose-img:rounded-xl prose-img:shadow-lg
        prose-table:text-sm prose-table:my-8
        prose-th:bg-gray-100 prose-th:font-semibold prose-th:p-3
        prose-td:border-gray-200 prose-td:p-3
        prose-hr:my-8 prose-hr:border-gray-300
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic
        prose-details:my-4 prose-details:border prose-details:border-gray-200 prose-details:rounded-lg prose-details:p-4"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  )
}