"use client";
import React from "react";
import { HiOutlinePhone, HiOutlineEnvelope, HiOutlineMapPin } from "react-icons/hi2";
import { useGetContactQuery } from "@/redux/fetures/information/contact";

const ContactCard = ({ icon: Icon, label, value, href }) => {
  const content = (
    <>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primaryDark transition-colors group-hover:bg-primary group-hover:text-white">
        <Icon size={22} />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="break-words font-semibold text-navy">{value || "—"}</p>
      </div>
    </>
  );
  const className = "group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md";
  return href && value ? (
    <a href={href} className={className}>
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
};

const ContactUs = () => {
  const { data: contact } = useGetContactQuery();
  const info = contact?.data?.attributes?.[0];

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primaryDark">Need help?</p>
          <h2 className="mt-2 text-3xl font-bold text-navy md:text-4xl">Get in touch with us</h2>
          <p className="mt-3 text-gray-500">Questions about a listing or your account? Our team is happy to help.</p>
        </div>
        <div className="mt-12 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <img
            src="/images/davispAb.jpg"
            alt="Customer support"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl lg:aspect-[5/4]"
          />
          <div className="space-y-4">
            <ContactCard icon={HiOutlinePhone} label="Call us" value={info?.phone} href={`tel:${info?.phone}`} />
            <ContactCard icon={HiOutlineEnvelope} label="Email us" value={info?.email} href={`mailto:${info?.email}`} />
            <ContactCard icon={HiOutlineMapPin} label="Visit us" value={info?.address} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
