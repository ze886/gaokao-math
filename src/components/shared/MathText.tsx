import { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  block?: boolean;
  className?: string;
}

function renderMath(text: string): string {
  // Split text by LaTeX delimiters: $...$ for inline, $$...$$ for block
  // Also handle \\(...\\) and \\[...\\] patterns
  const parts: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Try block math first $$...$$
    const blockMatch = remaining.match(/\$\$([\s\S]*?)\$\$/);
    const inlineMatch = remaining.match(/\$([^$]+?)\$/);
    const parenBlockMatch = remaining.match(/\\\[([\s\S]*?)\\\]/);
    const parenInlineMatch = remaining.match(/\\\(([^)]+?)\\\)/);

    // Find the earliest match
    interface Match { index: number; length: number; content: string; type: 'block' | 'inline' }
    const matches: Match[] = [];
    if (blockMatch) matches.push({ index: blockMatch.index!, length: blockMatch[0].length, content: blockMatch[1], type: 'block' });
    if (inlineMatch && !blockMatch) matches.push({ index: inlineMatch.index!, length: inlineMatch[0].length, content: inlineMatch[1], type: 'inline' });
    if (parenBlockMatch && !blockMatch && !inlineMatch) matches.push({ index: parenBlockMatch.index!, length: parenBlockMatch[0].length, content: parenBlockMatch[1], type: 'block' });
    if (parenInlineMatch && !blockMatch && !inlineMatch && !parenBlockMatch) matches.push({ index: parenInlineMatch.index!, length: parenInlineMatch[0].length, content: parenInlineMatch[1], type: 'inline' });

    matches.sort((a, b) => a.index - b.index);
    const match = matches[0];

    if (!match) {
      // No more math - escape HTML and add rest
      parts.push(escapeHtml(remaining));
      break;
    }

    // Add text before the match
    if (match.index > 0) {
      parts.push(escapeHtml(remaining.substring(0, match.index)));
    }

    // Render the math
    try {
      const rendered = katex.renderToString(match.content, {
        displayMode: match.type === 'block',
        throwOnError: false,
      });
      parts.push(rendered);
    } catch {
      parts.push(escapeHtml(match.content));
    }

    remaining = remaining.substring(match.index + match.length);
  }

  return parts.join('');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');
}

export function MathText({ text, block = false, className = '' }: MathTextProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = block ? renderMath(text) : renderMath(text.replace(/\n/g, ' '));
    }
  }, [text, block]);

  if (block) {
    return (
      <div
        ref={ref}
        className={`math-content ${className}`}
      />
    );
  }

  return (
    <span
      ref={ref}
      className={`math-content inline ${className}`}
    />
  );
}

// Utility: render a single LaTeX expression
export function renderLatex(latex: string, displayMode = false): string {
  try {
    return katex.renderToString(latex, { displayMode, throwOnError: false });
  } catch {
    return latex;
  }
}
