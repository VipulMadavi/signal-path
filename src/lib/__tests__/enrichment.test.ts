import { describe, it, expect } from 'vitest';
import {
  validateUrl,
  extractTextFromHtml,
  detectDerivedSignals,
  parseLlmResponse,
} from '../enrichment';

// ═══════════════════════════════════════════════
// validateUrl — URL validation & SSRF protection
// ═══════════════════════════════════════════════

describe('validateUrl', () => {
  describe('Valid URLs', () => {
    it('accepts https URLs', () => {
      expect(validateUrl('https://example.com')).toEqual({ valid: true });
    });

    it('accepts http URLs', () => {
      expect(validateUrl('http://example.com')).toEqual({ valid: true });
    });

    it('accepts URLs with paths', () => {
      expect(validateUrl('https://example.com/about')).toEqual({ valid: true });
    });

    it('accepts URLs with subdomains', () => {
      expect(validateUrl('https://www.example.com')).toEqual({ valid: true });
    });

    it('accepts URLs with ports', () => {
      expect(validateUrl('https://example.com:8080')).toEqual({ valid: true });
    });
  });

  describe('Invalid URLs', () => {
    it('rejects empty string', () => {
      const result = validateUrl('');
      expect(result.valid).toBe(false);
      expect(result.reason).toBeDefined();
    });

    it('rejects null/undefined', () => {
      // @ts-expect-error — testing invalid input
      expect(validateUrl(null).valid).toBe(false);
      // @ts-expect-error — testing invalid input
      expect(validateUrl(undefined).valid).toBe(false);
    });

    it('rejects URLs without protocol', () => {
      const result = validateUrl('example.com');
      expect(result.valid).toBe(false);
    });

    it('rejects file:// protocol', () => {
      const result = validateUrl('file:///etc/passwd');
      expect(result.valid).toBe(false);
    });

    it('rejects ftp:// protocol', () => {
      const result = validateUrl('ftp://files.example.com');
      expect(result.valid).toBe(false);
    });

    it('rejects malformed URLs', () => {
      const result = validateUrl('https://');
      expect(result.valid).toBe(false);
    });
  });

  describe('SSRF Protection', () => {
    it('blocks localhost', () => {
      expect(validateUrl('http://localhost').valid).toBe(false);
      expect(validateUrl('http://localhost:3000').valid).toBe(false);
    });

    it('blocks 127.0.0.1', () => {
      expect(validateUrl('http://127.0.0.1').valid).toBe(false);
      expect(validateUrl('http://127.0.0.1:8080').valid).toBe(false);
    });

    it('blocks 0.0.0.0', () => {
      expect(validateUrl('http://0.0.0.0').valid).toBe(false);
    });

    it('blocks private IP 10.x.x.x', () => {
      expect(validateUrl('http://10.0.0.1').valid).toBe(false);
      expect(validateUrl('http://10.255.255.255').valid).toBe(false);
    });

    it('blocks private IP 172.16-31.x.x', () => {
      expect(validateUrl('http://172.16.0.1').valid).toBe(false);
      expect(validateUrl('http://172.31.255.255').valid).toBe(false);
    });

    it('blocks private IP 192.168.x.x', () => {
      expect(validateUrl('http://192.168.1.1').valid).toBe(false);
      expect(validateUrl('http://192.168.0.100').valid).toBe(false);
    });

    it('blocks link-local 169.254.x.x', () => {
      expect(validateUrl('http://169.254.169.254').valid).toBe(false);
    });

    it('blocks IPv6 loopback', () => {
      expect(validateUrl('http://[::1]').valid).toBe(false);
    });

    it('returns reason string for blocked URLs', () => {
      const result = validateUrl('http://localhost');
      expect(result.reason).toContain('Internal');
    });
  });
});

// ═══════════════════════════════════════════════
// extractTextFromHtml — HTML to clean text
// ═══════════════════════════════════════════════

