import { supabase } from '@/lib/supabase';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skyauthor-labs.vercel.app';

  // Fetch articles from last 2 days (Google News requirement)
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const { data: articles } = await supabase
    .from('articles')
    .select('slug, title, created_at, category')
    .eq('is_published', true)
    .gte('created_at', twoDaysAgo.toISOString())
    .order('created_at', { ascending: false });

  const newsItems = articles?.map((article) => `
    <url>
      <loc>${baseUrl}/article/${article.slug}</loc>
      <news:news>
        <news:publication>
          <news:name>SkyAuthor Labs</news:name>
          <news:language>en</news:language>
        </news:publication>
        <news:publication_date>${new Date(article.created_at).toISOString()}</news:publication_date>
        <news:title><![CDATA[${article.title}]]></news:title>
        <news:keywords>${article.category || 'news'}</news:keywords>
      </news:news>
    </url>
  `).join('') || '';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsItems}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
