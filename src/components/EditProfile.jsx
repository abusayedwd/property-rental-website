// "use client";

// import React, { useState } from "react";
// import { Form, Input, Button, Upload } from "antd";
// import { CameraOutlined } from "@ant-design/icons";
// import { LuImagePlus } from "react-icons/lu";

// const EditProfile = () => {
//    // Default profile picture
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState([]);
 
//   const [imageUrl, setImageUrl] = useState('/images/user4.jpg');
//   // Handle image upload
//   const handleUploadChange = ({ fileList: newFileList }) => {
//     setFileList(newFileList);
//     if (newFileList[0]?.originFileObj) {
//       const reader = new FileReader();
//       reader.readAsDataURL(newFileList[0].originFileObj);
//       reader.onload = () => setImageUrl(reader.result);
//     }
//   };


  
//   // Handle form submission
//   const handleSave = (values) => {
//     console.log("Updated Profile Data:", values);
//     console.log("Updated Profile Picture:", fileList[0]?.originFileObj);
//     // Add save logic here
//   };

//   return (
//     <div className="w-full max-w-2xl mx-auto py-12 px-4 md:px-8">
//       <h1 className="text-2xl md:text-3xl font-bold text-center text-green-700 mb-8">
//         Edit Profile
//       </h1>

//       <div className="bg-white shadow-md rounded-lg p-6">
//         <div className="flex flex-col items-center mb-6">
//           {/* Profile Picture with Upload Overlay */}
//           <div className="relative">
  
//         <Upload
//         name="profile"
//         showUploadList={false}
//         onChange={handleUploadChange}
//       >
//         <img
//           className="w-44 h-44 rounded-full"
//           src={ imageUrl}
//           alt="Profile"
//         />
//         <Button
//           className="border-none text-md text-blue-500 absolute bottom-6 flex items-center"
//           icon={<LuImagePlus size={20} className="mr-2" />}
//         >
//           Change Picture
//         </Button>
//       </Upload>
//           </div>
//         </div>

//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={handleSave}
//           initialValues={{
//             name: "Uganda",
//             streetAddress: "Uganda",
//             city: "Icasilo",
//             district: "Furio",
//           }}
//         >
//           {/* Edit Name */}
//           <Form.Item
//             label="Edit Name"
//             name="name"
//             rules={[{ required: true, message: "Please enter your name" }]}
//           >
//             <Input placeholder="Enter your name" className="rounded-md" />
//           </Form.Item>

//           {/* Street Address */}
//           <Form.Item
//             label="Street Address"
//             name="streetAddress"
//             rules={[
//               { required: true, message: "Please enter your street address" },
//             ]}
//           >
//             <Input placeholder="Enter your street address" className="rounded-md" />
//           </Form.Item>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* City */}
//             <Form.Item
//               label="City"
//               name="city"
//               rules={[{ required: true, message: "Please enter your city" }]}
//             >
//               <Input placeholder="Enter your city" className="rounded-md" />
//             </Form.Item>

//             {/* District */}
//             <Form.Item
//               label="District"
//               name="district"
//               rules={[{ required: true, message: "Please enter your district" }]}
//             >
//               <Input placeholder="Enter your district" className="rounded-md" />
//             </Form.Item>
//           </div>

//           {/* Save Changes Button */}
//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               className="w-full bg-green-600 hover:bg-green-500 text-white rounded-md"
//             >
//               Save Change
//             </Button>
//           </Form.Item>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default EditProfile;

"use client";

import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { LuImagePlus } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
import url from "@/redux/api/baseUrl";
import { useEditProfileMutation } from "@/redux/fetures/user/editProfile";
import toast, { Toaster } from "react-hot-toast";

const EditProfile = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { data: profile, refetch } = useLogedUserQuery(); // Fetch user data
  const user = profile?.data?.attributes?.user;
  const id = user?.id;

  // Image and File State
  const [imageUrl, setImageUrl] = useState("/images/user4.jpg"); // Default image
  const [file, setFile] = useState(null);

  const [updateProfile, { isLoading }] = useEditProfileMutation();

  // **Set Initial Values when User Data is Fetched**
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.fullName || "",
        company: user.company || "",
        // city: user.city || "",
        // district: user.distric || "",
        phoneNumber: user.phoneNumber || "", // Fix: Ensure correct field name
      });

      // Set user profile image dynamically
      if (user?.image?.url) {
        setImageUrl(url + user.image.url);
      }
    }
  }, [user, form]);

  // **Handle Image Upload**
  const handleUploadChange = ({ fileList }) => {
    if (fileList.length > 0) {
      const fileObj = fileList[0]?.originFileObj;
      if (fileObj) {
        const reader = new FileReader();
        reader.readAsDataURL(fileObj);
        reader.onload = () => setImageUrl(reader.result);
        setFile(fileObj); // Store file for upload
      }
    }
  };

  // **Handle Form Submission**
  const handleSave = async (values) => {
    try {
      const formData = new FormData();
      formData.append("fullName", values.name);
      formData.append("company", values.company);
      // formData.append("city", values.city);
      // formData.append("district", values.district);
      formData.append("phoneNumber", values.phoneNumber); // Fix: Ensure phoneNumber is updated
      if (file) {
        formData.append("image", file);
      }

      // Call API
      const response = await updateProfile({ formData, id }).unwrap();
      console.log("Profile Update Response:", response);

      if (response?.code === 200) {
        toast.success(response?.message);
        refetch(); // Refresh the profile after update
        setTimeout(() => {
          router.push("/profile");
        }, 1000); // Delay redirection for toast display
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      message.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4 md:px-8">
      <Toaster />
      <h1 className="text-2xl md:text-3xl font-bold text-center text-green-700 mb-8">
        Edit Profile
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col items-center mb-6">
          {/* Profile Picture with Upload Overlay */}
          <div className="relative">
            <Upload name="profile" showUploadList={false} beforeUpload={() => false} onChange={handleUploadChange}>
              <img className="w-44 h-44 rounded-full" src={imageUrl} alt="Profile" />
              <Button className="border-none text-md text-blue-500 absolute bottom-6 flex items-center" icon={<LuImagePlus size={20} className="mr-2" />}>
                Change Picture
              </Button>
            </Upload>
          </div>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSave}>
          {/* Edit Name */}
          <Form.Item label="Edit Name" name="name" rules={[{ required: true, message: "Please enter your name" }]}>
            <Input placeholder="Enter your name" className="rounded-md" />
          </Form.Item>

          {/* Street Address */}
          <Form.Item label="Company" name="company" >
            <Input placeholder="Enter your street address" className="rounded-md" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* City */}
            {/* <Form.Item label="City" name="city" rules={[{ required: true, message: "Please enter your city" }]}>
              <Input placeholder="Enter your city" className="rounded-md" />
            </Form.Item> */}

            {/* District */}
            {/* <Form.Item label="District" name="district" rules={[{ required: true, message: "Please enter your district" }]}>
              <Input placeholder="Enter your district" className="rounded-md" />
            </Form.Item> */}

            {/* Phone Number */}
            <Form.Item label="Phone Number" name="phoneNumber">
              <Input placeholder="Enter your phone number" className="rounded-md" />
            </Form.Item>
          </div>

          {/* Save Changes Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} className="w-full bg-green-600 hover:bg-green-500 text-white rounded-md">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EditProfile;
