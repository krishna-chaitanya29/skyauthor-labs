// Cloudinary client-side upload utility (no server cost - direct upload)

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function uploadToCloudinary(
  file: File
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.local"
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "skyauthor-articles");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Upload failed");
  }

  return response.json();
}

// Generate optimized image URL with Cloudinary transformations
export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "auto" | "webp" | "avif";
  } = {}
): string {
  const { width = 1200, height, quality = 80, format = "auto" } = options;

  // If it's a Cloudinary URL, add transformations
  if (url.includes("cloudinary.com")) {
    const parts = url.split("/upload/");
    if (parts.length === 2) {
      const transforms = [`f_${format}`, `q_${quality}`, `w_${width}`];
      if (height) transforms.push(`h_${height}`);
      transforms.push("c_limit"); // Don't upscale small images
      return `${parts[0]}/upload/${transforms.join(",")}/${parts[1]}`;
    }
  }

  return url;
}

// Get thumbnail URL
export function getThumbnailUrl(url: string, size: number = 400): string {
  return getOptimizedImageUrl(url, {
    width: size,
    height: size,
    quality: 70,
  });
}
