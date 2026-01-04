// Google Indexing API endpoint - triggers instant indexing

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL required" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skyauthor.labs";

    // Method 1: Simple sitemap ping (always works, no setup needed)
    const sitemapUrl = `${siteUrl}/sitemap.xml`;
    await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      { method: "GET" }
    ).catch(() => {});

    // Also ping Bing
    await fetch(
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      { method: "GET" }
    ).catch(() => {});

    // Method 2: Google Indexing API (requires service account setup)
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    if (serviceAccountKey) {
      try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        const token = await getGoogleAccessToken(serviceAccount);

        const indexResponse = await fetch(
          "https://indexing.googleapis.com/v3/urlNotifications:publish",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              url: url,
              type: "URL_UPDATED",
            }),
          }
        );

        if (indexResponse.ok) {
          console.log("Google Indexing API: Success for", url);
        }
      } catch (apiError) {
        console.error("Google Indexing API error:", apiError);
        // Continue - sitemap ping already done
      }
    }

    return NextResponse.json({
      success: true,
      message: "Indexing request sent",
    });
  } catch (error) {
    console.error("Indexing error:", error);
    return NextResponse.json({ error: "Indexing failed" }, { status: 500 });
  }
}

// Helper to get Google OAuth token from service account
async function getGoogleAccessToken(serviceAccount: {
  client_email: string;
  private_key: string;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  // Create JWT header and payload
  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const payload = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  // Encode header and payload
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
    "base64url"
  );
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );

  // Sign the JWT
  const crypto = await import("crypto");
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(`${encodedHeader}.${encodedPayload}`);
  const signature = sign.sign(serviceAccount.private_key, "base64url");

  const jwt = `${encodedHeader}.${encodedPayload}.${signature}`;

  // Exchange JWT for access token
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const data = await response.json();

  if (!data.access_token) {
    throw new Error("Failed to get access token");
  }

  return data.access_token;
}
