

 
// "use client";

// import url from "@/redux/api/baseUrl";
// import { useChangPasswordMutation } from "@/redux/fetures/auth/changePassword";
// import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
// import {
//   DownOutlined,
//   EyeInvisibleOutlined,
//   EyeTwoTone,
//   LockOutlined,
//   MenuOutlined,
//   CloseOutlined
// } from "@ant-design/icons";
// import { Avatar, Button, Dropdown, Form, Input, Modal } from "antd";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";
// import toast, { Toaster } from "react-hot-toast";

// const Navbar = () => {
//   const [error, setError] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false); // For Change Password Modal
//   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // For Logout Confirmation Modal
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // For Mobile Menu

//   const router = useRouter();
//   const { data: user } = useLogedUserQuery();
//   const [changePasswordd, { isLoading }] = useChangPasswordMutation();

//   const openPasswordModal = () => setIsModalOpen(true);
//   const closePasswordModal = () => setIsModalOpen(false);
//   const openLogoutModal = () => setIsLogoutModalOpen(true);
//   const closeLogoutModal = () => setIsLogoutModalOpen(false);
//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

//   const handleLogout = () => {
//     console.log("Logging out...");
//     // Remove user session data
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     closeLogoutModal();
//     setTimeout(() => {
//       window.location.href = "/";
//     }, 500);
//   };

//   const changePassword = async (values) => {
//     const { confirmPassword, ...ChangePassword } = values;
//     console.log("Form Values: ", ChangePassword);
//     try {
//       const res = await changePasswordd(ChangePassword).unwrap();
//       console.log(res);
//       if (res?.code === 200) {
//         toast.success(res?.message);
//         closePasswordModal(true);
//         router.push("/");
//       }
//     } catch (error) {
//       console.log(error);
//       setError(error?.data?.message);
//     }
//   };

//   // User dropdown menu items
//   const userMenuItems = [
//     {
//       key: "1",
//       label: (
//         <Link href="/profile" className="hover:!text-white">
//           Profile
//         </Link>
//       ),
//       className: "hover:!bg-[#101625]",
//     },
//     ...(user?.data?.attributes?.user?.role === "landlord"
//       ? [
//           {
//             key: "2",
//             label: (
//               <Link href="/myproperty" className="hover:!text-white">
//                 My Property
//               </Link>
//             ),
//             className: "hover:!bg-[#101625]",
//           },
//         ]
//       : []),
//     {
//       key: "3",
//       label: (
//         <Link href="/messages" className="hover:!text-white">
//           Message
//         </Link>
//       ),
//       className: "hover:!bg-[#101625]",
//     },
//     {
//       key: "4",
//       label: (
//         <span
//           onClick={openPasswordModal}
//           className="hover:!text-white cursor-pointer"
//         >
//           Change Password
//         </span>
//       ),
//       className: "hover:!bg-[#101625]",
//     },
//     {
//       key: "5",
//       label: (
//         <span
//           onClick={openLogoutModal}
//           className="hover:!text-white cursor-pointer"
//         >
//           Logout
//         </span>
//       ),
//       className: "hover:!bg-[#101625]",
//     },
//   ];

//   return (
//     <div>
//       <nav className="bg-[#222F55] text-white py-4">
//         <Toaster />
//         <div className="md:container mx-auto px-4">
//           <div className="flex justify-between items-center">
//             {/* Logo */}
//             <div className="text-2xl font-bold text-green-400 z-10">
//               <Link href="/">
//                 <img className="md:w-full w-48" src="/images/logo.png" alt="Logo" />
//               </Link>
            
//             </div>
      
    
        


//             {/* Desktop Menu - Centered */}
//             <div className="hidden md:flex items-center justify-center flex-1">
//               <div className="flex space-x-6">
//                 <Link href="/" className="text-white px-4 py-2">
//                   Home
//                 </Link>
//                 <Link href="/aboutus" className="text-white px-4 py-2">
//                   About Us
//                 </Link>
//                 <Link href="/property" className="text-white px-4 py-2">
//                   Property
//                 </Link>
//                 <Link href="/contact" className="text-white px-4 py-2">
//                   Contact
//                 </Link>
//                 <Link href="/blog" className="text-white px-4 py-2">
//                   Blog
//                 </Link>
//               </div>
//             </div>

//             {/* User Profile/Login (Right side) */}
//             <div className="flex items-center z-10">
//               {user ? (
//                 <Dropdown
//                   menu={{ items: userMenuItems }}
//                   trigger={["click"]}
//                   className="md:flex"
//                 >
//                   <a className="flex items-center text-white cursor-pointer">
//                     <Avatar
//                       src={url + user?.data?.attributes?.user?.image?.url}
//                       className="mr-2 h-[52px] w-[52px]"
//                     />
//                     <span className="mr-1 hidden md:inline-block">{user?.data?.attributes?.user?.fullName}</span>
//                     <DownOutlined className="hidden md:inline-block" />
//                   </a>
//                 </Dropdown>
//               ) : (
//                 <Link href="/auth/login" className="hidden md:block">
//                   <Button className="bg-transparent text-white border-white hover:bg-white hover:text-blue-900">
//                     Log In
//                   </Button>
//                 </Link>
//               )}
              
