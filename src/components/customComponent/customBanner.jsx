"use client";
import React from "react";
import Link from "next/link";
import { RightOutlined } from "@ant-design/icons";

const CustomBanner = ({ title, subtitle, breadcrumb = [] }) => {
  return (
    <div className="relative">
      <div
        className="relative flex min-h-[180px] items-center bg-cover bg-center lg:min-h-[260px]"
        style={{ backgroundImage: "url('/images/bg.png')" }}
      >
        <div className="absolute inset-0 bg-[#222F55]/85" />

        <div className="md:container relative z-10 mx-auto w-full px-6 md:px-8">
          {breadcrumb.length > 0 && (
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-300 sm:text-sm">
              {breadcrumb.map((item, index) => {
                const isLast = index === breadcrumb.length - 1;
                return (
                  <React.Fragment key={`${item.label}-${index}`}>
                    {item.href && !isLast ? (
                      <Link href={item.href} className="transition-colors hover:text-white">
                        {item.label}
                      </Link>
                    ) : (
                      <span className={isLast ? "text-[#2FC639]" : ""}>{item.label}</span>
                    )}
                    {!isLast && <RightOutlined className="text-[10px] text-gray-500" />}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {title && (
            <h1 className="max-w-3xl truncate text-2xl font-bold text-white sm:text-3xl lg:text-[40px]">
              {title}
            </h1>
          )}
          {subtitle && <p className="mt-2 text-sm text-gray-300 sm:text-base">{subtitle}</p>}
        </div>
      </div>
      <div className="h-[3px] w-full bg-gradient-to-r from-[#00BF63] via-[#2FC639] to-[#00BF63]" />
    </div>
  );
};

export default CustomBanner;
