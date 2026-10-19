"use client";
import Link from "next/link";
import { HiOutlineArrowLeft, HiOutlineCheckCircle } from "react-icons/hi";

const defaultHighlights = [
  "Browse verified homes for rent and sale",
  "Message landlords directly",
  "Save and manage your own listings",
];

// Shared input / button styles for every auth form
export const inputClass =
  "!h-12 !rounded-lg !border-gray-200 !bg-gray-50 hover:!border-primary focus-within:!bg-white";
export const buttonClass =
  "w-full !h-12 !rounded-lg !border-none !bg-primary hover:!bg-primaryDark !text-white !font-semibold !text-[15px] !shadow-none disabled:!opacity-60";

export const FieldLabel = ({ children }) => (
  <span className="text-sm font-medium text-gray-700">{children}</span>
);

export const FormError = ({ message }) =>
  message ? (
    <div
      role="alert"
      className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
    >
      {message}
    </div>
  ) : null;

const AuthLayout = ({
  image = "/images/luxury_apartments.jpg",
  heading,
  subheading,
  highlights = defaultHighlights,
  icon,
  title,
  subtitle,
  backHref,
  backLabel = "Back",
  wide = false,
  children,
}) => {
  return (
    <section className="bg-gradient-to-b from-secondary/60 via-gray-50 to-gray-50 px-4 py-10 md:py-16">
      <div
        className={`mx-auto grid w-full overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_-20px_rgba(34,47,85,0.25)] ring-1 ring-gray-100 lg:grid-cols-2 ${
          wide ? "max-w-6xl" : "max-w-5xl"
        }`}
      >
        {/* Brand / image panel */}
        <div className="relative hidden min-h-[600px] lg:block">
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navyDark via-navy/80 to-navy/30" />
          <div className="relative flex h-full flex-col justify-end p-10 text-white">
            <span className="mb-4 inline-flex w-fit items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wider backdrop-blur">
              Property Rental
            </span>
            <h2 className="text-3xl font-semibold leading-tight">{heading}</h2>
            {subheading && <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/80">{subheading}</p>}
            {highlights?.length > 0 && (
              <ul className="mt-8 space-y-3">
                {highlights.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/90">
                    <HiOutlineCheckCircle className="shrink-0 text-primary" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-10 md:px-12 lg:py-14">
          <div className="w-full max-w-[440px]">
            {backHref && (
              <Link
                href={backHref}
                className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-primary"
              >
                <HiOutlineArrowLeft size={16} />
                {backLabel}
              </Link>
            )}

            {icon && (
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primaryDark">
                {icon}
              </div>
            )}

            <h1 className="text-[26px] font-semibold text-navy sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-2 text-[15px] leading-relaxed text-gray-500">{subtitle}</p>}

            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;