//               {/* Mobile Menu Button */}
//               <button
//                 className="md:hidden text-white ml-4 text-2xl"
//                 onClick={toggleMobileMenu}
//                 aria-label="Toggle menu"
//               >
//                 {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
//               </button>
//             </div>
//           </div>
          
//           {/* Mobile Menu Dropdown */}
//           {isMobileMenuOpen && (
//             <div className="md:hidden bg-[#222F55] py-4 absolute left-0 right-0 top-[72px] z-50 shadow-md border-t border-gray-700">
//               <div className="px-4 space-y-3">
//                 {/* Navigation Links */}
//                 <Link href="/" className="block text-white py-2">
//                   Home
//                 </Link>
//                 <Link href="/aboutus" className="block text-white py-2">
//                   About
//                 </Link>
//                 <Link href="/property" className="block text-white py-2">
//                   Property
//                 </Link>
//                 <Link href="/contact" className="block text-white py-2">
//                   Contact
//                 </Link>
//                 <Link href="/blog" className="block text-white py-2">
//                   Blog
//                 </Link>
                
//               </div>
//             </div>
//           )}
//         </div>
//       </nav>

//       {/* Change Password Modal */}
//       <Modal
//         open={isModalOpen}
//         onOk={closePasswordModal}
//         onCancel={closePasswordModal}
//         footer={null}
//       >
//         <div className="flex flex-col w-[80%] mx-auto">
//           <h2 className="text-[28px] text-left font-semibold mb-4">
//             Change Password
//           </h2>
//           <p className="mb-8 text-gray-600">
//             Your password must be 8-10 characters long.
//           </p>
//           <Form name="changePassword" layout="vertical" onFinish={changePassword}>
//             <Form.Item
//               name="oldPassword"
//               label="Old Password"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please enter your old password!",
//                 },
//               ]}
//             >
//               <Input.Password
//                 style={{
//                   height: "40px",
//                   background: "#E6F9EF",
//                   border: "1px solid green",
//                 }}
//                 placeholder="Old Password"
//                 prefix={<LockOutlined />}
//                 iconRender={(visible) =>
//                   visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
//                 }
//               />
//             </Form.Item>

//             <Form.Item
//               name="newPassword"
//               label="New Password"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please enter your new password!",
//                 },
//               ]}
//             >
//               <Input.Password
//                 style={{
//                   height: "40px",
//                   background: "#E6F9EF",
//                   border: "1px solid green",
//                 }}
//                 placeholder="New Password"
//                 prefix={<LockOutlined />}
//                 iconRender={(visible) =>
//                   visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
//                 }
//               />
//             </Form.Item>

//             <Form.Item
//               name="confirmPassword"
//               label="Confirm Password"
//               dependencies={["newPassword"]}
//               hasFeedback
//               rules={[
//                 {
//                   required: true,
//                   message: "Please confirm your new password!",
//                 },
//                 ({ getFieldValue }) => ({
//                   validator(_, value) {
//                     if (!value || getFieldValue("newPassword") === value) {
//                       return Promise.resolve();
//                     }
//                     return Promise.reject(
//                       new Error("The two passwords that you entered do not match!")
//                     );
//                   },
//                 }),
//               ]}
//             >
//               <Input.Password
//                 style={{
//                   height: "40px",
//                   background: "#E6F9EF",
//                   border: "1px solid green",
//                 }}
//                 placeholder="Confirm Password"
//                 prefix={<LockOutlined />}
//                 iconRender={(visible) =>
//                   visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
//                 }
//               />
//             </Form.Item>
//             <p className="text-red-500 font-medium">{error}</p>
//             <Form.Item>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 className="w-full h-10 py-3 !bg-[#69C0BE] !text-black text-[16px] rounded-md"
//               >
//                 Change Password
//               </Button>
//             </Form.Item>
//           </Form>
//         </div>
//       </Modal>

//       {/* Logout Confirmation Modal */}
//       <Modal
//         open={isLogoutModalOpen}
//         onCancel={closeLogoutModal}
//         footer={null}
//         centered
//       >
//         <div className="text-center">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">
//             Are you sure you want to logout?
//           </h2>
//           <div className="flex justify-center gap-4">
//             <Button
//               type="primary"
//               className="bg-green-600 hover:bg-green-500 text-white"
//               onClick={handleLogout}
//             >
//               Yes
//             </Button>
//             <Button
//               className="bg-gray-200 hover:bg-gray-300 text-gray-700"
//               onClick={closeLogoutModal}
//             >
//               No
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default Navbar;


