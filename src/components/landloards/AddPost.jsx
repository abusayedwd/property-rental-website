"use client";

import React, { useState } from "react";
import { Input, Radio, Button, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
 

const { Dragger } = Upload;

const AddPost = () => {
  const router = useRouter();

  const hendleback = () => {
    router.push("/mypost");
  };

// 
  // Form state
  const [form, setForm] = useState({
    postType: "sell", // Default to "For Sell"
    document: "",
    houseName: "",
    streetAddress: "",
    city: "",
    district: "",
    price: "",
    type: "",
    beds: "",
    baths: "", 
    sqft: "", 
  });

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // File upload handler
  const uploadProps = {
    name: "file",
    multiple: false,
    action: "/upload.do", // Replace with your upload endpoint
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  // Form submit handler
  const handleSubmit = () => {
    console.log("Form Data:", form);
    message.success("Post added successfully!");
  };

  return (
    <div className="container mx-auto my-12">
      {/* Header */}
      <h1 className="text-center text-3xl font-bold text-green-600 mb-8">Add Post</h1>

      {/* Form */}
      <div className="max-w-4xl mx-auto bg-white p-8 border rounded-lg shadow-lg">
        {/* Post Type */}
        <div className="mb-6">
          <p className="text-gray-700 font-semibold">Create Post:</p>
          <Radio.Group
            onChange={(e) => setForm((prev) => ({ ...prev, postType: e.target.value }))}
            value={form.postType}
          >
            <Radio value="sell">For Sell</Radio>
            <Radio value="rent">For Rent</Radio>
          </Radio.Group>
        </div>

        {/* File Upload */}
        <div className="md:flex items-center justify-between">

        <div className="mb-6">
          <p className="text-gray-700 font-semibold mb-2">Document</p>
          <Input
            name="document"
            value={form.document}
            placeholder="PDF"
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="mb-6">
          <p className="text-gray-700 font-semibold mb-2">Upload Image</p>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
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
            name="streetAddress"
            value={form.streetAddress}
            placeholder="Street Address"
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            name="city"
            value={form.city}
            placeholder="City"
            onChange={handleChange}
          />
          <Input
            name="district"
            value={form.district}
            placeholder="District"
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            name="price"
            value={form.price}
            placeholder="Price"
            onChange={handleChange}
          />
          <Input
            name="type"
            value={form.type}
            placeholder="Type"
            onChange={handleChange}
          />
        </div>

        {/* Beds, Baths, Sqft */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Input
            name="beds"
            value={form.beds}
            placeholder="Beds"
            onChange={handleChange}
          />
          <Input
            name="baths"
            value={form.baths}
            placeholder="Baths"
            onChange={handleChange}
          />
          <Input
            name="sqft"
            value={form.sqft}
            placeholder="Square ft"
            onChange={handleChange}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            onClick={hendleback}
            className="bg-gray-800 text-white hover:bg-gray-700 px-6 py-2 rounded-lg"
          >
            Back
          </Button>
          <Button
            type="primary"
            className="bg-green-600 text-white hover:bg-green-500 px-6 py-2 rounded-lg"
            onClick={handleSubmit}
          >
            Add Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
