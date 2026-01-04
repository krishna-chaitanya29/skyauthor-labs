"use client";

import {
    uploadToCloudinary,
    type CloudinaryUploadResult,
} from "@/lib/cloudinary";
import { ImagePlus, Link, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  // Check if Cloudinary is configured
  const isCloudinaryConfigured = 
    typeof window !== 'undefined' && 
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && 
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("Image must be less than 10MB");
        return;
      }

      setUploading(true);
      setError("");

      try {
        const result: CloudinaryUploadResult = await uploadToCloudinary(file);
        onChange(result.secure_url);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Upload failed. Use URL instead."
        );
        setShowUrlInput(true);
        console.error(err);
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleUrlSubmit = () => {
    if (urlInput.trim() && (urlInput.startsWith('http://') || urlInput.startsWith('https://'))) {
      onChange(urlInput.trim());
      setUrlInput("");
      setShowUrlInput(false);
      setError("");
    } else {
      setError("Please enter a valid image URL (https://...)");
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  return (
    <div className={className}>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-[var(--border)]">
          <Image
            src={value}
            alt="Featured image"
            width={1200}
            height={630}
            className="w-full h-48 object-cover"
            unoptimized={!value.includes('cloudinary.com')}
          />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : showUrlInput ? (
        <div className="space-y-3 p-4 bg-[var(--background-tertiary)] rounded-xl border border-[var(--border)]">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Link className="w-4 h-4" />
            Enter Image URL
          </div>
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
            className="input w-full"
            autoFocus
          />
          <div className="flex gap-2">
            <button 
              onClick={handleUrlSubmit} 
              className="btn-primary text-sm py-2 flex-1"
              type="button"
            >
              Add Image
            </button>
            <button 
              onClick={() => { setShowUrlInput(false); setError(""); }}
              className="btn-secondary text-sm py-2"
              type="button"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-[var(--foreground-muted)]">
            Tip: Use images from Unsplash, Pexels, or any public URL
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`
              flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed 
              cursor-pointer transition-all
              ${
                dragOver
                  ? "border-[var(--primary)] bg-[var(--primary)]/10"
                  : "border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--background-tertiary)]"
              }
              ${!isCloudinaryConfigured ? "opacity-50" : ""}
            `}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={!isCloudinaryConfigured}
            />
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin mb-2" />
                <span className="text-sm text-[var(--foreground-muted)]">
                  Uploading...
                </span>
              </>
            ) : (
              <>
                <ImagePlus className="w-8 h-8 text-[var(--foreground-muted)] mb-2" />
                <span className="text-sm text-[var(--foreground-muted)]">
                  {isCloudinaryConfigured ? "Drop image or click to upload" : "Cloudinary not configured"}
                </span>
              </>
            )}
          </label>
          
          {/* URL Input Button - Always available */}
          <button
            onClick={() => setShowUrlInput(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-[var(--background-tertiary)] hover:bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg transition-colors text-sm"
            type="button"
          >
            <Link className="w-4 h-4" />
            Use Image URL instead
          </button>
        </div>
      )}
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}
