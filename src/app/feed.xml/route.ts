import { supabase } from '@/lib/supabase';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skyauthor-labs.vercel.app';

  // Fetch latest 50 published articles
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, title, excerpt, created_at, category, author, cover_image')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(50);

  const rssItems = articles?.map((article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/article/${article.slug}</link>
      <guid isPermaLink="true">${baseUrl}/article/${article.slug}</guid>
      <description><![CDATA[${article.excerpt || ''}]]></description>
      <pubDate>${new Date(article.created_at).toUTCString()}</pubDate>
      <category>${article.category || 'General'}</category>
      <author>${article.author || 'SkyAuthor Labs'}</author>
      ${article.cover_image ? `<enclosure url="${article.cover_image}" type="image/jpeg" />` : ''}
    </item>
  `).join('') || '';

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>SkyAuthor Labs</title>
    <link>${baseUrl}</link>
    <description>Latest articles from SkyAuthor Labs - Technology, Business, News, and more</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>SkyAuthor Labs</title>
      <link>${baseUrl}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
