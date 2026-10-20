"use client";
import { useState } from "react";
import { Input, Modal, Radio } from "antd";
import toast from "react-hot-toast";
import { HiOutlineFlag } from "react-icons/hi2";
import { useReportListingMutation } from "@/redux/fetures/engagement/reports";

const REASONS = [
  { value: "fake", label: "Fake listing or photos" },
  { value: "scam", label: "Looks like a scam" },
  { value: "wrong_info", label: "Wrong price or details" },
  { value: "unavailable", label: "Already rented or sold" },
  { value: "offensive", label: "Offensive or inappropriate" },
  { value: "other", label: "Something else" },
];

// Let users flag a listing for the admin team to review
const ReportListingModal = ({ open, onClose, propertyId }) => {
  const [reason, setReason] = useState(null);
  const [details, setDetails] = useState("");
  const [reportListing, { isLoading }] = useReportListingMutation();

  const submit = async () => {
    if (!reason) {
      toast.error("Please choose a reason");
      return;
    }
    try {
      const res = await reportListing({ propertyId, reason, details: details.trim() || undefined }).unwrap();
      toast.success(res?.message || "Thanks, our team will review this listing");
      setReason(null);
      setDetails("");
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Could not send the report");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={submit}
      okText="Send report"
      okButtonProps={{ danger: true, loading: isLoading }}
      centered
      width={460}
      title={
        <span className="flex items-center gap-2">
          <HiOutlineFlag className="text-red-500" size={20} /> Report this listing
        </span>
      }
    >
      <p className="text-sm text-gray-500">Tell us what&apos;s wrong. Reports are private and reviewed by our team.</p>
      <Radio.Group value={reason} onChange={(e) => setReason(e.target.value)} className="!mt-4 !flex !flex-col !gap-2">
        {REASONS.map((r) => (
          <Radio key={r.value} value={r.value} className="!rounded-lg !border !border-gray-100 !px-3 !py-2 hover:!bg-gray-50">
            {r.label}
          </Radio>
        ))}
      </Radio.Group>
      <Input.TextArea
        className="!mt-4 !rounded-lg"
        rows={3}
        maxLength={1000}
        showCount
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Add any details that will help us check (optional)"
      />
    </Modal>
  );
};

export default ReportListingModal;
