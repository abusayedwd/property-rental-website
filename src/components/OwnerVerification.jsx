"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, Upload, Button, Skeleton, message } from "antd";
import toast from "react-hot-toast";
import {
  HiOutlineShieldCheck,
  HiOutlineIdentification,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineLockClosed,
  HiOutlineCamera,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import { useGetMyVerificationQuery, useSubmitVerificationMutation } from "@/redux/fetures/engagement/verification";
import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";

const photoProps = (file, setFile) => ({
  accept: "image/jpeg,image/png,image/webp",
  maxCount: 1,
  listType: "picture-card",
  fileList: file ? [{ uid: "1", name: file.name, status: "done", url: URL.createObjectURL(file) }] : [],
  beforeUpload: (f) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      message.error("Use a JPG, PNG or WEBP photo");
      return Upload.LIST_IGNORE;
    }
    if (f.size > 8 * 1024 * 1024) {
      message.error("The photo must be under 8 MB");
      return Upload.LIST_IGNORE;
    }
    setFile(f);
    return false;
  },
  onRemove: () => setFile(null),
});

const Benefit = ({ children }) => (
  <li className="flex gap-2 text-sm text-gray-600">
    <HiOutlineCheckCircle size={18} className="mt-0.5 shrink-0 text-primary" /> {children}
  </li>
);

const OwnerVerification = () => {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("token")) router.replace("/auth/login");
    else setReady(true);
  }, [router]);

  const { data: me } = useLogedUserQuery(undefined, { skip: !ready });
  const user = me?.data?.attributes?.user;
  const isLandlord = user?.role === "landlord";
  const { data, isLoading } = useGetMyVerificationQuery(undefined, { skip: !ready || !isLandlord });
  const [submit, { isLoading: sending }] = useSubmitVerificationMutation();
  const status = data?.data?.attributes;
  const request = status?.request;

  const [name, setName] = useState("");
  const [nid, setNid] = useState("");
  const [nidPhoto, setNidPhoto] = useState(null);
  const [selfie, setSelfie] = useState(null);

  const send = async () => {
    const digits = nid.replace(/\D/g, "");
    if (name.trim().length < 3) return toast.error("Enter your name as written on the NID");
    if (![10, 13, 17].includes(digits.length)) return toast.error("NID number must have 10, 13 or 17 digits");
    if (!nidPhoto) return toast.error("Add a photo of the front of your NID");
    const fd = new FormData();
    fd.append("fullNameOnId", name.trim());
    fd.append("nidNumber", digits);
    fd.append("documentImage", nidPhoto);
    if (selfie) fd.append("selfieImage", selfie);
    try {
      const res = await submit(fd).unwrap();
      toast.success(res?.message || "Documents sent");
    } catch (error) {
      toast.error(error?.data?.message || "Could not send your documents");
    }
  };

  const content = () => {
    if (!ready || !user || (isLandlord && isLoading)) return <Skeleton active paragraph={{ rows: 6 }} />;

    if (!isLandlord) {
      return (
        <div className="text-center">
          <p className="text-gray-600">The Verified owner badge is for property owners. Create a landlord account to list properties.</p>
          <Link href="/profile" className="mt-4 inline-block font-medium text-primaryDark hover:underline">Back to profile</Link>
        </div>
      );
    }

    if (status?.isVerifiedOwner) {
      return (
        <div className="flex flex-col items-center py-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primaryDark">
            <HiOutlineShieldCheck size={34} />
          </span>
          <h2 className="mt-4 text-xl font-semibold text-navy">You're a verified owner</h2>
          <p className="mt-1 max-w-sm text-gray-500">Your listings show the Verified owner badge, and renters can filter for verified owners only.</p>
          <Link href="/myproperty" className="mt-6 rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primaryDark">Go to my properties</Link>
        </div>
      );
    }

    if (request?.status === "pending") {
      return (
        <div className="flex flex-col items-center py-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <HiOutlineClock size={32} />
          </span>
          <h2 className="mt-4 text-xl font-semibold text-navy">We're checking your documents</h2>
          <p className="mt-1 max-w-sm text-gray-500">
            Sent on {new Date(request.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "long" })}. Reviews usually take 1–2 working days. We'll notify you here and in the bell.
          </p>
        </div>
      );
    }

    return (
      <div>
        {request?.status === "rejected" && (
          <div className="mb-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <HiOutlineExclamationTriangle size={20} className="shrink-0" />
            <div>
              <p className="font-semibold">Your last request wasn't approved</p>
              <p>{request.adminNote || "The photo may have been unclear or the details didn't match."} Please try again.</p>
            </div>
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-700">Name on NID</span>
            <Input className="!h-11 !rounded-lg" value={name} onChange={(e) => setName(e.target.value)} placeholder={user?.fullName || "As printed on the card"} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-700">NID number</span>
            <Input className="!h-11 !rounded-lg" inputMode="numeric" value={nid} onChange={(e) => setNid(e.target.value)} placeholder="10, 13 or 17 digits" />
          </label>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <HiOutlineIdentification /> Front of NID <span className="text-red-500">*</span>
            </p>
            <Upload {...photoProps(nidPhoto, setNidPhoto)}>{!nidPhoto && <span className="text-xs text-gray-500">Add photo</span>}</Upload>
          </div>
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <HiOutlineCamera /> Selfie holding the NID <span className="text-xs font-normal text-gray-400">(optional, faster review)</span>
            </p>
            <Upload {...photoProps(selfie, setSelfie)}>{!selfie && <span className="text-xs text-gray-500">Add photo</span>}</Upload>
          </div>
        </div>
        <p className="mt-4 flex gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
          <HiOutlineLockClosed size={16} className="shrink-0" />
          Your documents are stored privately, seen only by our verification team, and deleted as soon as the review is done. They are never shown on the site.
        </p>
        <Button type="primary" block onClick={send} loading={sending} className="!mt-5 !h-12 !rounded-lg !border-none !bg-primary !font-semibold hover:!bg-primaryDark">
          Send for verification
        </Button>
      </div>
    );
  };

  return (
    <section className="min-h-[70vh] bg-gray-50 px-4 py-10 md:py-14">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
            <HiOutlineShieldCheck size={26} />
          </span>
          <h1 className="mt-4 text-3xl font-bold text-navy">Become a verified owner</h1>
          <p className="mt-2 text-gray-500">Renters in Bangladesh worry about fake listings and brokers. A badge shows them you're the real owner.</p>
          <ul className="mt-6 space-y-3">
            <Benefit>Verified owner badge on every listing and your profile</Benefit>
            <Benefit>Appear when renters filter for verified owners only</Benefit>
            <Benefit>More messages and viewing requests</Benefit>
          </ul>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8 lg:col-span-3">{content()}</div>
      </div>
    </section>
  );
};

export default OwnerVerification;
