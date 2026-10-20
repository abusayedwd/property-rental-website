"use client";
import { useState } from "react";
import { DatePicker, Input, Modal, Segmented } from "antd";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import { useRequestViewingMutation } from "@/redux/fetures/engagement/viewings";

const MAX_DAYS_AHEAD = 60;
const SLOTS = [
  { value: "morning", label: "Morning", hint: "9am–12pm" },
  { value: "afternoon", label: "Afternoon", hint: "12pm–4pm" },
  { value: "evening", label: "Evening", hint: "4pm–8pm" },
];

// Ask the owner for a visit: pick a day and a time slot, add an optional message
const ViewingRequestModal = ({ open, onClose, property }) => {
  const [date, setDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState("afternoon");
  const [message, setMessage] = useState("");
  const [requestViewing, { isLoading }] = useRequestViewingMutation();

  const reset = () => {
    setDate(null);
    setTimeSlot("afternoon");
    setMessage("");
  };

  const submit = async () => {
    if (!date) {
      toast.error("Please choose a day for your visit");
      return;
    }
    try {
      await requestViewing({ propertyId: property.id, date: date.format("YYYY-MM-DD"), timeSlot, message: message.trim() || undefined }).unwrap();
      toast.success("Viewing requested. The owner will confirm soon.");
      reset();
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Could not request the viewing");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={submit}
      okText="Send request"
      okButtonProps={{ loading: isLoading, className: "!bg-primary hover:!bg-primaryDark" }}
      centered
      width={480}
      title={
        <span className="flex items-center gap-2">
          <HiOutlineCalendarDays className="text-primaryDark" size={20} /> Request a viewing
        </span>
      }
    >
      <p className="text-sm text-gray-500">
        Choose when you&apos;d like to visit <span className="font-medium text-gray-800">{property?.houseName}</span>. The owner
        will confirm or suggest another time.
      </p>

      <p className="mb-2 mt-5 text-sm font-medium text-gray-700">Day</p>
      <DatePicker
        className="w-full"
        size="large"
        value={date}
        onChange={setDate}
        format="dddd, D MMMM YYYY"
        placeholder="Select a day"
        disabledDate={(d) => d && (d.isBefore(dayjs(), "day") || d.isAfter(dayjs().add(MAX_DAYS_AHEAD, "day"), "day"))}
        inputReadOnly
      />

      <p className="mb-2 mt-5 text-sm font-medium text-gray-700">Time</p>
      <Segmented
        block
        value={timeSlot}
        onChange={setTimeSlot}
        options={SLOTS.map((s) => ({
          value: s.value,
          label: (
            <span className="block py-1 leading-tight">
              <span className="block font-medium">{s.label}</span>
              <span className="block text-[11px] text-gray-500">{s.hint}</span>
            </span>
          ),
        }))}
      />

      <p className="mb-2 mt-5 text-sm font-medium text-gray-700">
        Message <span className="font-normal text-gray-400">(optional)</span>
      </p>
      <Input.TextArea
        rows={3}
        maxLength={500}
        showCount
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="e.g. I'm interested for my family of 4 and would like to see the kitchen and parking."
        className="!rounded-lg"
      />
    </Modal>
  );
};

export default ViewingRequestModal;
