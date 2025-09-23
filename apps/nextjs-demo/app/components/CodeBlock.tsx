'use client';

import { useEffect, useState } from 'react';
import { createHighlighter, type Highlighter } from 'shiki';

interface CodeBlockProps {
  children: string;
  language?: string;
  className?: string;
}

let highlighterInstance: Highlighter | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterInstance) {
    highlighterInstance = await createHighlighter({
      themes: ['github-dark'],
      langs: ['typescript', 'javascript', 'tsx', 'jsx', 'json', 'css', 'html'],
    });
  }
  return highlighterInstance;
}

export function CodeBlock({
  children,
  language = 'tsx',
  className = '',
}: CodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function highlightCode() {
      try {
        setIsLoading(true);
        const highlighter = await getHighlighter();

        // Map common language aliases
        const langMap: Record<string, string> = {
          tsx: 'tsx',
          jsx: 'jsx',
          typescript: 'typescript',
          ts: 'typescript',
          javascript: 'javascript',
          js: 'javascript',
          json: 'json',
          css: 'css',
          html: 'html',
        };

        const mappedLang = langMap[language] || 'typescript';

        const html = highlighter.codeToHtml(children, {
          lang: mappedLang,
          theme: 'github-dark',
        });

        setHighlightedCode(html);
      } catch (error) {
        console.error('Failed to highlight code:', error);
        // Fallback to plain text with basic styling
        setHighlightedCode(
          `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"><code>${children}</code></pre>`,
        );
      } finally {
        setIsLoading(false);
      }
    }

    highlightCode();
  }, [children, language]);

  if (isLoading) {
    return (
      <pre
        className={`animate-pulse overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100 ${className}`}
      >
        <code>{children}</code>
      </pre>
    );
  }

  return (
    <div
      className={`shiki-container ${className}`}
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  );
}