"use client";

import url from "@/redux/api/baseUrl";
import { useChangPasswordMutation } from "@/redux/fetures/auth/changePassword";
import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
import {
  DownOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  MenuOutlined,
  CloseOutlined
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Form, Input, Modal } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Navbar = () => {
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // For Change Password Modal
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // For Logout Confirmation Modal
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // For Mobile Menu

  const router = useRouter();
  const { data: user } = useLogedUserQuery();
  const [changePasswordd, { isLoading }] = useChangPasswordMutation();

  const openPasswordModal = () => setIsModalOpen(true);
  const closePasswordModal = () => setIsModalOpen(false);
  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  // Close mobile menu when navigation occurs
  const handleNavigation = () => {
    setIsMobileMenuOpen(false);
  };

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
    try {
      const res = await changePasswordd(ChangePassword).unwrap();
      console.log(res);
      if (res?.code === 200) {
        toast.success(res?.message);
        closePasswordModal(true);
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      setError(error?.data?.message);
    }
  };

  // User dropdown menu items
  const userMenuItems = [
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
  ];

  return (
    <div>
      <nav className="bg-[#222F55] text-white py-4">
        <Toaster />
        <div className="md:container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="text-2xl font-bold text-green-400 z-10">
              <Link href="/">
                <img className="md:w-full w-48" src="/images/logo.png" alt="Logo" />
              </Link>
            </div>

            {/* Desktop Menu - Centered */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <div className="flex space-x-6">
                <Link href="/" className="text-white px-4 py-2">
                  Home
                </Link>
                <Link href="/aboutus" className="text-white px-4 py-2">
                  About
                </Link>
                <Link href="/property" className="text-white px-4 py-2">
                  Property
                </Link>
                <Link href="/contact" className="text-white px-4 py-2">
                  Contact
                </Link>
                <Link href="/blog" className="text-white px-4 py-2">
                  Blog
                </Link>
              </div>
            </div>

            {/* User Profile/Login (Right side) */}
            <div className="flex items-center z-10">
              {user ? (
                <Dropdown
                  menu={{ items: userMenuItems }}
                  trigger={["click"]}
                  className="md:flex"
                >
                  <a className="flex items-center text-white cursor-pointer">
                    <Avatar
                      src={url + user?.data?.attributes?.user?.image?.url}
                      className="mr-2 h-[52px] w-[52px]"
                    />
                    <span className="mr-1 hidden md:inline-block">{user?.data?.attributes?.user?.fullName}</span>
                    <DownOutlined className="hidden md:inline-block" />
                  </a>
                </Dropdown>
              ) : (
                <Link href="/auth/login" className="hidden md:block">
                  <Button className="bg-transparent text-white border-white hover:bg-white hover:text-blue-900">
                    Log In
                  </Button>
                </Link>
              )}
              
              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-white ml-4 text-2xl"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu Dropdown - Positioned to slide from right */}
          <div 
            className={`md:hidden fixed top-0 right-0 h-full bg-[#222F55] w-64 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex justify-end p-4">
              <button 
                onClick={toggleMobileMenu}
                className="text-white text-2xl"
              >
                <CloseOutlined />
              </button>
            </div>
            <div className="px-4 space-y-3 pt-10">
              {/* Navigation Links with click handler to close menu */}
              <Link href="/" className="block text-white py-2" onClick={handleNavigation}>
                Home
              </Link>
              <Link href="/aboutus" className="block text-white py-2" onClick={handleNavigation}>
                About
              </Link>
              <Link href="/property" className="block text-white py-2" onClick={handleNavigation}>
                Property
              </Link>
              <Link href="/contact" className="block text-white py-2" onClick={handleNavigation}>
                Contact
              </Link>
              <Link href="/blog" className="block text-white py-2" onClick={handleNavigation}>
                Blog
              </Link>
              
              {/* Show login button in mobile menu if user not logged in */}
              {!user && (
                <Link href="/auth/login" className="block mt-6" onClick={handleNavigation}>
                  <Button className="bg-transparent text-white border-white hover:bg-white hover:text-blue-900 w-full">
                    Log In
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          {/* Overlay to close menu when clicking outside */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={toggleMobileMenu}
            ></div>
          )}
        </div>
      </nav>

      {/* Change Password Modal */}
      <Modal
        open={isModalOpen}
        onOk={closePasswordModal}
        onCancel={closePasswordModal}
        footer={null}
      >
        <div className="flex flex-col w-[80%] mx-auto">
          <h2 className="text-[28px] text-left font-semibold mb-4">
            Change Password
          </h2>
          <p className="mb-8 text-gray-600">
            Your password must be 8-10 characters long.
          </p>
          <Form name="changePassword" layout="vertical" onFinish={changePassword}>
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
                      new Error("The two passwords that you entered do not match!")
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
    </div>
  );
};

export default Navbar;