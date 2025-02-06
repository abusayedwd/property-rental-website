"use client";

import React, { useState, useEffect } from "react";
import { Input, Radio, Button, Upload, message, Select } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import states from "@/components/statesData";
import toast, { Toaster } from "react-hot-toast";
import { useUpdatePropertyMutation } from "@/redux/fetures/property/editProperty";
import { useGetSinglepropertyQuery } from "@/redux/fetures/property/getPropertyById";

const { Dragger } = Upload;
const { Option } = Select;

const EditPost = () => {
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const postId = searchParams.get("id"); // Get property ID from URL
  const params = useParams(); // Get the dynamic route parameter
  const { id } = params; // Extract property ID

  console.log("Property ID from URL:", id); // Debugging log

  const { data: property, isLoading } = useGetSinglepropertyQuery(id, { skip: !id });
  console.log(property)
  const [updateProperty, { isLoading: updating }] = useUpdatePropertyMutation();

  const [selectedState, setSelectedState] = useState(null);
  const [selectedSubState, setSelectedSubState] = useState(null);
  const [openSubState, setOpenSubState] = useState(false);
  const [image, setImage] = useState(null); // Store uploaded image

  // Form state
  const [form, setForm] = useState({
    postType: "sell",
    houseName: "",
    address: "",
    price: "",
    type: "",
    rooms: "",
    baths: "",
    city: "",
  });

  // Prefill form with fetched data
  useEffect(() => {
    if (property) {
      setForm({
        postType: property?.data?.attributes.propertyType || "sell",
        houseName: property?.data?.attributes.houseName || "",
        address: property?.data?.attributes.address || "",
        price: property?.data?.attributes.price || "",
        type: property?.data?.attributes.type || "",
        rooms: property?.data?.attributes.rooms || "",
        baths: property?.data?.attributes.baths || "",
        city: property?.data?.attributes.city || "",
      });
      setSelectedState(property?.data?.attributes.state || null);
      setSelectedSubState(property?.data?.attributes.subState || null);
    }
  }, [property]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStateChange = (value) => {
    setSelectedState(value);
    setSelectedSubState(null);
    setOpenSubState(true);
  };

  const handleSubStateChange = (value) => {
    setSelectedSubState(value);
    setOpenSubState(false);
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    showUploadList: true,
    beforeUpload: (file) => {
      setImage(file);
      return false;
    },
  };

  const handleSubmit = async () => {
    if (!form.houseName || !form.address || !form.price) {
      toast.error("Please fill all required fields.");
      return;
    }

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

    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await updateProperty({ id, formData }).unwrap();
      console.log(res)
      if (res?.code === 200) {
        toast.success("Property updated successfully!");
        setTimeout(() => router.push("/mypost"), 1000);
      }
    } catch (error) {
      toast.error("Failed to update property.");
      console.log( error)
    }
  };

  return (
    <div className="container mx-auto my-12">
      <Toaster />
      <h1 className="text-center text-3xl font-bold text-blue-600 mb-8">
        Edit Property
      </h1>

      <div className="max-w-4xl mx-auto bg-white p-8 border rounded-lg shadow-lg">
        {isLoading ? (
          <p>Loading property details...</p>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-700 font-semibold">Edit Property Type:</p>
              <Radio.Group
                onChange={(e) => setForm((prev) => ({ ...prev, postType: e.target.value }))}
                value={form.postType}
              >
                <Radio value="sell">For Sell</Radio>
                <Radio value="rent">For Rent</Radio>
              </Radio.Group>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 font-semibold">Upload New Image (Optional)</p>
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to upload
                </p>
              </Dragger>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input name="houseName" value={form.houseName} placeholder="House Name" onChange={handleChange} />
              <Input name="address" value={form.address} placeholder="Street Address" onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Select className="w-full" placeholder="Select a state" value={selectedState} onChange={handleStateChange}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input name="price" value={form.price} placeholder="Price" onChange={handleChange} />
              <Select name="type" value={form.type} placeholder="Select Type" onChange={(value) => setForm((prev) => ({ ...prev, type: value }))}>
                <Option value="duplex">Duplex</Option>
                <Option value="bungalow">Bungalow</Option>
                <Option value="studio">Studio</Option>
                <Option value="flat">Flat</Option>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input name="rooms" value={form.rooms} placeholder="Number of Rooms" onChange={handleChange} />
              <Input name="baths" value={form.baths} placeholder="Number of Baths" onChange={handleChange} />
            </div>

            <div className="flex justify-between">
              <Button onClick={() => router.push("/mypost")} className="bg-gray-800 text-white px-6 py-2 rounded-lg">
                Back
              </Button>
              <Button type="primary" className="bg-blue-600 text-white px-6 py-2 rounded-lg" onClick={handleSubmit} loading={updating}>
                Update
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditPost;
