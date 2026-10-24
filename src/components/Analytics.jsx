"use client";
import { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

// Turned on by setting NEXT_PUBLIC_GA_ID (Google Analytics 4, "G-...") and/or
// NEXT_PUBLIC_FB_PIXEL_ID (Meta Pixel). Without them nothing is loaded.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

// Count client-side page changes (Next.js navigation doesn't reload the page)
const PageViews = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false; // the first view is sent by the scripts themselves
      return;
    }
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");
    window.gtag?.("event", "page_view", { page_path: url, page_location: window.location.href });
    window.fbq?.("track", "PageView");
  }, [pathname, searchParams]);

  return null;
};

const Analytics = () => {
  if (!GA_ID && !PIXEL_ID) return null;
  return (
    <>
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
          </Script>
        </>
      )}
      {PIXEL_ID && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
      )}
      <PageViews />
    </>
  );
};

// Small helper for important actions, e.g. track("generate_lead", { method: "whatsapp" })
export const track = (event, params = {}) => {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
  const pixelEvents = { generate_lead: "Lead", sign_up: "CompleteRegistration", search: "Search", begin_checkout: "InitiateCheckout" };
  if (pixelEvents[event]) window.fbq?.("track", pixelEvents[event], params);
};

export default Analytics;
