 

"use client";

import React, { useState } from "react";
import { Input, Radio, Button, Upload, message, Select } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import states from "@/components/statesData";
import { useAddPropertyMutation } from "@/redux/fetures/property/addProperty";
import toast, { Toaster } from "react-hot-toast";

const { Dragger } = Upload;
const { Option } = Select;

const AddPost = () => {
  const router = useRouter();
  const [selectedState, setSelectedState] = useState(null);
  const [selectedSubState, setSelectedSubState] = useState(null);
  const [openSubState, setOpenSubState] = useState(false); // Controls local government dropdown visibility
  const [image, setImage] = useState(null); // Store uploaded image file

  const [addProperty, { isLoading }] = useAddPropertyMutation();

  const handleStateChange = (value) => {
    setSelectedState(value);
    setSelectedSubState(null); // Reset sub-state selection
    setOpenSubState(true); // Open sub-state dropdown automatically
  };

  const handleSubStateChange = (value) => {
    setSelectedSubState(value);
    setOpenSubState(false); // Close dropdown after selection
  };

  const handleBack = () => {
    router.push("/mypost");
  };

  // Form state
  const [form, setForm] = useState({
    postType: "sell", // Default selection
    houseName: "",
    address: "",
    price: "",
    type: "",
    rooms: "",
    baths: "",
    city: "",
  });

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // File upload handler for image
  const uploadProps = {
    name: "file",
    multiple: false,
    showUploadList: true,
    beforeUpload: (file) => {
      console.log("Before Upload File:", file);
      setImage(file); // Store file in state
      return false; // Prevent auto-upload
    },
    onChange(info) {
      const { status, originFileObj } = info.file;
      if (status !== "uploading" && originFileObj) {
        setImage(originFileObj); // Ensure state is updated
        console.log("File Selected:", originFileObj);
      }
    },
  };

  // Form submit handler
  const handleSubmit = async () => {
    if (!image) {
      message.error("Please upload an image before submitting.");
      return;
    }
    console.log(image)

    console.log("Form Data:", form);
    console.log("Selected State:", selectedState);
    console.log("Selected SubState:", selectedSubState);

    const formData = new FormData();
    formData.append("houseName", form.houseName);
    formData.append("propertyType", form.postType);
    formData.append("state", selectedState);
    formData.append("subState", selectedSubState);
    formData.append("baths", form.baths);
    formData.append("rooms", form.rooms);
    formData.append("city", form.city);
    formData.append("price", form.price);
    formData.append("type", form.type);
    formData.append("address", form.address);
    formData.append("image", image); // Ensure image is included

    try {
      const res = await addProperty(formData).unwrap();
      console.log("Response:", res);
      if (res?.code === 201) {
        toast.success(res?.message);
        setTimeout(() => {
          router.push('/mypost')
        }, 1000);
      }
    } catch (error) {
      console.error("Error Submitting Property:", error);
      toast.error("Failed to submit property.");
    }
  };

  return (
    <div className="container mx-auto my-12">
      {/* Header */}
      <Toaster />
      <h1 className="text-center text-3xl font-bold text-green-600 mb-8">
        Add Property
      </h1>

      {/* Form */}
      <div className="max-w-4xl mx-auto bg-white p-8 border rounded-lg shadow-lg">
        {/* Post Type */}
        <div className="mb-6">
          <p className="text-gray-700 font-semibold">Create Property:</p>
          <Radio.Group
            onChange={(e) =>
              setForm((prev) => ({ ...prev, postType: e.target.value }))
            }
            value={form.postType}
          >
            <Radio value="sell">For Sell</Radio>
            <Radio value="rent">For Rent</Radio>
          </Radio.Group>
        </div>

        {/* File Upload */}
        <div className="md:flex items-center justify-between">
          <div className="mb-6">
            <p className="text-gray-700 font-semibold mb-2">Upload Image</p>
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
            </Dragger>
          </div>
        </div>

        {/* House Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            name="houseName"
            value={form.houseName}
            placeholder="House Name"
            onChange={handleChange}
          />
          <Input
            name="address"
            value={form.address}
            placeholder="Street Address"
            onChange={handleChange}
          />
        </div>

        {/* State & Local Government Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Select
            className="w-full"
            placeholder="Select a state"
            value={selectedState}
            onChange={handleStateChange}
          >
            {Object.keys(states).map((state) => (
              <Option key={state} value={state}>
                {state}
              </Option>
            ))}
          </Select>

          <Select
            className="w-full"
            placeholder="Select a local government"
            value={selectedSubState}
            onChange={handleSubStateChange}
            open={openSubState}
            disabled={!selectedState}
          >
            {(selectedState ? states[selectedState] : []).map((subState) => (
              <Option key={subState} value={subState}>
                {subState}
              </Option>
            ))}
          </Select>
        </div>

        {/* Price, Type, Rooms, Baths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            name="price"
            value={form.price}
            placeholder="Price"
            onChange={handleChange}
          />

          <Select
            name="type"
            value={form.type}
            placeholder="Select Type"
            onChange={(value) => handleChange({ target: { name: "type", value } })}
            style={{ width: "100%" }}
          >
            <Option value="duplex">Duplex</Option>
            <Option value="bungalow">Bungalow</Option>
            <Option value="studio">Studio</Option>
            <Option value="flat">Flat</Option>
          </Select>
        </div>

        {/* Rooms & Baths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            name="rooms"
            value={form.rooms}
            placeholder="Number of Rooms"
            onChange={handleChange}
          />
          <Input
            name="baths"
            value={form.baths}
            placeholder="Number of Baths"
            onChange={handleChange}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button onClick={handleBack} className="bg-gray-800 text-white px-6 py-2 rounded-lg">
            Back
          </Button>
          <Button type="primary" className="bg-green-600 text-white px-6 py-2 rounded-lg" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
