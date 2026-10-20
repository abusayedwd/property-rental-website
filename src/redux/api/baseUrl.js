// Backend address used in the browser for API calls and image URLs.
// Either a full URL (http://168.231.67.56:3090) or "/backend" when the site
// proxies the backend (see next.config.mjs).
const url = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "");
export default url;
