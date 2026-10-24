"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, InputNumber, Select, DatePicker, Upload, Checkbox, Segmented, Button, message } from "antd";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import {
  HiOutlinePhoto,
  HiOutlineMapPin,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
  HiOutlineViewfinderCircle,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { districtOptions, getAreaOptions, filterLocationOption } from "@/components/statesData";
import { LocationPickerMap } from "@/components/map";
import { AMENITIES, FURNISHING, PROPERTY_TYPES, TENANT_TYPES } from "@/utils/listing";
import { mediaUrl } from "@/utils/media";
import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";

const MAX_PHOTOS = 5;

const EMPTY = {
  propertyType: "rent",
  houseName: "",
  type: undefined,
  textArea: "",
  state: undefined,
  subState: undefined,
  place: "",
  price: null,
  negotiable: false,
  advanceMonths: null,
  serviceCharge: null,
  rooms: null,
  baths: null,
  sizeSqft: null,
  floor: "",
  furnishing: undefined,
  tenantType: "any",
  availableFrom: null,
  amenities: [],
  location: null,
};

// Turn an API listing into form values
const fromProperty = (p) => ({
  ...EMPTY,
  propertyType: ["sell", "sold"].includes(p.propertyType) ? "sell" : "rent",
  houseName: p.houseName || "",
  type: p.type || undefined,
  textArea: p.textArea || "",
  state: p.state || undefined,
  subState: p.subState || undefined,
  place: p.place || "",
  price: p.price ?? null,
  negotiable: Boolean(p.negotiable),
  advanceMonths: p.advanceMonths ?? null,
  serviceCharge: p.serviceCharge ?? null,
  rooms: p.rooms ?? null,
  baths: p.baths ?? null,
  sizeSqft: p.sizeSqft ?? null,
  floor: p.floor || "",
  furnishing: p.furnishing || undefined,
  tenantType: p.tenantType || "any",
  availableFrom: p.availableFrom ? dayjs(p.availableFrom) : p.date && dayjs(p.date).isValid() ? dayjs(p.date) : null,
  amenities: p.amenities || [],
  location: p.location?.coordinates?.length === 2 ? { lat: p.location.coordinates[1], lng: p.location.coordinates[0] } : null,
});

const Card = ({ step, title, hint, children }) => (
  <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-7">
    <div className="mb-5 flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primaryDark">{step}</span>
      <div>
        <h2 className="text-lg font-semibold text-navy">{title}</h2>
        {hint && <p className="mt-0.5 text-sm text-gray-500">{hint}</p>}
      </div>
    </div>
    {children}
  </section>
);

const Field = ({ label, required, error, children, help, className = "" }) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </span>
    {children}
    {help && !error && <span className="mt-1 block text-xs text-gray-400">{help}</span>}
    {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
  </label>
);

const inputClass = "!h-11 !rounded-lg";
const numberClass = "!w-full !rounded-lg [&_input]:!h-11";

/**
 * Add or edit a listing.
 * initial: the existing listing when editing; onSubmit(formData) must return the API response.
 */
