"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, Image, Progress, Skeleton } from "antd";
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineBuildingOffice2,
  HiOutlineUser,
  HiOutlineCalendarDays,
  HiOutlineMapPin,
  HiOutlineHeart,
  HiOutlineChatBubbleLeftRight,
  HiOutlineHomeModern,
  HiOutlinePlusCircle,
  HiOutlinePencilSquare,
  HiCheckBadge,
  HiOutlineShieldCheck,
  HiChevronRight,
  HiOutlineIdentification,
  HiOutlineBriefcase,
  HiOutlineLanguage,
  HiOutlineGlobeAlt,
  HiOutlineSparkles,
  HiOutlineUsers,
  HiOutlineBanknotes,
} from "react-icons/hi2";
import { FaWhatsapp, FaFacebook, FaLinkedin } from "react-icons/fa";
import url from "@/redux/api/baseUrl";
import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
import { useGetFavoritesQuery } from "@/redux/fetures/favorite/favorite";
import { useGetMypropertyQuery } from "@/redux/fetures/property/getMyproperty";
import { useGetChatlistQuery } from "@/redux/fetures/messaging/getChatlist";
import { formatPrice } from "@/utils/formatPrice";

const formatDate = (value, opts = { day: "numeric", month: "long", year: "numeric" }) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, opts);
};

const roleLabel = { user: "Tenant / Buyer", landlord: "Landlord", admin: "Admin" };
const genderLabel = { male: "Male", female: "Female", other: "Other" };
const contactLabel = { phone: "Phone call", whatsapp: "WhatsApp", message: "In-app message", email: "Email" };
const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const withProtocol = (link) => (/^https?:\/\//i.test(link) ? link : `https://${link}`);
const waLink = (number) => {
  const digits = String(number).replace(/\D/g, "");
  return `https://wa.me/${digits.startsWith("0") ? "88" + digits : digits}`; // local BD numbers -> +880
};

const ContactLink = ({ icon: Icon, iconClass, label, value, href }) =>
  value ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50"
    >
      <Icon size={20} className={`shrink-0 ${iconClass}`} />
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
        <p className="truncate font-medium text-gray-800">{value}</p>
      </div>
    </a>
  ) : null;

const Card = ({ title, action, children, className = "" }) => (
  <section className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-sm ${className}`}>
    {(title || action) && (
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-navy">{title}</h2>
        {action}
      </div>
    )}
    {children}
  </section>
);

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primaryDark">
      <Icon size={20} />
    </span>
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      {value ? (
        <p className="mt-0.5 break-words font-medium text-gray-800">{value}</p>
      ) : (
        <Link href="/profile/editProfile" className="mt-0.5 inline-block text-sm text-gray-400 hover:text-primaryDark">
          Not added · <span className="font-medium text-primaryDark">Add</span>
        </Link>
      )}
    </div>
  </div>
);

const Stat = ({ icon: Icon, label, value, href, accent }) => (
  <Link
    href={href}
    className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
  >
    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accent}`}>
      <Icon size={24} />
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-2xl font-bold text-navy">{value ?? "—"}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
    <HiChevronRight className="text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-primaryDark" size={18} />
  </Link>
);

const MiniProperty = ({ property }) => (
  <Link
    href={`/detailsHome/${property.id}`}
    className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-gray-50"
  >
    <img
      src={property?.images?.[0]?.url ? url + property.images[0].url : "/images/luxury_apartments.jpg"}
      alt={property.houseName}
      className="h-16 w-20 shrink-0 rounded-lg object-cover"
    />
    <div className="min-w-0">
      <p className="line-clamp-1 font-medium text-gray-800">{property.houseName}</p>
      <p className="line-clamp-1 text-xs text-gray-500">
        {[property.subState, property.state].filter(Boolean).join(", ") || property.place}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-primaryDark">{formatPrice(property.price)}</p>
    </div>
  </Link>
);

const ProfileSkeleton = () => (
  <div className="mx-auto max-w-6xl px-4 py-8">
    <Skeleton.Image active className="!h-44 !w-full !rounded-2xl" />
    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2"><Skeleton active paragraph={{ rows: 8 }} /></div>
      <Skeleton active paragraph={{ rows: 6 }} />
    </div>
  </div>
);

