"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiArrowRight,
  HiArrowUp,
} from "react-icons/hi2";
import { useGetContactQuery } from "@/redux/fetures/information/contact";
import { useT } from "@/i18n/LanguageProvider";

const EXPLORE = [
  { href: "/", label: "nav.home" },
  { href: "/property", label: "footer.browseProperties" },
  { href: "/seeAllRentHome", label: "footer.rentHomes" },
  { href: "/seeAllSell", label: "footer.saleHomes" },
  { href: "/blog", label: "nav.blog" },
];

const ACCOUNT_GUEST = [
  { href: "/auth/login", label: "nav.login" },
  { href: "/auth/singup", label: "footer.createAccount" },
  { href: "/auth/singup", label: "footer.list" },
];

const ACCOUNT_USER = [
  { href: "/profile", label: "nav.myProfile" },
  { href: "/favorites", label: "footer.savedHomes" },
  { href: "/saved-searches", label: "nav.savedSearches" },
  { href: "/messages", label: "nav.messages" },
];

const SUPPORT = [
  { href: "/aboutus", label: "footer.aboutUs" },
  { href: "/contact-us", label: "footer.contactUs" },
  { href: "/privacy", label: "footer.privacy" },
  { href: "/terms", label: "footer.terms" },
];

const LinkColumn = ({ title, links }) => {
  const t = useT();
  return (
  <div>
    <h3 className="text-sm font-semibold uppercase tracking-wider text-white">{title}</h3>
    <ul className="mt-4 space-y-3">
      {links.map((link) => (
        <li key={link.href + link.label}>
          <Link href={link.href} className="group inline-flex items-center text-sm text-white/60 transition-colors hover:text-primary">
            <span className="mr-0 h-px w-0 bg-primary transition-all duration-300 group-hover:mr-2 group-hover:w-3" />
            {t(link.label)}
          </Link>
        </li>
      ))}
    </ul>
  </div>
  );
};

const ContactRow = ({ icon: Icon, label, value, href }) => {
  if (!value) return null;
  const content = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
        <Icon size={18} />
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-white/40">{label}</span>
        <span className="block break-words text-sm text-white/80 group-hover:text-white">{value}</span>
      </span>
    </>
  );
  return (
    <li>
      {href ? (
        <a href={href} className="group flex items-start gap-3">{content}</a>
      ) : (
        <div className="group flex items-start gap-3">{content}</div>
      )}
    </li>
  );
};

const Footer = () => {
  const { data: contact } = useGetContactQuery();
  const info = contact?.data?.attributes?.[0];
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const t = useT();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <footer className="relative isolate overflow-hidden bg-navyDark text-white">
      {/* Background photo under a deep navy overlay */}
      <img src="/images/luxury_apartments.jpg" alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#171F3D]/80 via-[#171F3D]/90 to-[#0F1530]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Call to action */}
        <div className="flex flex-col gap-6 border-b border-white/10 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">{t("footer.ctaTitle")}</h2>
            <p className="mt-2 text-white/60">{t("footer.ctaText")}</p>
          </div>
          <div className="flex flex-col gap-3 md:shrink-0 lg:flex-row">
            <Link
              href="/property"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primaryDark"
            >
              {t("footer.browse")} <HiArrowRight size={18} />
            </Link>
            <Link
              href={isLoggedIn ? "/addproperty" : "/auth/singup"}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-white/25 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t("footer.list")}
            </Link>
          </div>
        </div>

        {/* Main columns */}
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" aria-label="MyNextHome home">
              <img src="/images/logo.png" alt="MyNextHome" className="h-7 w-auto" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              {t("footer.about")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-1 lg:col-span-5 lg:grid-cols-3">
            <LinkColumn title={t("footer.explore")} links={EXPLORE} />
            <LinkColumn title={t("footer.forYou")} links={isLoggedIn ? ACCOUNT_USER : ACCOUNT_GUEST} />
            <div className="col-span-2 lg:col-span-1">
              <LinkColumn title={t("footer.support")} links={SUPPORT} />
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">{t("footer.contact")}</h3>
            <ul className="mt-4 space-y-4">
              <ContactRow icon={HiOutlinePhone} label={t("footer.callUs")} value={info?.phone} href={info?.phone && `tel:${info.phone}`} />
              <ContactRow icon={HiOutlineEnvelope} label={t("footer.emailUs")} value={info?.email} href={info?.email && `mailto:${info.email}`} />
              <ContactRow icon={HiOutlineMapPin} label={t("footer.office")} value={info?.address} />
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-white/10 py-6 text-sm text-white/50 md:flex-row">
          <p>© {new Date().getFullYear()} MyNextHome. {t("footer.rights")}</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="transition-colors hover:text-white">{t("footer.privacy")}</Link>
            <Link href="/terms" className="transition-colors hover:text-white">{t("footer.terms")}</Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-primary"
            >
              <HiArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
