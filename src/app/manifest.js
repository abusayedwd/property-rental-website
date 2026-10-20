import { SITE_NAME, SITE_DESCRIPTION } from "@/utils/site";

// Web app manifest: name and colours when the site is added to a home screen
export default function manifest() {
  return {
    name: `${SITE_NAME} - Homes for rent and sale`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#222F55",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
