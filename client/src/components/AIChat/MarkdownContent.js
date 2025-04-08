import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import "katex/dist/katex.min.css"; // KaTeXのスタイルをインポート
import { styles } from './styles';

// Markdownコンテンツをレンダリングするコンポーネント
const MarkdownContent = ({ content }) => {
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
        // 数式用のカスタムレンダリング
        math: ({ value }) => (
          <div className="katex-display-wrapper">
            <div className="katex-display">{value}</div>
          </div>
        ),
        inlineMath: ({ value }) => (
          <span className="katex-inline">{value}</span>
        ),
        // 他のMarkdown要素もカスタマイズできます
        h1: ({ node, ...props }) => <h1 style={styles.markdownH1} {...props} />,
        h2: ({ node, ...props }) => <h2 style={styles.markdownH2} {...props} />,
        h3: ({ node, ...props }) => <h3 style={styles.markdownH3} {...props} />,
        p: ({ node, ...props }) => <p style={styles.markdownP} {...props} />,
        ul: ({ node, ...props }) => <ul style={styles.markdownUl} {...props} />,
        ol: ({ node, ...props }) => <ol style={styles.markdownOl} {...props} />,
        li: ({ node, ...props }) => <li style={styles.markdownLi} {...props} />,
        a: ({ node, ...props }) => <a style={styles.markdownA} {...props} />,
        blockquote: ({ node, ...props }) => <blockquote style={styles.markdownBlockquote} {...props} />,
        table: ({ node, ...props }) => <table style={styles.markdownTable} {...props} />,
        img: ({ node, ...props }) => <img style={styles.markdownImg} {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownContent; 