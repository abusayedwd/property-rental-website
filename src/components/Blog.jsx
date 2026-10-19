"use client";

import React from "react";
import { CalendarOutlined } from "@ant-design/icons";
import CustomBanner from "./customComponent/customBanner";
import { blogPosts } from "@/data/blogPosts";

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const CategoryTag = ({ children }) => (
  <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
    {children}
  </span>
);

const Blog = () => {
  const [featured, ...rest] = blogPosts;

  return (
    <div>
      <CustomBanner
        title="Our Blog"
        subtitle="Tips, trends, and insights on renting, buying, and selling property"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />

      <div className="md:container mx-auto px-4 py-12 md:py-16">
        {/* Featured post */}
        {featured && (
          <div className="mb-14 grid grid-cols-1 gap-8 overflow-hidden rounded-2xl border border-gray-100 shadow-md lg:grid-cols-2">
            <div className="h-64 lg:h-full">
              <img
                src={featured.image}
                alt={featured.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <CategoryTag>{featured.category}</CategoryTag>
              <h2 className="mt-4 text-2xl font-bold text-gray-800 sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 text-gray-600 leading-relaxed">{featured.excerpt}</p>
              <div className="mt-5 flex items-center gap-2 text-sm text-gray-400">
                <CalendarOutlined />
                {formatDate(featured.date)}
              </div>
            </div>
          </div>
        )}

        {/* Post grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <article
              key={post.id}
              className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <CategoryTag>{post.category}</CategoryTag>
                <h3 className="mt-3 text-lg font-bold text-gray-800 leading-snug">
                  {post.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-gray-600 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                  <CalendarOutlined />
                  {formatDate(post.date)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