const Profile = () => {
  const router = useRouter();
  const { data: profile, isLoading, isError } = useLogedUserQuery();
  const user = profile?.data?.attributes?.user;
  const isLandlord = user?.role === "landlord";

  const { data: favoritesData } = useGetFavoritesQuery(undefined, { skip: !user });
  const { data: chatData } = useGetChatlistQuery(undefined, { skip: !user });
  const { data: myPropertyData } = useGetMypropertyQuery({ page: 1, limit: 3 }, { skip: !isLandlord });

  useEffect(() => {
    if (!localStorage.getItem("token")) router.replace("/auth/login");
  }, [router]);

  if (isLoading) return <ProfileSkeleton />;
  if (isError || !user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-navy">Couldn&apos;t load your profile</h1>
        <p className="mt-2 text-gray-500">Please log in again to continue.</p>
        <Link href="/auth/login" className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primaryDark">
          Log in
        </Link>
      </div>
    );
  }

  const favorites = favoritesData?.data?.attributes || [];
  const conversations = Array.isArray(chatData?.data?.attributes) ? chatData.data.attributes.length : undefined;
  const myProperties = myPropertyData?.data?.attributes?.results || [];
  const listingCount = myPropertyData?.data?.attributes?.totalResults ?? myProperties.length;

  const avatarSrc = user.image?.url ? url + user.image.url : undefined;
  const address = [user.street, user.streetName, user.city, user.distric].filter(Boolean).join(", ");

  // Profile completion: which useful fields are filled in
  const checklist = [
    { label: "Profile photo", done: !!user.image?.url && !user.image.url.includes("user.3.jpg") },
    { label: "Full name", done: !!user.fullName },
    { label: "Phone number", done: !!user.phoneNumber },
    { label: "Company", done: !!user.company },
    { label: "Address", done: !!address },
    { label: "About you", done: !!user.bio },
    { label: "Verified email", done: !!user.isEmailVerified },
  ];
  const completion = Math.round((checklist.filter((c) => c.done).length / checklist.length) * 100);

  const quickActions = [
    ...(isLandlord
      ? [
          { href: "/addproperty", label: "List a new property", icon: HiOutlinePlusCircle },
          { href: "/myproperty", label: "Manage my properties", icon: HiOutlineHomeModern },
        ]
      : [{ href: "/property", label: "Browse properties", icon: HiOutlineHomeModern }]),
    { href: "/favorites", label: "Saved homes", icon: HiOutlineHeart },
    { href: "/viewings", label: "My viewings", icon: HiOutlineCalendarDays },
    { href: "/messages", label: "Messages", icon: HiOutlineChatBubbleLeftRight },
    { href: "/profile/editProfile", label: "Edit profile", icon: HiOutlinePencilSquare },
  ];

  const preview = isLandlord
    ? { title: "My recent listings", items: myProperties.slice(0, 3), href: "/myproperty", empty: "You haven't listed a property yet." }
    : { title: "Recently saved", items: favorites.slice(0, 3), href: "/favorites", empty: "Tap the heart on a property to save it here." };

  return (
    <div className="bg-gray-50 pb-16">
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        {/* Header card */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="relative h-36 bg-gradient-to-r from-[#171F3D] via-[#222F55] to-[#059347] md:h-44">
            <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full border-[30px] border-white/5" />
            <div className="absolute bottom-0 left-1/3 h-32 w-32 translate-y-1/2 rounded-full bg-white/5" />
          </div>

          <div className="flex flex-col gap-4 px-6 pb-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="-mt-14 shrink-0 md:-mt-16">
                {avatarSrc ? (
                  <Image
                    src={avatarSrc}
                    alt={user.fullName}
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-white object-cover shadow-lg"
                    rootClassName="!block"
                    preview={{ mask: "View" }}
                  />
                ) : (
                  <Avatar size={120} className="border-4 border-white !bg-primary !text-4xl shadow-lg">
                    {user.fullName?.[0]?.toUpperCase()}
                  </Avatar>
                )}
              </div>
              <div className="min-w-0 md:pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-navy md:text-3xl">{user.fullName}</h1>
                  {user.isEmailVerified && <HiCheckBadge className="text-primary" size={24} title="Verified email" />}
                </div>
                <p className="mt-1 text-gray-500">{user.email}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primaryDark">
                    {roleLabel[user.role] || user.role}
                  </span>
                  {user.company && (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{user.company}</span>
                  )}
                  {isLandlord && user.experienceYears > 0 && (
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      {user.experienceYears}+ yrs experience
                    </span>
                  )}
                  {user.createdAt && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      Member since {formatDate(user.createdAt, { month: "long", year: "numeric" })}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Link
              href="/profile/editProfile"
              className="flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 font-semibold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primaryDark"
            >
              <HiOutlinePencilSquare size={18} /> Edit profile
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className={`mt-6 grid gap-4 ${isLandlord ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {isLandlord && (
            <Stat icon={HiOutlineHomeModern} label="Listed properties" value={listingCount} href="/myproperty" accent="bg-secondary text-primaryDark" />
          )}
          <Stat icon={HiOutlineHeart} label="Saved homes" value={favorites.length} href="/favorites" accent="bg-red-50 text-red-500" />
          <Stat icon={HiOutlineChatBubbleLeftRight} label="Conversations" value={conversations} href="/messages" accent="bg-blue-50 text-blue-600" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            <Card
              title="About"
              action={<Link href="/profile/editProfile" className="text-sm font-medium text-primaryDark hover:underline">Edit</Link>}
            >
              {user.bio ? (
                <p className="whitespace-pre-line leading-relaxed text-gray-600">{user.bio}</p>
              ) : (
                <Link
                  href="/profile/editProfile"
                  className="flex items-center gap-3 rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-500 transition-colors hover:border-primary hover:text-primaryDark"
                >
                  <HiOutlineSparkles size={20} className="shrink-0" />
                  Add a short introduction so people know who they&apos;re talking to.
                </Link>
              )}
            </Card>

            <Card
              title="Personal information"
              action={
                <Link href="/profile/editProfile" className="text-sm font-medium text-primaryDark hover:underline">Edit</Link>
              }
            >
              <div className="grid gap-1 md:grid-cols-2">
                <InfoItem icon={HiOutlineUser} label="Full name" value={user.fullName} />
                <InfoItem icon={HiOutlineEnvelope} label="Email" value={user.email} />
                <InfoItem icon={HiOutlinePhone} label="Phone" value={user.phoneNumber} />
                <InfoItem icon={HiOutlineBuildingOffice2} label="Company" value={user.company} />
                <InfoItem icon={HiOutlineIdentification} label="Account type" value={roleLabel[user.role] || user.role} />
                <InfoItem icon={HiOutlineCalendarDays} label="Date of birth" value={formatDate(user.dataOfBirth)} />
                <InfoItem icon={HiOutlineUser} label="Gender" value={genderLabel[user.gender]} />
                <InfoItem icon={HiOutlineBriefcase} label="Occupation" value={user.occupation} />
                <InfoItem icon={HiOutlineLanguage} label="Languages" value={user.languages?.length ? user.languages.join(", ") : null} />
                <InfoItem icon={HiOutlineMapPin} label="Address" value={address} />
              </div>
            </Card>

            <Card
              title="Contact & social"
              action={<Link href="/profile/editProfile" className="text-sm font-medium text-primaryDark hover:underline">Edit</Link>}
            >
              {[user.phoneNumber, user.whatsappNumber, user.alternatePhone, user.website, user.facebook, user.linkedin].some(Boolean) ? (
                <>
                  <div className="grid gap-1 md:grid-cols-2">
                    <ContactLink icon={HiOutlinePhone} iconClass="text-primaryDark" label="Phone" value={user.phoneNumber} href={`tel:${user.phoneNumber}`} />
                    <ContactLink icon={FaWhatsapp} iconClass="text-[#25D366]" label="WhatsApp" value={user.whatsappNumber} href={user.whatsappNumber && waLink(user.whatsappNumber)} />
                    <ContactLink icon={HiOutlinePhone} iconClass="text-gray-400" label="Alternate phone" value={user.alternatePhone} href={`tel:${user.alternatePhone}`} />
                    <ContactLink icon={HiOutlineEnvelope} iconClass="text-gray-400" label="Email" value={user.email} href={`mailto:${user.email}`} />
                    <ContactLink icon={HiOutlineGlobeAlt} iconClass="text-gray-500" label="Website" value={user.website} href={user.website && withProtocol(user.website)} />
                    <ContactLink icon={FaFacebook} iconClass="text-[#1877F2]" label="Facebook" value={user.facebook} href={user.facebook && withProtocol(user.facebook)} />
                    <ContactLink icon={FaLinkedin} iconClass="text-[#0A66C2]" label="LinkedIn" value={user.linkedin} href={user.linkedin && withProtocol(user.linkedin)} />
                  </div>
                  {user.preferredContact && (
                    <p className="mt-3 rounded-lg bg-secondary/60 px-4 py-2.5 text-sm text-gray-700">
                      Prefers to be contacted by <span className="font-semibold text-primaryDark">{contactLabel[user.preferredContact]}</span>
                    </p>
                  )}
                </>
              ) : (
                <p className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">No contact details added yet.</p>
              )}
            </Card>

            {!isLandlord && (
              <Card
                title="What I'm looking for"
                action={<Link href="/profile/editProfile" className="text-sm font-medium text-primaryDark hover:underline">Edit</Link>}
              >
                {[user.lookingFor, user.preferredPropertyType, user.preferredDistrict, user.budgetMax, user.householdSize].some(Boolean) ? (
                  <div className="grid gap-1 md:grid-cols-2">
                    <InfoItem icon={HiOutlineHomeModern} label="Want to" value={user.lookingFor && (user.lookingFor === "buy" ? "Buy a property" : "Rent a property")} />
                    <InfoItem icon={HiOutlineHomeModern} label="Property type" value={capitalize(user.preferredPropertyType)} />
                    <InfoItem icon={HiOutlineMapPin} label="Preferred district" value={user.preferredDistrict} />
                    <InfoItem icon={HiOutlineBanknotes} label="Maximum budget" value={user.budgetMax ? formatPrice(user.budgetMax) : null} />
                    <InfoItem icon={HiOutlineUsers} label="Household size" value={user.householdSize ? `${user.householdSize} ${user.householdSize === 1 ? "person" : "people"}` : null} />
                  </div>
                ) : (
                  <Link
                    href="/profile/editProfile"
                    className="flex items-center gap-3 rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-500 transition-colors hover:border-primary hover:text-primaryDark"
                  >
                    <HiOutlineSparkles size={20} className="shrink-0" />
                    Tell us your budget and preferred area to get better matches.
                  </Link>
                )}
              </Card>
            )}

            <Card
              title={preview.title}
              action={
                <Link href={preview.href} className="text-sm font-medium text-primaryDark hover:underline">View all</Link>
              }
            >
              {preview.items.length ? (
                <div className="grid gap-1 md:grid-cols-2">
                  {preview.items.map((property) => (
                    <MiniProperty key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <p className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">{preview.empty}</p>
              )}
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <Card title="Profile completion">
              <div className="flex items-center gap-4">
                <Progress
                  type="circle"
                  percent={completion}
                  size={76}
                  strokeColor="#059347"
                  format={(p) => <span className="text-base font-bold text-navy">{p}%</span>}
                />
                <p className="text-sm text-gray-500">
                  {completion === 100
                    ? "Your profile is complete. Nice work!"
                    : "A complete profile helps landlords and tenants trust you."}
                </p>
              </div>
              <ul className="mt-5 space-y-2.5">
                {checklist.map((item) => (
                  <li key={item.label} className="flex items-center gap-2.5 text-sm">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                        item.done ? "bg-primary text-white" : "border border-gray-300 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                    <span className={item.done ? "text-gray-700" : "text-gray-400"}>{item.label}</span>
                  </li>
                ))}
              </ul>
              {completion < 100 && (
                <Link
                  href="/profile/editProfile"
                  className="mt-5 flex h-10 items-center justify-center rounded-lg border border-primary text-sm font-semibold text-primaryDark transition-colors hover:bg-secondary"
                >
                  Complete your profile
                </Link>
              )}
            </Card>

            <Card title="Quick actions">
              <ul className="-mx-2 space-y-1">
                {quickActions.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link href={href} className="group flex items-center gap-3 rounded-lg px-2 py-2.5 text-gray-700 transition-colors hover:bg-gray-50">
                      <Icon size={20} className="text-gray-400 group-hover:text-primaryDark" />
                      <span className="flex-1 text-sm font-medium">{label}</span>
                      <HiChevronRight size={16} className="text-gray-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>

            <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-secondary/60 p-5">
              <HiOutlineShieldCheck size={24} className="shrink-0 text-primaryDark" />
              <div>
                <p className="font-semibold text-navy">Account security</p>
                <p className="mt-1 text-sm text-gray-600">
                  You can change your password any time from the menu under your profile picture.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
