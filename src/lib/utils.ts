import slugify from 'slugify';

export function generateSlug(title: string): string {
  return slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function calculateReadingTime(content: string): number {
  // Average reading speed: 200 words per minute
  const text = content.replace(/<[^>]*>/g, ''); // Strip HTML
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.ceil(wordCount / 200);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function extractExcerpt(content: string, maxLength: number = 160): string {
  const text = content.replace(/<[^>]*>/g, '');
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Inject ads at specific paragraph positions
export function injectAdsInContent(content: string, adCode: string, positions: number[] = [3, 7, 12]): string {
  const paragraphs = content.split('</p>');
  const result: string[] = [];
  
  paragraphs.forEach((p, index) => {
    result.push(p + (p.includes('<p') ? '</p>' : ''));
    if (positions.includes(index + 1)) {
      result.push(`<div class="ad-injection my-8">${adCode}</div>`);
    }
  });
  
  return result.join('');
}
