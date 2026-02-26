import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeMathjax from "rehype-mathjax";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  onCitationClick?: (id: string) => void;
  className?: string;
}

// Helper to turn [1234.5678] into links
function transformContent(content: string): string {
  // Regex for [arXiv_ID] or [number]
  // Matches [2309.00071]
  return content.replace(/\[(\d+\.\d+)\]/g, (match, id) => {
    // We can use a custom protocol or class
    // Markdown link: [2309.00071](citation:2309.00071)
    return `[${match}](citation:${id})`;
  });
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, onCitationClick, className }) => {
  const transformedContent = transformContent(content);

  return (
    <div className={cn("prose max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-code:text-primary prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border prose-th:text-foreground prose-td:text-foreground", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeMathjax, rehypeRaw]}
        components={{
          a: ({ node, href, children, ...props }) => {
            if (href?.startsWith('citation:')) {
              const id = href.replace('citation:', '');
              return (
                <span 
                  className="text-primary cursor-pointer hover:underline font-mono bg-primary/10 px-1 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    onCitationClick?.(id);
                  }}
                  title={`Scroll to paper ${id}`}
                >
                  [{id}]
                </span>
              );
            }
            return (
              <a href={href} {...props} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
        }}
      >
        {transformedContent}
      </ReactMarkdown>
    </div>
  );
};
