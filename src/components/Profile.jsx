"use client";

import React, { useState } from "react";
import { Button, Input, Modal, Form, Image, Space, Upload } from "antd";
import { LuImagePlus } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
import url from "@/redux/api/baseUrl";
 
const Profile = () => {
    const [fileList, setFileList] = useState([]); 
    const [imageUrl, setImageUrl] = useState(); 
    const router = useRouter();


      const {data: profile} = useLogedUserQuery()
      // console.log(user)
      const user = profile?.data?.attributes?.user
      console.log(user)

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
        src={url + user?.image?.url}
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
            <h2 className="text-xl font-semibold text-gray-800">{user?.fullName}</h2>
            <p className="text-gray-600">{user?.email}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm text-gray-500">Street Address</label>
                <Input
                  value={user?.streetName}
                  readOnly
                  className="bg-gray-100 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">District</label>
                <Input
                  value={user?.distric}
                  readOnly
                  className="bg-gray-100 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">City</label>
                <Input
                  value={user?.city}
                  readOnly
                  className="bg-gray-100 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone Number</label>
                <Input
                  value={user?.phoneNumber}
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
 
    </div>
  );
};

export default Profile;
