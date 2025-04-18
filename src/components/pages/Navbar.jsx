 

"use client";

import url from "@/redux/api/baseUrl";
import { useChangPasswordMutation } from "@/redux/fetures/auth/changePassword";
import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
import {
  DownOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Form, Input, Modal } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // For Change Password Modal
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // For Logout Confirmation Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Open and close modals
  const openPasswordModal = () => setIsModalOpen(true);
  const closePasswordModal = () => setIsModalOpen(false);
  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);
 
  const router = useRouter()
  const {data: user} = useLogedUserQuery()
  // console.log(user)
 
  
    const role = user?.data?.attributes?.user?.role;
    // console.log(role)

    const [changePasswordd, {isLoading}] = useChangPasswordMutation()


    const handleLogout = () => {
      console.log("Logging out...");
  
      // Remove user session data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
  
      closeLogoutModal();  
      setTimeout(() => {
        window.location.href = "/";
    }, 500);
  
     
  };
  
  



  const changePassword = async (values) => {
    const { confirmPassword, ...ChangePassword } = values;
    console.log("Form Values: ", ChangePassword);
     try{
      const res = await changePasswordd(ChangePassword).unwrap();
       console.log(res);
       if(res?.code == 200){
        toast.success(res?.message)
        closePasswordModal(true)
        router.push('/')

       }
     }catch(error){
       console.log(error)
        setError(error?.data?.message)
     }
  };





  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  return (
    <div>
      <nav className="bg-[#222F55] text-white py-4">
        <Toaster />
        <div className="md:container mx-auto flex items-center justify-between px-4">
          {/* Logo */}
          <div className="text-2xl font-bold text-green-400">
            <Link href="/"><img className="md:w-full w-48" src="/images/logo.png" alt="Logo"/></Link>
            
          </div>
         <ThemeToggle/>
          {/* Buttons */}
          <div className="flex items-center md:gap-3 gap-1">
  {user ? (
    <div>
      <Dropdown
        className="px-2"
        menu={{
          items: [
            {
              key: "1",
              label: (
                <Link href="/profile" className="hover:!text-white">
                  Profile
                </Link>
              ),
              className: "hover:!bg-[#101625]",
            },
            ...(user?.data?.attributes?.user?.role === "landlord"
              ? [
                  {
                    key: "2",
                    label: (
                      <Link href="/myproperty" className="hover:!text-white">
                        My Property
                      </Link>
                    ),
                    className: "hover:!bg-[#101625]",
                  },
                ]
              : []),
            {
              key: "3",
              label: (
                <Link href="/messages" className="hover:!text-white">
                  Message
                </Link>
              ),
              className: "hover:!bg-[#101625]",
            },
            {
              key: "4",
              label: (
                <span
                  onClick={openPasswordModal}
                  className="hover:!text-white cursor-pointer"
                >
                  Change Password
                </span>
              ),
              className: "hover:!bg-[#101625]",
            },
            {
              key: "5",
              label: (
                <span
                  onClick={openLogoutModal}
                  className="hover:!text-white cursor-pointer"
                >
                  Logout
                </span>
              ),
              className: "hover:!bg-[#101625]",
            },
          ],
        }}
        trigger={["click"]}
      >
        <a className="flex items-center text-white cursor-pointer">
          <Avatar
            src={url + user?.data?.attributes?.user?.image?.url}
            className="mr-2 h-[52px] w-[52px]"
          />
          {user?.data?.attributes?.user?.fullName} <DownOutlined className="ml-1" />
        </a>
      </Dropdown>
    </div>
  ) : (
    <div>
      <Link href="/auth/login">
        <Button className="bg-transparent text-white border-white hover:bg-white hover:text-blue-900">
          Log In
        </Button>
      </Link>
    </div>
  )}
</div>

        </div>

        {/* Change Password Modal */}
        <Modal
          open={isModalOpen}
          onOk={closePasswordModal}
          onCancel={closePasswordModal}
          footer={null}
        >
          <div className="flex flex-col w-[80%] mx-auto ">
            <h2 className="text-[28px] text-left font-semibold mb-4">
              Change Password
            </h2>
            <p className="mb-8 text-gray-600">
              Your password must be 8-10 characters long.
            </p>
            <Form
              name="changePassword"
              layout="vertical"
              onFinish={changePassword}
            >
              <Form.Item
                name="oldPassword"
                label="Old Password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your old password!",
                  },
                ]}
              >
                <Input.Password
                  style={{
                    height: "40px",
                    background: "#E6F9EF",
                    border: "1px solid green",
                  }}
                  placeholder="Old Password"
                  prefix={<LockOutlined />}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your new password!",
                  },
                ]}
              >
                <Input.Password
                  style={{
                    height: "40px",
                    background: "#E6F9EF",
                    border: "1px solid green",
                  }}
                  placeholder="New Password"
                  prefix={<LockOutlined />}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={["newPassword"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The two passwords that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  style={{
                    height: "40px",
                    background: "#E6F9EF",
                    border: "1px solid green",
                  }}
                  placeholder="Confirm Password"
                  prefix={<LockOutlined />}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
              <p className="text-red-500 font-medium">{error}</p>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full h-10 py-3 !bg-[#69C0BE] !text-black text-[16px] rounded-md"
                >
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>

        {/* Logout Confirmation Modal */}
        <Modal
          open={isLogoutModalOpen}
          onCancel={closeLogoutModal}
          footer={null}
          centered
        >
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-center gap-4">
              <Button
                type="primary"
                className="bg-green-600 hover:bg-green-500 text-white"
                onClick={handleLogout}
              >
                Yes
              </Button>
              <Button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                onClick={closeLogoutModal}
              >
                No
              </Button>
            </div>
          </div>
        </Modal>
      </nav>
    </div>
  );
};

export default Navbar;
 