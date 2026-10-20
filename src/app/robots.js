import { SITE_URL } from "@/utils/site";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Account pages are private
      disallow: ["/profile", "/favorites", "/messages", "/viewings", "/myproperty", "/addproperty", "/editpost", "/auth/sendOtp", "/auth/resetPassword", "/auth/forgotPassword"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
