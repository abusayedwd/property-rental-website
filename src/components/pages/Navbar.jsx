 

"use client";

import {
  DownOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Form, Input, Modal } from "antd";
import Link from "next/link";

import React, { useState } from "react";

const Navbar = () => {
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // For Change Password Modal
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // For Logout Confirmation Modal

  // Open and close modals
  const openPasswordModal = () => setIsModalOpen(true);
  const closePasswordModal = () => setIsModalOpen(false);
  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  const handleLogout = () => {
    console.log("Logging out...");
    closeLogoutModal();
    // Add your logout logic here (e.g., clear session, navigate to login page)
  };

  const changePassword = async (values) => {
    const { confirmPassword, ...ChangePassword } = values;
    console.log("Form Values: ", ChangePassword);
    // Handle password change logic here
  };

  return (
    <div>
      <nav className="bg-[#1A3459] text-white py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          {/* Logo */}
          <div className="text-2xl font-bold text-green-400">
            <Link href="/"><img src="/images/logo.png" alt="Logo" /></Link>
            
          </div>

          {/* Buttons */}
          <div className="flex items-center md:gap-3 gap-1">
            <Button className="bg-transparent text-white border-white hover:bg-white hover:text-blue-900">
              Log In
            </Button>

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
                    {
                      key: "1",
                      label: (
                        <Link href="/mypost" className="hover:!text-white">
                          MyPost
                        </Link>
                      ),
                      className: "hover:!bg-[#101625]",
                    },
                    {
                      key: "2",
                      label: (
                        <Link href="/messages" className="hover:!text-white">
                       Message
                      </Link>
                      ),
                      className: "hover:!bg-[#101625]",
                    },
                    {
                      key: "2",
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
                      key: "3",
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
                    src="/images/about.png"
                    className="mr-2 h-[52px] w-[52px]"
                  />
                  absayed <DownOutlined className="ml-1" />
                </a>
              </Dropdown>
            </div>
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
