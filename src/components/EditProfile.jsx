"use client";

import React, { useState } from "react";
import { Form, Input, Button, Upload } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import { LuImagePlus } from "react-icons/lu";

const EditProfile = () => {
   // Default profile picture
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
 
  const [imageUrl, setImageUrl] = useState('/images/user4.jpg');
  // Handle image upload
  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList[0]?.originFileObj) {
      const reader = new FileReader();
      reader.readAsDataURL(newFileList[0].originFileObj);
      reader.onload = () => setImageUrl(reader.result);
    }
  };


  
  // Handle form submission
  const handleSave = (values) => {
    console.log("Updated Profile Data:", values);
    console.log("Updated Profile Picture:", fileList[0]?.originFileObj);
    // Add save logic here
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4 md:px-8">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-green-700 mb-8">
        Edit Profile
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col items-center mb-6">
          {/* Profile Picture with Upload Overlay */}
          <div className="relative">
  
        <Upload
        name="profile"
        showUploadList={false}
        onChange={handleUploadChange}
      >
        <img
          className="w-44 h-44 rounded-full"
          src={ imageUrl}
          alt="Profile"
        />
        <Button
          className="border-none text-md text-blue-500 absolute bottom-6 flex items-center"
          icon={<LuImagePlus size={20} className="mr-2" />}
        >
          Change Picture
        </Button>
      </Upload>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            name: "Uganda",
            streetAddress: "Uganda",
            city: "Icasilo",
            district: "Furio",
          }}
        >
          {/* Edit Name */}
          <Form.Item
            label="Edit Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Enter your name" className="rounded-md" />
          </Form.Item>

          {/* Street Address */}
          <Form.Item
            label="Street Address"
            name="streetAddress"
            rules={[
              { required: true, message: "Please enter your street address" },
            ]}
          >
            <Input placeholder="Enter your street address" className="rounded-md" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* City */}
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: "Please enter your city" }]}
            >
              <Input placeholder="Enter your city" className="rounded-md" />
            </Form.Item>

            {/* District */}
            <Form.Item
              label="District"
              name="district"
              rules={[{ required: true, message: "Please enter your district" }]}
            >
              <Input placeholder="Enter your district" className="rounded-md" />
            </Form.Item>
          </div>

          {/* Save Changes Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-green-600 hover:bg-green-500 text-white rounded-md"
            >
              Save Change
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EditProfile;
