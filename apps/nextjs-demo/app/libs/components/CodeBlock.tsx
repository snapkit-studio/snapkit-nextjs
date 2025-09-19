"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  language: string;
  theme?: string;
  className?: string;
}

export function CodeBlock({ code, language, theme = "github-dark", className }: CodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const highlightCode = async () => {
      try {
        setIsLoading(true);
        const result = await codeToHtml(code, {
          lang: language,
          theme: theme,
          transformers: [
            {
              name: "remove-pre-wrapper",
              code(node) {
                // Remove the outer <pre> wrapper to control styling ourselves
                if (node.type === "element" && node.tagName === "pre" && node.children.length > 0) {
                  const codeElement = node.children[0];
                  if (codeElement && codeElement.type === "element" && codeElement.tagName === "code") {
                    return codeElement;
                  }
                }
                return node;
              },
            },
          ],
        });
        setHtml(result);
      } catch (error) {
        console.error("Failed to highlight code:", error);
        // Fallback to plain text if highlighting fails
        setHtml(`<code>${code}</code>`);
      } finally {
        setIsLoading(false);
      }
    };

    highlightCode();
  }, [code, language, theme]);

  if (isLoading) {
    return (
      <div className={`animate-pulse rounded-lg bg-gray-800 p-4 ${className}`}>
        <div className="mb-2 h-4 w-3/4 rounded bg-gray-700"></div>
        <div className="mb-2 h-4 w-1/2 rounded bg-gray-700"></div>
        <div className="h-4 w-2/3 rounded bg-gray-700"></div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-x-auto rounded-lg border bg-gray-900 ${className}`}>
      <pre className="p-4 text-sm leading-relaxed">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
