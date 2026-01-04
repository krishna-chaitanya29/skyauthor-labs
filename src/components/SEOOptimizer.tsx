"use client";

import { CheckCircle, Loader2, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";

interface SEOData {
  metaDescription: string;
  keywords: string[];
  keyTakeaways: string[];
  optimizedTitle?: string;
}

interface SEOOptimizerProps {
  title: string;
  content: string;
  category: string;
  onOptimize: (data: SEOData) => void;
}

export default function SEOOptimizer({
  title,
  content,
  category,
  onOptimize,
}: SEOOptimizerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleOptimize = async () => {
    if (!title || !content) {
      setError("Add title and content first");
      return;
    }

    if (content.replace(/<[^>]*>/g, "").length < 100) {
      setError("Add more content (at least 100 characters)");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/seo-optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Optimization failed");
      }

      const data: SEOData = await response.json();
      onOptimize(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to optimize. Try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 relative z-10">
      <button
        onClick={handleOptimize}
        disabled={loading || !title || !content}
        type="button"
        style={{ pointerEvents: 'auto' }}
        className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing with Gemini...
          </>
        ) : success ? (
          <>
            <CheckCircle className="w-4 h-4" />
            SEO Optimized!
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4" />
            <Sparkles className="w-3 h-3" />
            Optimize SEO with AI
          </>
        )}
      </button>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <p className="text-xs text-[var(--foreground-muted)] text-center">
        Auto-generates meta description, keywords & key takeaways
      </p>
    </div>
  );
}
