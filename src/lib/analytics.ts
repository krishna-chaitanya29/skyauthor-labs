// Google Analytics 4 utilities

declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

// Check if GA is loaded
export function isGALoaded(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

// Track page view (automatic in GA4, but useful for SPA navigation)
export function trackPageView(url: string, title?: string): void {
  if (!isGALoaded()) return;

  window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "", {
    page_path: url,
    page_title: title,
  });
}

// Track custom events
export function trackEvent(
  eventName: string,
  parameters?: Record<string, unknown>
): void {
  if (!isGALoaded()) return;

  window.gtag("event", eventName, parameters);
}

// Track article read
export function trackArticleRead(
  articleId: string,
  title: string,
  category: string
): void {
  trackEvent("article_view", {
    article_id: articleId,
    article_title: title,
    article_category: category,
  });
}

// Track article share
export function trackShare(
  platform: string,
  articleId: string,
  title: string
): void {
  trackEvent("share", {
    method: platform,
    content_type: "article",
    content_id: articleId,
    item_id: title,
  });
}

// Track newsletter signup
export function trackNewsletterSignup(source: string): void {
  trackEvent("newsletter_signup", {
    signup_source: source,
  });
}

// Track search
export function trackSearch(query: string, resultsCount: number): void {
  trackEvent("search", {
    search_term: query,
    results_count: resultsCount,
  });
}

// Track scroll depth (for reading engagement)
export function trackScrollDepth(percentage: number, articleId: string): void {
  // Only track at 25%, 50%, 75%, 100% milestones
  if ([25, 50, 75, 100].includes(percentage)) {
    trackEvent("scroll_depth", {
      percent_scrolled: percentage,
      article_id: articleId,
    });
  }
}
