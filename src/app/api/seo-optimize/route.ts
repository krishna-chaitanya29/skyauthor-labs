// On-demand SEO optimization with Gemini API

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Store the body data early so it's available in catch block
  let title = "";
  let content = "";
  let category = "";
  
  try {
    const body = await request.json();
    title = body.title || "";
    content = body.content || "";
    category = body.category || "";

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    // If no API key, use basic extraction (free fallback)
    if (!apiKey) {
      console.log("No Gemini API key - using basic SEO extraction");
      return NextResponse.json({
        metaDescription: extractBasicDescription(content),
        keywords: extractKeywordsBasic(title, content),
        keyTakeaways: generateBasicTakeaways(content),
        optimizedTitle: title,
      });
    }

    // Call Gemini API for intelligent SEO optimization
    const plainContent = content.replace(/<[^>]*>/g, "").substring(0, 3000);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an SEO expert. Analyze this article and provide SEO optimization for maximum search engine visibility.

Title: ${title}
Category: ${category}
Content: ${plainContent}

Respond with ONLY valid JSON (no markdown, no code blocks, no explanation):
{
  "metaDescription": "Compelling 150-155 character SEO description with primary keyword",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "keyTakeaways": ["Key insight 1 (actionable)", "Key insight 2 (valuable)", "Key insight 3 (memorable)"],
  "optimizedTitle": "SEO-optimized title if improvement needed, otherwise same as original"
}

Requirements:
- metaDescription: Must be engaging, include main keyword, under 155 chars
- keywords: 5 highly relevant, searchable keywords (no generic words)
- keyTakeaways: 3 concise, valuable points readers will remember
- optimizedTitle: Only change if significant SEO improvement possible`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 600,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error("Gemini API request failed");
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse JSON from response (handle potential markdown wrapping)
    let jsonText = text;
    
    // Remove markdown code blocks if present
    if (text.includes("```json")) {
      jsonText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (text.includes("```")) {
      jsonText = text.replace(/```\n?/g, "");
    }

    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const seoData = JSON.parse(jsonMatch[0]);

      // Validate and sanitize response
      return NextResponse.json({
        metaDescription:
          seoData.metaDescription?.substring(0, 160) ||
          extractBasicDescription(content),
        keywords: Array.isArray(seoData.keywords)
          ? seoData.keywords.slice(0, 8)
          : [],
        keyTakeaways: Array.isArray(seoData.keyTakeaways)
          ? seoData.keyTakeaways.slice(0, 5)
          : [],
        optimizedTitle: seoData.optimizedTitle || title,
      });
    }

    throw new Error("Invalid response format from Gemini");
  } catch (error) {
    console.error("SEO optimization error:", error);

    // Fallback to basic extraction on any error (using stored values)
    if (title && content) {
      return NextResponse.json({
        metaDescription: extractBasicDescription(content),
        keywords: extractKeywordsBasic(title, content),
        keyTakeaways: generateBasicTakeaways(content),
        optimizedTitle: title,
      });
    }
    
    return NextResponse.json(
      { error: "SEO optimization failed" },
      { status: 500 }
    );
  }
}

// Basic description extraction (fallback)
function extractBasicDescription(content: string): string {
  const plainText = content.replace(/<[^>]*>/g, "").trim();
  if (plainText.length <= 155) return plainText;
  return plainText.substring(0, 152) + "...";
}

// Basic keyword extraction without AI
function extractKeywordsBasic(title: string, content: string): string[] {
  const text = `${title} ${content.replace(/<[^>]*>/g, "")}`.toLowerCase();
  const words = text.split(/\s+/);

  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "must", "can", "this", "that", "these",
    "those", "i", "you", "he", "she", "it", "we", "they", "what", "which",
    "who", "when", "where", "why", "how", "all", "each", "every", "both",
    "few", "more", "most", "other", "some", "such", "no", "nor", "not",
    "only", "own", "same", "so", "than", "too", "very", "just", "also",
  ]);

  const wordCount: Record<string, number> = {};

  words.forEach((word) => {
    const clean = word.replace(/[^a-z]/g, "");
    if (clean.length > 3 && !stopWords.has(clean)) {
      wordCount[clean] = (wordCount[clean] || 0) + 1;
    }
  });

  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

// Basic takeaways extraction
function generateBasicTakeaways(content: string): string[] {
  const text = content.replace(/<[^>]*>/g, "");
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 30 && s.length < 200);

  return sentences.slice(0, 3);
}
