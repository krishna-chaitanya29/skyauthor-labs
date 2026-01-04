// Google Indexing & Search Engine Ping utilities

// Ping Google Indexing API (via our API route)
export async function pingGoogleIndexing(url: string): Promise<boolean> {
  try {
    const response = await fetch("/api/index", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    return response.ok;
  } catch {
    console.error("Failed to ping Google Indexing API");
    return false;
  }
}

// Ping multiple search engines for faster discovery (free, fire-and-forget)
export async function pingSearchEngines(
  articleUrl: string,
  sitemapUrl?: string
): Promise<void> {
  const sitemap =
    sitemapUrl ||
    `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/sitemap.xml`;
  const encodedSitemap = encodeURIComponent(sitemap);

  // These pings notify search engines about your sitemap update
  const pingUrls = [
    `https://www.google.com/ping?sitemap=${encodedSitemap}`,
    `https://www.bing.com/ping?sitemap=${encodedSitemap}`,
  ];

  // Fire and forget - don't wait for responses
  await Promise.allSettled(
    pingUrls.map((pingUrl) =>
      fetch(pingUrl, { mode: "no-cors" }).catch(() => {})
    )
  );

  console.log("Search engines pinged for:", articleUrl);
}

// Combined function to notify all indexing services
export async function notifyPublish(articleUrl: string): Promise<void> {
  await Promise.allSettled([
    pingGoogleIndexing(articleUrl),
    pingSearchEngines(articleUrl),
  ]);
}
