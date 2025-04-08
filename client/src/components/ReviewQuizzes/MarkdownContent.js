import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';

// Markdownコンテンツをレンダリングするコンポーネント
const MarkdownContent = ({ content }) => {
  if (!content) return null;
  
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        // コードブロックのカスタムレンダリング
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <div className="code-block-wrapper">
              <div className="code-block-header">
                <span>{match[1]}</span>
              </div>
              <pre className={`language-${match[1]}`}>
                <code className={`language-${match[1]}`} {...props}>
                  {children}
                </code>
              </pre>
            </div>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownContent; 