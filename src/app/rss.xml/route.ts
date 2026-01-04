import { supabase } from '@/lib/supabase';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skyauthor.labs';

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(50);

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>SkyAuthor Labs</title>
    <link>${baseUrl}</link>
    <description>Premium tech insights, viral news, and the future of digital content.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>SkyAuthor Labs</title>
      <link>${baseUrl}</link>
    </image>
    ${articles?.map((article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/article/${article.slug}</link>
      <guid isPermaLink="true">${baseUrl}/article/${article.slug}</guid>
      <description><![CDATA[${article.excerpt || article.meta_description || ''}]]></description>
      <pubDate>${new Date(article.published_at || article.created_at).toUTCString()}</pubDate>
      <category>${article.category}</category>
      ${article.image_url ? `<enclosure url="${article.image_url}" type="image/jpeg"/>` : ''}
    </item>`).join('\n') || ''}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