describe('extractTextFromHtml', () => {
  it('strips <script> tags and content', () => {
    const html = '<p>Hello</p><script>alert("xss")</script><p>World</p>';
    const text = extractTextFromHtml(html);
    expect(text).not.toContain('alert');
    expect(text).toContain('Hello');
    expect(text).toContain('World');
  });

  it('strips <style> tags and content', () => {
    const html = '<style>body { color: red; }</style><p>Content</p>';
    const text = extractTextFromHtml(html);
    expect(text).not.toContain('color');
    expect(text).toContain('Content');
  });

  it('strips <nav> and <footer> elements', () => {
    const html = '<nav>Menu items</nav><main>Main content</main><footer>Copyright</footer>';
    const text = extractTextFromHtml(html);
    expect(text).not.toContain('Menu items');
    expect(text).not.toContain('Copyright');
    expect(text).toContain('Main content');
  });

  it('strips <header> elements', () => {
    const html = '<header>Site header</header><p>Body</p>';
    const text = extractTextFromHtml(html);
    expect(text).not.toContain('Site header');
    expect(text).toContain('Body');
  });

  it('strips <svg> elements', () => {
    const html = '<p>Text</p><svg viewBox="0 0 100 100"><circle r="50"/></svg>';
    const text = extractTextFromHtml(html);
    expect(text).not.toContain('circle');
    expect(text).toContain('Text');
  });

  it('removes all HTML tags', () => {
    const html = '<div><h1>Title</h1><p>Paragraph with <strong>bold</strong></p></div>';
    const text = extractTextFromHtml(html);
    expect(text).not.toContain('<');
    expect(text).toContain('Title');
    expect(text).toContain('bold');
  });

  it('decodes HTML entities', () => {
    const html = '<p>&amp; &lt; &gt; &quot; &#039; &nbsp;</p>';
    const text = extractTextFromHtml(html);
    expect(text).toContain('&');
    expect(text).toContain('<');
    expect(text).toContain('>');
    expect(text).toContain('"');
    expect(text).toContain("'");
  });

  it('collapses whitespace', () => {
    const html = '<p>   Multiple   spaces   here   </p>';
    const text = extractTextFromHtml(html);
    expect(text).not.toContain('  '); // No double spaces
  });

  it('truncates very long text to ~8000 chars', () => {
    const html = '<p>' + 'a'.repeat(10000) + '</p>';
    const text = extractTextFromHtml(html);
    expect(text.length).toBeLessThanOrEqual(8010); // 8000 + "..."
  });

  it('handles empty string', () => {
    expect(extractTextFromHtml('')).toBe('');
  });
});

// ═══════════════════════════════════════════════
// detectDerivedSignals — HTML signal detection
// ═══════════════════════════════════════════════

describe('detectDerivedSignals', () => {
  it('detects hiring activity from /careers link', () => {
    const html = '<a href="/careers">Join our team</a>';
    const signals = detectDerivedSignals(html, 'https://example.com');
    expect(signals).toContain('Hiring activity detected');
  });

  it('detects hiring from "we\'re hiring" text', () => {
    const html = '<p>We\'re hiring talented engineers!</p>';
    const signals = detectDerivedSignals(html, 'https://example.com');
    expect(signals).toContain('Hiring activity detected');
  });

  it('detects blog/content publishing', () => {
    const html = '<a href="/blog">Our Blog</a>';
    const signals = detectDerivedSignals(html, 'https://example.com');
    expect(signals).toContain('Active content publishing');
  });

  it('detects product iteration from changelog', () => {
    const html = '<a href="/changelog">What\'s New</a>';
    const signals = detectDerivedSignals(html, 'https://example.com');
    expect(signals).toContain('Product iteration visible');
  });

  it('detects PR presence', () => {
    const html = '<a href="/press">Press Room</a>';
    const signals = detectDerivedSignals(html, 'https://example.com');
    expect(signals).toContain('PR presence detected');
  });

  it('returns empty array when no signals found', () => {
    const html = '<p>Simple product page with no hiring, blog, or press.</p>';
    const signals = detectDerivedSignals(html, 'https://example.com');
    expect(signals).toEqual([]);
  });

  it('detects multiple signals from rich HTML', () => {
    const html = `
      <a href="/careers">Careers</a>
      <a href="/blog">Blog</a>
      <a href="/changelog">Changelog</a>
      <a href="/press">Press</a>
    `;
    const signals = detectDerivedSignals(html, 'https://example.com');
    expect(signals.length).toBe(4);
  });
});

// ═══════════════════════════════════════════════
// parseLlmResponse — LLM JSON parsing
// ═══════════════════════════════════════════════

describe('parseLlmResponse', () => {
  it('parses valid JSON response', () => {
    const response = JSON.stringify({
      summary: 'AI company doing great things.',
      whatTheyDo: ['Build AI tools', 'Serve enterprises'],
      keywords: ['AI', 'Enterprise'],
      derivedSignals: ['Hiring detected'],
    });

    const result = parseLlmResponse(response);
    expect(result).not.toBeNull();
    expect(result!.summary).toBe('AI company doing great things.');
    expect(result!.whatTheyDo).toHaveLength(2);
    expect(result!.keywords).toHaveLength(2);
    expect(result!.derivedSignals).toHaveLength(1);
  });

  it('extracts JSON from markdown code block', () => {
    const response = '```json\n{"summary": "Test", "whatTheyDo": ["A"], "keywords": ["B"], "derivedSignals": ["C"]}\n```';

    const result = parseLlmResponse(response);
    expect(result).not.toBeNull();
    expect(result!.summary).toBe('Test');
  });

  it('returns null for invalid JSON', () => {
    expect(parseLlmResponse('not json')).toBeNull();
  });

  it('returns null for missing required fields', () => {
    const partial = JSON.stringify({ summary: 'Only summary' });
    expect(parseLlmResponse(partial)).toBeNull();
  });

  it('filters non-string items from arrays', () => {
    const response = JSON.stringify({
      summary: 'Test',
      whatTheyDo: ['Valid', 123, null],
      keywords: ['Key', true],
      derivedSignals: ['Signal'],
    });

    const result = parseLlmResponse(response);
    expect(result).not.toBeNull();
    expect(result!.whatTheyDo).toEqual(['Valid']);
    expect(result!.keywords).toEqual(['Key']);
  });

  it('handles empty string gracefully', () => {
    expect(parseLlmResponse('')).toBeNull();
  });
});
