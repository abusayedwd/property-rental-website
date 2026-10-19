"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartFilled } from "@ant-design/icons";
import { useGetFavoritesQuery } from "@/redux/fetures/favorite/favorite";
import PropertyCard, { PropertyCardSkeleton } from "@/components/property/PropertyCard";

const Favorites = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (!token) router.replace("/auth/login");
  }, [router]);

  const { data, isLoading, isError } = useGetFavoritesQuery(undefined, { skip: !isLoggedIn });
  const favorites = data?.data?.attributes || [];

  return (
    <section className="bg-gray-50 px-4 py-10 md:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-navy">
              <HeartFilled className="text-red-500" /> My Favorites
            </h1>
            <p className="mt-2 text-gray-500">
              {isLoading || isLoggedIn === null
                ? "Loading your saved homes..."
                : `${favorites.length} saved ${favorites.length === 1 ? "property" : "properties"}`}
            </p>
          </div>
          <Link href="/property" className="font-medium text-primaryDark hover:underline">
            Browse more properties →
          </Link>
        </div>

        {isLoading || isLoggedIn === null ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3].map((i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : isError ? (
          <p className="rounded-xl bg-white p-10 text-center text-red-500 shadow-sm">
            Could not load your favorites. Please try again.
          </p>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl text-red-400">
              <HeartFilled />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-gray-800">No favorites yet</h2>
            <p className="mt-2 max-w-sm text-gray-500">
              Tap the heart on any property to save it here, so you can come back to it later.
            </p>
            <Link
              href="/property"
              className="mt-6 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primaryDark"
            >
              Explore properties
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Favorites;
