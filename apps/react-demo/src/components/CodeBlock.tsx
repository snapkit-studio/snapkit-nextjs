'use client';

import { useEffect, useState } from 'react';
import { createHighlighter, type Highlighter } from 'shiki';

interface CodeBlockProps {
  children: string;
  language?: string;
  className?: string;
}

let highlighterInstance: Highlighter | null = null;
let highlighterPromise: Promise<Highlighter> | null = null;

async function getHighlighter(): Promise<Highlighter> {
  // 이미 인스턴스가 있으면 반환
  if (highlighterInstance) {
    return highlighterInstance;
  }

  // 이미 생성 중인 프로미스가 있으면 대기
  if (highlighterPromise) {
    return highlighterPromise;
  }

  // 새로운 하이라이터 생성
  highlighterPromise = createHighlighter({
    themes: ['github-dark'],
    langs: ['typescript', 'javascript', 'tsx', 'jsx', 'json', 'css', 'html'],
  }).then((highlighter) => {
    highlighterInstance = highlighter;
    return highlighter;
  });

  return highlighterPromise;
}

export function CodeBlock({
  children,
  language = 'tsx',
  className = '',
}: CodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function highlightCode() {
      try {
        setIsLoading(true);
        const highlighter = await getHighlighter();

        // 컴포넌트가 언마운트되었으면 처리 중단
        if (isCancelled) return;

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

        // 컴포넌트가 언마운트되었으면 상태 업데이트 중단
        if (!isCancelled) {
          setHighlightedCode(html);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Failed to highlight code:', error);
          // Fallback to plain text with basic styling
          setHighlightedCode(
            `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"><code>${children}</code></pre>`,
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    highlightCode();

    // Cleanup function
    return () => {
      isCancelled = true;
    };
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
      className={`shiki-container ${className} [&>pre]:overflow-x-scroll [&>pre]:p-4`}
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  );
}
