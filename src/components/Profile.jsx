"use client";

import React, { useState } from "react";
import { Button, Input, Modal, Form, Image, Space, Upload } from "antd";
import { LuImagePlus } from "react-icons/lu";
import { useRouter } from "next/navigation";
 
const Profile = () => {
    const [fileList, setFileList] = useState([]); 
    const [imageUrl, setImageUrl] = useState();

const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleFormSubmit = (values) => {
    console.log("Updated Profile Data:", values);
    closeModal();
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList[0]?.originFileObj) {
      const reader = new FileReader();
      reader.readAsDataURL(newFileList[0].originFileObj);
      reader.onload = () => setImageUrl(reader.result);
    }
  };

  const handleEditProfile = () => {
    router.push("/profile/editProfile"); // Navigate to the edit profile page
  };

  return (
    <div className="md:w-[70%] mx-auto md:py-24 px-4 md:px-8">
      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl mt-5 font-bold text-green-700 text-center md:mb-8">
        My Profile
      </h1>

      {/* Profile Card */}
      <div className="bg-white shadow-md py-10 rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Picture */}
          <Space size={12}>
      <Image
        width={200}
        src="/images/user4.jpg"
        placeholder={
          <Image
            preview={false}
            src="/images/user4.jpg"
            width={200}
          />
        }
      />
   
    </Space>

          {/* Profile Details */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">Lindar Jord</h2>
            <p className="text-gray-600">lindarlord100@gmail.com</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm text-gray-500">Street Address</label>
                <Input
                  value="Uganda"
                  readOnly
                  className="bg-gray-100 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">District</label>
                <Input
                  value="fgfihu"
                  readOnly
                  className="bg-gray-100 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">City</label>
                <Input
                  value="Icasilo"
                  readOnly
                  className="bg-gray-100 border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
         
        </div>
        <div className="text-right">

<Button
  type="primary"
  className="!bg-green-500 mt-6 hover:!bg-green-400 text-white"
  onClick={handleEditProfile}
>
  Edit profile
</Button>
</div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{
            name: "Lindar Jord",
            email: "lindarlord100@gmail.com",
            streetAddress: "Uganda",
            city: "Icasilo",
            district: "fgfihu",
          }}
        >
             <Upload
                  name="profile"
                  showUploadList={false}
                  onChange={handleUploadChange}
                >
                  <img
                    className="w-44 h-44 rounded-full"
                    src={imageUrl}
                    alt="Profile"
                  />
                  <Button
                    className="border-none text-md text-blue-500 absolute bottom-6 flex items-center"
                    icon={<LuImagePlus size={20} className="mr-2" />}
                  >
                    Change Picture
                  </Button>
                </Upload>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Street Address"
            name="streetAddress"
            rules={[{ required: true, message: "Please enter your address" }]}
          >
            <Input placeholder="Enter your street address" />
          </Form.Item>

          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "Please enter your city" }]}
          >
            <Input placeholder="Enter your city" />
          </Form.Item>

          <Form.Item
            label="District"
            name="district"
            rules={[{ required: true, message: "Please enter your district" }]}
          >
            <Input placeholder="Enter your district" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-green-500 hover:bg-green-400 text-white"
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
