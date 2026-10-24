import baseUrl from "@/redux/api/baseUrl";

// Photos are either on Cloudinary (full https URL) or on our API server ("/uploads/...")
export const mediaUrl = (path, fallback) => {
  if (!path) return fallback;
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:") || path.startsWith("blob:")) return path;
  return `${baseUrl}${path}`;
};

export default mediaUrl;
