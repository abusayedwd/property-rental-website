"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import { useGetFavoriteIdsQuery, useToggleFavoriteMutation } from "@/redux/fetures/favorite/favorite";

// Heart toggle for a property. Logged-out users are sent to the login page.
const FavoriteButton = ({ propertyId, className = "", size = "md" }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const { data } = useGetFavoriteIdsQuery(undefined, { skip: !isLoggedIn });
  const [toggleFavorite, { isLoading }] = useToggleFavoriteMutation();

  // Demo/sample cards have no real id in the database
  if (!propertyId || String(propertyId).startsWith("demo-")) return null;

  const isFavorite = data?.data?.attributes?.includes(propertyId);

  const handleClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please log in to save favorites");
      router.push("/auth/login");
      return;
    }

    try {
      const res = await toggleFavorite(propertyId).unwrap();
      toast.success(res?.message);
    } catch (error) {
      toast.error(error?.data?.message || "Could not update favorites");
    }
  };

  const dimensions = size === "lg" ? "h-12 w-12 text-xl" : "h-10 w-10 text-lg";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      aria-pressed={!!isFavorite}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className={`flex items-center justify-center rounded-full bg-white/90 shadow-md transition-all duration-200 hover:scale-110 hover:bg-white disabled:opacity-70 ${dimensions} ${className}`}
    >
      {isFavorite ? (
        <HeartFilled className="text-red-500" />
      ) : (
        <HeartOutlined className="text-gray-600 hover:text-red-500" />
      )}
    </button>
  );
};

export default FavoriteButton;
