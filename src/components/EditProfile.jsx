"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, Input, InputNumber, Button, Upload, Select, DatePicker, Avatar, Skeleton, Segmented } from "antd";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import {
  HiOutlineCamera,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineBuildingOffice2,
  HiOutlineEnvelope,
  HiOutlineArrowLeft,
  HiOutlineGlobeAlt,
  HiOutlineBriefcase,
} from "react-icons/hi2";
import { FaWhatsapp, FaFacebook, FaLinkedin } from "react-icons/fa";
import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
import { useEditProfileMutation } from "@/redux/fetures/user/editProfile";
import { districtOptions, getAreaOptions, filterLocationOption } from "@/components/statesData";
import { mediaUrl } from "@/utils/media";
import { PROPERTY_TYPES } from "@/utils/listing";

const MAX_IMAGE_MB = 5;
const inputClass = "!h-11 !rounded-lg";
const phoneRule = { pattern: /^\+?[0-9\s-]{7,15}$/, message: "Please enter a valid phone number" };
const urlRule = { type: "url", message: "Please enter a full link, e.g. https://..." };

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other / prefer not to say" },
];
const languageOptions = ["Bangla", "English", "Hindi", "Urdu", "Arabic", "Chinese"].map((l) => ({ value: l, label: l }));
const contactOptions = [
  { value: "phone", label: "Phone call" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "message", label: "In-app message" },
  { value: "email", label: "Email" },
];
// Same values the Add Property form uses
const propertyTypeOptions = PROPERTY_TYPES;
const flatDistrictOptions = districtOptions.flatMap((group) => group.options);
const takaFormatter = (v) => (v ? `৳ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "");
const takaParser = (v) => (v ? v.replace(/[৳,\s]/g, "") : "");

// Profile fields edited as plain values (everything except photo, date and languages)
const TEXT_FIELDS = [
  "fullName", "phoneNumber", "company", "distric", "city", "street", "streetName",
  "bio", "gender", "occupation", "whatsappNumber", "alternatePhone", "preferredContact",
  "website", "facebook", "linkedin", "experienceYears",
  "lookingFor", "preferredPropertyType", "preferredDistrict", "budgetMax", "householdSize",
];

const Section = ({ title, description, children }) => (
  <section className="grid gap-6 border-b border-gray-100 py-8 last:border-0 md:grid-cols-3">
    <div>
      <h2 className="font-semibold text-navy">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
    <div className="md:col-span-2">{children}</div>
  </section>
);

const EditProfile = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { data: profile, isLoading: isProfileLoading } = useLogedUserQuery();
  const user = profile?.data?.attributes?.user;
  const isLandlord = user?.role === "landlord";
  const [updateProfile, { isLoading }] = useEditProfileMutation();

  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const district = Form.useWatch("distric", form);

  useEffect(() => {
    if (!user) return;
    form.setFieldsValue({
      ...Object.fromEntries(TEXT_FIELDS.map((key) => [key, user[key] ?? undefined])),
      dataOfBirth: user.dataOfBirth && dayjs(user.dataOfBirth).isValid() ? dayjs(user.dataOfBirth) : null,
      languages: user.languages || [],
    });
    if (user.image?.url) setImageUrl(mediaUrl(user.image.url));
  }, [user, form]);

  const beforeUpload = (fileObj) => {
    if (!fileObj.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return Upload.LIST_IGNORE;
    }
    if (fileObj.size / 1024 / 1024 > MAX_IMAGE_MB) {
      toast.error(`Image must be smaller than ${MAX_IMAGE_MB}MB`);
      return Upload.LIST_IGNORE;
    }
    setFile(fileObj);
    setImageUrl(URL.createObjectURL(fileObj));
    return false; // upload together with the form
  };

  const handleSave = async (values) => {
    setError("");
    const formData = new FormData();
    const fields = {
      ...values,
      dataOfBirth: values.dataOfBirth ? values.dataOfBirth.format("YYYY-MM-DD") : "",
      languages: (values.languages || []).join(","),
    };
    Object.entries(fields).forEach(([key, value]) => formData.append(key, value ?? ""));
    if (file) formData.append("image", file);

    try {
      const response = await updateProfile({ formData, id: user?.id }).unwrap();
      if (response?.code === 200) {
        toast.success("Profile updated");
        router.push("/profile");
      }
    } catch (err) {
      setError(err?.data?.message || "Failed to update profile. Please try again.");
    }
  };

  if (isProfileLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Skeleton active avatar paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 pb-16">
      <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6">
        <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primaryDark">
          <HiOutlineArrowLeft size={16} /> Back to profile
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-navy md:text-3xl">Edit profile</h1>
        <p className="mt-1 text-gray-500">Keep your details up to date so landlords and tenants can reach you.</p>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={handleSave}
          className="mt-6 rounded-2xl border border-gray-100 bg-white px-6 shadow-sm md:px-8"
        >
          <Section title="Profile photo" description={`JPG or PNG, up to ${MAX_IMAGE_MB}MB.`}>
            <div className="flex items-center gap-5">
              <div className="relative">
                <Avatar size={96} src={imageUrl || undefined} className="!bg-primary !text-3xl ring-4 ring-gray-100">
                  {user?.fullName?.[0]?.toUpperCase()}
                </Avatar>
                <Upload accept="image/*" showUploadList={false} beforeUpload={beforeUpload}>
                  <button
                    type="button"
                    aria-label="Change photo"
                    className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-md ring-4 ring-white transition-colors hover:bg-primaryDark"
                  >
                    <HiOutlineCamera size={18} />
                  </button>
                </Upload>
              </div>
              <div>
                <Upload accept="image/*" showUploadList={false} beforeUpload={beforeUpload}>
                  <Button className="!h-10 !rounded-lg">Upload new photo</Button>
                </Upload>
                {file && <p className="mt-2 text-xs text-gray-500">New photo selected · saves when you click Save</p>}
              </div>
            </div>
          </Section>

          <Section title="Personal information" description="Your name and contact details.">
            <div className="grid gap-x-4 md:grid-cols-2">
              <Form.Item
                label="Full name"
                name="fullName"
                rules={[{ required: true, whitespace: true, message: "Please enter your name" }]}
                className="md:col-span-2"
              >
                <Input className={inputClass} prefix={<HiOutlineUser className="mr-1 text-gray-400" />} placeholder="Your full name" />
              </Form.Item>
              <Form.Item label="Email" className="md:col-span-2" extra="Email can't be changed here.">
                <Input className={inputClass} prefix={<HiOutlineEnvelope className="mr-1 text-gray-400" />} value={user?.email} disabled />
              </Form.Item>
              <Form.Item label="Phone number" name="phoneNumber" rules={[phoneRule]}>
                <Input className={inputClass} prefix={<HiOutlinePhone className="mr-1 text-gray-400" />} placeholder="01XXXXXXXXX" />
              </Form.Item>
              <Form.Item label="Date of birth" name="dataOfBirth">
                <DatePicker
                  className={`${inputClass} w-full`}
                  format="DD MMM YYYY"
                  disabledDate={(d) => d && d.isAfter(dayjs())}
                  placeholder="Select date"
                />
              </Form.Item>
              <Form.Item label="Gender" name="gender">
                <Select className="!h-11" placeholder="Select gender" options={genderOptions} allowClear />
              </Form.Item>
              <Form.Item label="Occupation" name="occupation" rules={[{ max: 100 }]}>
                <Input className={inputClass} prefix={<HiOutlineBriefcase className="mr-1 text-gray-400" />} placeholder="e.g. Software engineer" />
              </Form.Item>
              <Form.Item label="Company" name="company">
                <Input className={inputClass} prefix={<HiOutlineBuildingOffice2 className="mr-1 text-gray-400" />} placeholder="Company name (optional)" />
              </Form.Item>
              <Form.Item label="Languages you speak" name="languages">
                <Select
                  mode="tags"
                  className="min-h-[44px]"
                  placeholder="Select or type languages"
                  options={languageOptions}
                  tokenSeparators={[","]}
                />
              </Form.Item>
            </div>
          </Section>

          <Section title="About you" description="A short introduction shown on your profile.">
            <Form.Item name="bio" rules={[{ max: 500, message: "Keep it under 500 characters" }]} className="!mb-2">
              <Input.TextArea
                rows={5}
                showCount
                maxLength={500}
                className="!rounded-lg"
                placeholder={
                  isLandlord
                    ? "e.g. I manage 5 family flats in Dhanmondi and respond within a day."
                    : "e.g. Working professional looking for a quiet 2-bed flat near Gulshan."
                }
              />
            </Form.Item>
          </Section>

          <Section title="Address" description="Where you live or where your business is based.">
            <div className="grid gap-x-4 md:grid-cols-2">
              <Form.Item label="District / City" name="distric">
                <Select
                  className="!h-11"
                  placeholder="Select district"
                  options={districtOptions}
                  showSearch
                  allowClear
                  filterOption={filterLocationOption}
                  onChange={() => form.setFieldValue("city", undefined)}
                />
              </Form.Item>
              <Form.Item label="Area / Upazila" name="city">
                <Select
                  className="!h-11"
                  placeholder={district ? "Select area" : "Select a district first"}
                  options={getAreaOptions(district)}
                  disabled={!district}
                  showSearch
                  allowClear
                  filterOption={filterLocationOption}
                />
              </Form.Item>
              <Form.Item label="House / Flat" name="street">
                <Input className={inputClass} placeholder="e.g. House 12, Flat 4B" />
              </Form.Item>
              <Form.Item label="Road / Street" name="streetName">
                <Input className={inputClass} placeholder="e.g. Road 27" />
              </Form.Item>
            </div>
          </Section>

          <Section title="Contact & social" description="Extra ways people can reach you. All optional.">
            <div className="grid gap-x-4 md:grid-cols-2">
              <Form.Item label="WhatsApp number" name="whatsappNumber" rules={[phoneRule]}>
                <Input className={inputClass} prefix={<FaWhatsapp className="mr-1 text-[#25D366]" />} placeholder="01XXXXXXXXX" />
              </Form.Item>
              <Form.Item label="Alternate phone" name="alternatePhone" rules={[phoneRule]}>
                <Input className={inputClass} prefix={<HiOutlinePhone className="mr-1 text-gray-400" />} placeholder="Another number" />
              </Form.Item>
              <Form.Item label="Preferred way to be contacted" name="preferredContact" className="md:col-span-2">
                <Select className="!h-11" placeholder="Choose one" options={contactOptions} allowClear />
              </Form.Item>
              <Form.Item label="Website" name="website" rules={[urlRule]}>
                <Input className={inputClass} prefix={<HiOutlineGlobeAlt className="mr-1 text-gray-400" />} placeholder="https://yourwebsite.com" />
              </Form.Item>
              <Form.Item label="Facebook" name="facebook" rules={[urlRule]}>
                <Input className={inputClass} prefix={<FaFacebook className="mr-1 text-[#1877F2]" />} placeholder="https://facebook.com/..." />
              </Form.Item>
              <Form.Item label="LinkedIn" name="linkedin" rules={[urlRule]} className="md:col-span-2">
                <Input className={inputClass} prefix={<FaLinkedin className="mr-1 text-[#0A66C2]" />} placeholder="https://linkedin.com/in/..." />
              </Form.Item>
            </div>
          </Section>

          {isLandlord ? (
            <Section title="Landlord details" description="Helps tenants know who they're renting from.">
              <div className="grid gap-x-4 md:grid-cols-2">
                <Form.Item label="Years of experience" name="experienceYears">
                  <InputNumber className={`${inputClass} !w-full !pt-1`} min={0} max={80} placeholder="e.g. 5" />
                </Form.Item>
              </div>
            </Section>
          ) : (
            <Section title="What you're looking for" description="We use this to show you better matches.">
              <div className="grid gap-x-4 md:grid-cols-2">
                <Form.Item label="I want to" name="lookingFor" className="md:col-span-2">
                  <Segmented
                    options={[
                      { label: "Rent", value: "rent" },
                      { label: "Buy", value: "buy" },
                    ]}
                  />
                </Form.Item>
                <Form.Item label="Property type" name="preferredPropertyType">
                  <Select className="!h-11" placeholder="Any type" options={propertyTypeOptions} allowClear />
                </Form.Item>
                <Form.Item label="Preferred district" name="preferredDistrict">
                  <Select
                    className="!h-11"
                    placeholder="Any district"
                    options={flatDistrictOptions}
                    showSearch
                    allowClear
                    filterOption={filterLocationOption}
                  />
                </Form.Item>
                <Form.Item label="Maximum budget" name="budgetMax">
                  <InputNumber
                    className={`${inputClass} !w-full !pt-1`}
                    min={0}
                    step={1000}
                    formatter={takaFormatter}
                    parser={takaParser}
                    placeholder="৳ e.g. 30,000"
                  />
                </Form.Item>
                <Form.Item label="Household size" name="householdSize">
                  <InputNumber className={`${inputClass} !w-full !pt-1`} min={1} max={50} placeholder="People living with you" />
                </Form.Item>
              </div>
            </Section>
          )}

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 py-6 sm:flex-row sm:justify-end">
            <Button onClick={() => router.push("/profile")} className="!h-11 !rounded-lg !px-6">
              Cancel
            </Button>
            <Button
              htmlType="submit"
              loading={isLoading}
              className="!h-11 !rounded-lg !border-none !bg-primary !px-8 !font-semibold !text-white hover:!bg-primaryDark"
            >
              Save changes
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default EditProfile;
