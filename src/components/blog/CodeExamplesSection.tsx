// src/components/blog/CodeExamplesSection.tsx
import { ExternalLink, Github } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CodeExample {
  id: string;
  title: string;
  url: string;
  type: string;
}

interface CodeExamplesSectionProps {
  examples: CodeExample[];
}

export function CodeExamplesSection({ examples }: CodeExamplesSectionProps) {
  if (!examples || examples.length === 0) return null;

  const getIcon = (type: string) => {
    if (type === "github") return <Github className="h-5 w-5" />;
    return <ExternalLink className="h-5 w-5" />;
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "stackblitz":
        return "StackBlitz";
      case "codesandbox":
        return "CodeSandbox";
      case "github":
        return "GitHub";
      default:
        return "Demo";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "stackblitz":
        return "from-blue-500 to-blue-600";
      case "codesandbox":
        return "from-yellow-500 to-yellow-600";
      case "github":
        return "from-gray-700 to-gray-900";
      default:
        return "from-accent-500 to-accent-600";
    }
  };

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Code Examples & Demos</h2>
      <p className="text-lg leading-relaxed text-muted-foreground mb-6">
        Interactive examples and live demos to help you understand and implement the concepts.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {examples.map((example) => (
          <Card key={example.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{example.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {getTypeLabel(example.type)}
                  </CardDescription>
                </div>
                <div className={`p-2 bg-gradient-to-br ${getTypeColor(example.type)} rounded-lg text-white`}>
                  {getIcon(example.type)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <a
                href={example.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-medium group"
              >
                <span>Open {getTypeLabel(example.type)}</span>
                <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
