"use client";
import { useMemo } from "react";
import Link from "next/link";

// Admin text arrives HTML-escaped from the editor ("&lt;p>"): turn it back into markup
const decodeHtml = (html = "") => {
  if (typeof window === "undefined") return html;
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

// Real policies are long; anything shorter is a placeholder, so show the default text instead
const MIN_REAL_LENGTH = 400;

const LegalPage = ({ title, intro, adminHtml, fallbackHtml, updatedAt }) => {
  const { html, isCustom } = useMemo(() => {
    const decoded = decodeHtml(adminHtml || "");
    const plain = decoded.replace(/<[^>]+>/g, "").trim();
    return plain.length >= MIN_REAL_LENGTH ? { html: decoded, isCustom: true } : { html: fallbackHtml, isCustom: false };
  }, [adminHtml, fallbackHtml]);

  return (
    <div className="bg-gray-50 pb-16">
      <div className="bg-navy">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-16">
          <nav className="text-sm text-white/50">
            <Link href="/" className="hover:text-white">Home</Link> <span className="mx-1">/</span> {title}
          </nav>
          <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">{title}</h1>
          {intro && <p className="mt-2 max-w-2xl text-white/70">{intro}</p>}
          {isCustom && updatedAt && (
            <p className="mt-4 text-sm text-white/50">
              Last updated {new Date(updatedAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
        </div>
      </div>
      <article
        className="mx-auto -mt-6 max-w-4xl rounded-2xl border border-gray-100 bg-white px-5 py-8 text-gray-600 shadow-sm sm:px-10 md:py-10
          [&_a]:font-medium [&_a]:text-primaryDark [&_a:hover]:underline
          [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-navy first:[&_h2]:mt-0
          [&_li]:mb-1.5 [&_p]:mb-4 [&_p]:leading-relaxed [&_strong]:text-gray-800
          [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default LegalPage;