const ListingForm = ({ mode = "add", initial, onSubmit, submitting }) => {
  const router = useRouter();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [fileList, setFileList] = useState([]);
  const [flyTarget, setFlyTarget] = useState(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (initial) setValues(fromProperty(initial));
  }, [initial]);

  // Only signed-in landlords can list a property
  const [hasToken, setHasToken] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);
    if (!token) router.replace("/auth/login");
  }, [router]);
  const { data: me, isLoading: loadingMe } = useLogedUserQuery(undefined, { skip: !hasToken });
  const role = me?.data?.attributes?.user?.role;

  const set = (key, value) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };
  const isRent = values.propertyType === "rent";
  const areaOptions = useMemo(() => getAreaOptions(values.state), [values.state]);

  // Center the map on the chosen area (OpenStreetMap search, no key needed)
  const findArea = async () => {
    const q = [values.place, values.subState, values.state, "Bangladesh"].filter(Boolean).join(", ");
    if (!values.state) return toast.error("Choose the district first");
    setLocating(true);
    try {
      const tryQuery = async (text) => {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=bd&q=${encodeURIComponent(text)}`);
        return (await res.json())?.[0];
      };
      const hit = (await tryQuery(q)) || (await tryQuery([values.subState, values.state, "Bangladesh"].filter(Boolean).join(", ")));
      if (!hit) return toast.error("Couldn't find that place. Move the map and tap the exact spot.");
      setFlyTarget({ lat: Number(hit.lat), lng: Number(hit.lon), zoom: 16 });
      toast.success("Map moved to the area. Now tap the exact building.");
    } catch {
      toast.error("Map search is unavailable. Tap the spot on the map instead.");
    } finally {
      setLocating(false);
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return toast.error("Your browser can't share location");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const point = { lat: Math.round(pos.coords.latitude * 1e6) / 1e6, lng: Math.round(pos.coords.longitude * 1e6) / 1e6 };
        set("location", point);
        setFlyTarget({ ...point, zoom: 17 });
        setLocating(false);
      },
      () => {
        toast.error("Location permission was denied");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const validate = () => {
    const e = {};
    if (!values.houseName.trim()) e.houseName = "Add a short title";
    else if (values.houseName.trim().length < 8) e.houseName = "Make the title a little longer (at least 8 characters)";
    if (!values.type) e.type = "Choose the property type";
    if (!values.state) e.state = "Choose the district";
    if (!values.subState) e.subState = "Choose the area";
    if (!values.place.trim()) e.place = "Add the road / house address";
    if (!values.price || values.price <= 0) e.price = "Enter the price";
    if (values.rooms == null || values.rooms < 0) e.rooms = "Enter bedrooms";
    if (values.baths == null || values.baths < 0) e.baths = "Enter bathrooms";
    if (values.textArea.trim().length < 30) e.textArea = "Describe the property in at least 30 characters";
    if (mode === "add" && fileList.length === 0) e.photos = "Add at least one photo";
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error("Please fix the highlighted fields");
      document.querySelector("[data-error='true']")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    const fd = new FormData();
    const add = (key, value) => fd.append(key, value === null || value === undefined ? "" : value);
    add("propertyType", values.propertyType);
    add("houseName", values.houseName.trim());
    add("type", values.type);
    add("textArea", values.textArea.trim());
    add("state", values.state);
    add("subState", values.subState);
    add("place", values.place.trim());
    add("price", values.price);
    add("negotiable", values.negotiable);
    add("rooms", values.rooms);
    add("baths", values.baths);
    add("sizeSqft", values.sizeSqft);
    add("floor", values.floor.trim());
    add("furnishing", values.furnishing);
    add("advanceMonths", isRent ? values.advanceMonths : "");
    add("serviceCharge", isRent ? values.serviceCharge : "");
    add("tenantType", isRent ? values.tenantType : "any");
    add("availableFrom", values.availableFrom ? values.availableFrom.format("YYYY-MM-DD") : "");
    add("date", values.availableFrom ? values.availableFrom.format("YYYY-MM-DD") : new Date().toISOString().slice(0, 10));
    add("amenities", values.amenities.join(","));
    add("lat", values.location?.lat ?? "");
    add("lng", values.location?.lng ?? "");
    fileList.forEach((file) => fd.append("images", file.originFileObj));

    try {
      const res = await onSubmit(fd);
      toast.success(res?.message || "Saved");
      setTimeout(() => router.push("/myproperty"), 900);
    } catch (error) {
      const status = error?.status;
      const reason =
        status === 401
          ? "Your login has expired. Please log in again."
          : status === 403
            ? "Only landlord accounts can add or edit properties."
            : status === 413
              ? "The photos are too large. Use smaller photos (under 8 MB each)."
              : status === "FETCH_ERROR"
                ? "Can't reach the server. Check your internet connection and try again."
                : error?.data?.message || "Could not save the listing. Please try again.";
      toast.error(reason, { duration: 6000 });
      if (status === 401) router.push("/auth/login");
    }
  };

  const missing = Object.values(errors).filter(Boolean);

  const uploadProps = {
    listType: "picture-card",
    multiple: true,
    accept: "image/*",
    fileList,
    beforeUpload: (file) => {
      if (!file.type.startsWith("image/")) {
        message.error("Only photos can be uploaded");
        return Upload.LIST_IGNORE;
      }
      if (file.size / 1024 / 1024 >= 8) {
        message.error("Each photo must be smaller than 8 MB");
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    onChange: ({ fileList: next }) => {
      if (next.length > MAX_PHOTOS) message.warning(`You can add up to ${MAX_PHOTOS} photos`);
      setFileList(next.slice(0, MAX_PHOTOS).map((f) => ({ ...f, url: f.url || (f.originFileObj ? URL.createObjectURL(f.originFileObj) : undefined) })));
      setErrors((e) => ({ ...e, photos: undefined }));
    },
  };

  const status = initial?.moderation?.status;

  if (hasToken === null || (hasToken && loadingMe)) {
    return <div className="min-h-[60vh] bg-gray-50" />;
  }
  if (hasToken && role && role !== "landlord") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-navy">Landlord account needed</h1>
          <p className="mt-2 text-gray-500">
            You're signed in as a {role === "admin" ? "admin" : "tenant / buyer"}. To list a property, sign up with a separate
            <b> landlord (owner)</b> account.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/auth/singup" className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-white hover:bg-primaryDark">Create landlord account</Link>
            <Link href="/property" className="rounded-lg border border-gray-200 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50">Browse homes</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 md:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link href="/myproperty" className="text-sm text-gray-500 hover:text-primaryDark">← My properties</Link>
          <h1 className="mt-2 text-2xl font-bold text-navy md:text-3xl">{mode === "add" ? "List a property" : "Edit listing"}</h1>
          <p className="mt-1 text-gray-500">Complete, honest listings with a map pin and good photos get far more replies.</p>
        </div>

        {mode === "edit" && status === "rejected" && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <b>This listing needs changes.</b> {initial?.moderation?.reason || "Update the details below and save. It will be reviewed again."}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card step={1} title="The basics">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Listing for" className="md:col-span-2">
                  <Segmented
                    block
                    size="large"
                    value={values.propertyType}
                    onChange={(v) => set("propertyType", v)}
                    options={[
                      { label: "Rent", value: "rent" },
                      { label: "Sale", value: "sell" },
                    ]}
                  />
                </Field>
                <Field label="Title" required error={errors.houseName} className="md:col-span-2" help="e.g. 3-bed family flat near Dhanmondi Lake">
                  <Input data-error={!!errors.houseName} className={inputClass} maxLength={120} showCount value={values.houseName} onChange={(e) => set("houseName", e.target.value)} placeholder="What are you listing?" />
                </Field>
                <Field label="Property type" required error={errors.type}>
                  <Select data-error={!!errors.type} className="!h-11 w-full" placeholder="Choose type" value={values.type} onChange={(v) => set("type", v)} options={PROPERTY_TYPES} />
                </Field>
                <Field label="Available from" help="Leave empty if available now">
                  <DatePicker className="!h-11 w-full !rounded-lg" value={values.availableFrom} onChange={(d) => set("availableFrom", d)} format="D MMM YYYY" />
                </Field>
              </div>
            </Card>

            <Card step={2} title="Location" hint="Renters search by area. A map pin helps them judge the commute.">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="District" required error={errors.state}>
                  <Select
                    data-error={!!errors.state}
                    className="!h-11 w-full"
                    placeholder="Select district"
                    value={values.state}
                    onChange={(v) => {
                      set("state", v);
                      set("subState", undefined);
                    }}
                    options={districtOptions}
                    showSearch
                    filterOption={filterLocationOption}
                  />
                </Field>
                <Field label="Area / upazila" required error={errors.subState}>
                  <Select
                    data-error={!!errors.subState}
                    className="!h-11 w-full"
                    placeholder={values.state ? "Select area" : "Choose a district first"}
                    disabled={!values.state}
                    value={values.subState}
                    onChange={(v) => set("subState", v)}
                    options={areaOptions}
                    showSearch
                    filterOption={filterLocationOption}
                  />
                </Field>
                <Field label="Address" required error={errors.place} className="md:col-span-2" help="Road, house or landmark. Don't include the flat number if you prefer privacy.">
                  <Input data-error={!!errors.place} className={inputClass} value={values.place} onChange={(e) => set("place", e.target.value)} placeholder="e.g. Road 27, near Rapa Plaza" />
                </Field>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <HiOutlineMapPin className="text-primaryDark" /> Map pin
                    {values.location ? <span className="font-normal text-primaryDark">· set</span> : <span className="font-normal text-gray-400">· optional</span>}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Button size="small" icon={<HiOutlineMagnifyingGlass />} onClick={findArea} loading={locating}>Find area</Button>
                    <Button size="small" icon={<HiOutlineViewfinderCircle />} onClick={useMyLocation}>I'm at the property</Button>
                    {values.location && <Button size="small" danger onClick={() => set("location", null)}>Remove pin</Button>}
                  </div>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <LocationPickerMap value={values.location} onChange={(v) => set("location", v)} flyTarget={flyTarget} />
                </div>
                <p className="mt-1.5 text-xs text-gray-400">Tap the map to drop the pin, then drag it to the exact building.</p>
              </div>
            </Card>

            <Card step={3} title="Price and terms">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label={isRent ? "Monthly rent (৳)" : "Asking price (৳)"} required error={errors.price}>
                  <InputNumber data-error={!!errors.price} className={numberClass} min={0} prefix="৳" value={values.price} onChange={(v) => set("price", v)} formatter={(v) => (v ? Number(v).toLocaleString("en-IN") : "")} parser={(v) => v.replace(/[^\d]/g, "")} placeholder={isRent ? "e.g. 25,000" : "e.g. 85,00,000"} />
                </Field>
                <div className="flex items-end pb-2.5">
                  <Checkbox checked={values.negotiable} onChange={(e) => set("negotiable", e.target.checked)}>Price is negotiable</Checkbox>
                </div>
                {isRent && (
                  <>
                    <Field label="Advance (months of rent)" help="Usually 1–3 months in Dhaka">
                      <InputNumber className={numberClass} min={0} max={24} value={values.advanceMonths} onChange={(v) => set("advanceMonths", v)} placeholder="e.g. 2" />
                    </Field>
                    <Field label="Service charge per month (৳)" help="Lift, guard, cleaning, etc. Leave empty if included">
                      <InputNumber className={numberClass} min={0} prefix="৳" value={values.serviceCharge} onChange={(v) => set("serviceCharge", v)} formatter={(v) => (v ? Number(v).toLocaleString("en-IN") : "")} parser={(v) => v.replace(/[^\d]/g, "")} />
                    </Field>
                  </>
                )}
              </div>
            </Card>

            <Card step={4} title="Property details">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <Field label="Bedrooms" required error={errors.rooms}>
                  <InputNumber data-error={!!errors.rooms} className={numberClass} min={0} max={50} value={values.rooms} onChange={(v) => set("rooms", v)} />
                </Field>
                <Field label="Bathrooms" required error={errors.baths}>
                  <InputNumber data-error={!!errors.baths} className={numberClass} min={0} max={50} value={values.baths} onChange={(v) => set("baths", v)} />
                </Field>
                <Field label="Size (sq ft)">
                  <InputNumber className={numberClass} min={0} value={values.sizeSqft} onChange={(v) => set("sizeSqft", v)} placeholder="e.g. 1250" />
                </Field>
                <Field label="Floor">
                  <Input className={inputClass} maxLength={30} value={values.floor} onChange={(e) => set("floor", e.target.value)} placeholder="e.g. 5th of 9" />
                </Field>
                <Field label="Furnishing">
                  <Select allowClear className="!h-11 w-full" placeholder="Choose" value={values.furnishing} onChange={(v) => set("furnishing", v)} options={FURNISHING} />
                </Field>
                {isRent && (
                  <Field label="Suitable for">
                    <Select className="!h-11 w-full" value={values.tenantType} onChange={(v) => set("tenantType", v)} options={TENANT_TYPES} />
                  </Field>
                )}
              </div>

              <p className="mb-2 mt-6 text-sm font-medium text-gray-700">Facilities</p>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map((a) => {
                  const on = values.amenities.includes(a.value);
                  return (
                    <button
                      key={a.value}
                      type="button"
                      onClick={() => set("amenities", on ? values.amenities.filter((x) => x !== a.value) : [...values.amenities, a.value])}
                      className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                        on ? "border-primary bg-secondary font-medium text-primaryDark" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {on && <HiOutlineCheckCircle size={16} />} {a.label}
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card step={5} title="Description" hint="Mention nearby schools, markets, transport, and anything renters should know.">
              <Field error={errors.textArea}>
                <Input.TextArea data-error={!!errors.textArea} rows={6} maxLength={5000} showCount value={values.textArea} onChange={(e) => set("textArea", e.target.value)} placeholder="Bright south-facing flat with 3 bedrooms, 2 balconies and a separate servant room. 5 minutes from Dhanmondi 27 bus stop..." className="!rounded-lg" />
              </Field>
            </Card>

            <Card step={6} title="Photos" hint={`Up to ${MAX_PHOTOS} photos. The first one is the cover.`}>
              {mode === "edit" && initial?.images?.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-sm text-gray-500">Current photos{fileList.length ? " (will be replaced by the new ones below)" : ""}</p>
                  <div className={`flex flex-wrap gap-2 ${fileList.length ? "opacity-40" : ""}`}>
                    {initial.images.map((img, i) => (
                      <img key={img._id || i} src={mediaUrl(img.url, "/images/luxury_apartments.jpg")} alt="" className="h-20 w-24 rounded-lg object-cover" />
                    ))}
                  </div>
                </div>
              )}
              <div data-error={!!errors.photos}>
                <Upload {...uploadProps}>
                  {fileList.length < MAX_PHOTOS && (
                    <div className="flex flex-col items-center text-gray-500">
                      <HiOutlinePhoto size={24} />
                      <span className="mt-1 text-xs">Add photo</span>
                    </div>
                  )}
                </Upload>
              </div>
              {errors.photos && <p className="mt-1 text-xs text-red-500">{errors.photos}</p>}
            </Card>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-navy">Before you publish</h3>
                <ul className="mt-3 space-y-2.5 text-sm text-gray-600">
                  {[
                    "Use real photos taken in daylight",
                    "Give the full rent and any extra charges",
                    "Drop a map pin on the building",
                    "Say who it suits: family, bachelor or office",
                  ].map((tip) => (
                    <li key={tip} className="flex gap-2">
                      <HiOutlineCheckCircle className="mt-0.5 shrink-0 text-primary" size={18} /> {tip}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex gap-2 rounded-lg bg-blue-50 p-3 text-xs text-blue-800">
                  <HiOutlineInformationCircle className="shrink-0" size={18} />
                  {mode === "add"
                    ? "Our team checks every new listing, usually within a few hours, before it appears in search."
                    : "Edits to a live listing show up right away."}
                </div>
                {missing.length > 0 && (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    <p className="mb-1 font-semibold">Please fix before submitting:</p>
                    <ul className="list-disc space-y-0.5 pl-4">
                      {missing.map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <Button
                  type="primary"
                  block
                  onClick={submit}
                  loading={submitting}
                  className="!mt-5 !h-12 !rounded-lg !border-none !bg-primary !font-semibold hover:!bg-primaryDark"
                >
                  {mode === "add" ? "Submit for review" : "Save changes"}
                </Button>
                <Button block onClick={() => router.push("/myproperty")} className="!mt-2 !h-11 !rounded-lg">
                  Cancel
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ListingForm;
