// "use client"
// import React, { useState } from 'react';
// import { Form, Input, Button, Checkbox } from 'antd';
// import Link from 'next/link';
// import { useLoginMutation } from '@/redux/fetures/auth/login';
// import { useRouter } from 'next/navigation';
// import toast, { Toaster } from 'react-hot-toast';

// const LoginPage = () => {
// const router = useRouter()
// const [error, setError] = useState(' ')
// const [logingData, {isLoading}] = useLoginMutation()

// const onFinish = async (values) => {
//   const { remember, ...formValues } = values;
//   console.log("Received values of form: ", formValues);
  
//   try {
//       const res = await logingData(formValues).unwrap();
//       console.log(res);

//       if (res?.code === 200) {
//           toast.success(res?.message);
//           localStorage.setItem("token", res?.data?.attributes?.tokens?.access?.token);
//           localStorage.setItem("user", JSON.stringify(res?.data));

//           // Force reload and redirect to root
//           setTimeout(() => {
//               window.location.href = "/";
//           }, 500);
//       }
//   } catch (error) {
//       setError(error?.data?.message || "An unexpected error occurred. Please try again.");
//   }
// };


//   return (
//     <div className="flex justify-center items-center lg:min-h-[700px] bg-gray-100">
//       <Toaster />
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full md:max-w-[500px]">
//         <h1 className="text-2xl font-bold mb-6 text-center">Log In</h1>
//         <Form
//           name="login_form"
//           initialValues={{ remember: true }}
//           onFinish={onFinish}
//         >
//           <Form.Item
//             name="email"
//             rules={[{ required: true, message: 'Please input your email!' }]}
//           >
//             <Input placeholder="Email" className="w-full p-2 border rounded" />
//           </Form.Item>

//           <Form.Item
//             name="password"
//             rules={[{ required: true, message: 'Please input your password!' }]}
//           >
//             <Input.Password
//               placeholder="Password"
//               className="w-full p-2 border rounded"
//             />
//           </Form.Item>
//           <div className='flex justify-between items-center'>
//           <Form.Item name="remember" valuePropName="checked">
//             <Checkbox className="">Remember me</Checkbox>
//           </Form.Item>
//           <Link href="/auth/forgotPassword" className="text-blue-500 hover:underline">
//               Forgot password?
//             </Link>

//           </div>
//           <p className=' text-red-500'>{error}</p>
//           <Form.Item>
//             <Button
           
//               htmlType="submit"
//               className="w-full !bg-[#2E7D32] text-white p-3 rounded "
//             >
//               LOG IN
//             </Button>
//           </Form.Item>

//           <div className=" text-center">
            
//             <h1 className=''>
//             Don’t have an Account?  
//               <Link href="/auth/singup">

//                <span className="text-blue-500 hover:underline"> Create Account</span> 
//               </Link>
//             </h1>
//           </div>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


"use client"
import React, { useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import Link from 'next/link';
import { useLoginMutation } from '@/redux/fetures/auth/login';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import bg from "@/../../public/images/bg.jpg"

const LoginPage = () => {
  const router = useRouter()
  const [error, setError] = useState(' ')
  const [logingData, {isLoading}] = useLoginMutation()
  const images = "/images/bg.jpg"
  const onFinish = async (values) => {
    const { remember, ...formValues } = values;
    console.log("Received values of form: ", formValues);
    
    try {
        const res = await logingData(formValues).unwrap();
        console.log(res);

        if (res?.code === 200) {
            toast.success(res?.message);
            localStorage.setItem("token", res?.data?.attributes?.tokens?.access?.token);
            localStorage.setItem("user", JSON.stringify(res?.data));

            // Force reload and redirect to root
            setTimeout(() => {
                window.location.href = "/";
            }, 500);
        }
    } catch (error) {
        setError(error?.data?.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className=" min-h-screen">
      <Toaster />
      
      {/* Left Section - Image */}
      <div className="hidden lg:flex lg:w-3/5 bg-cover bg-center" 
           style={{ backgroundImage: "url(`${images}`)" }}>
      </div>
      
      {/* Right Section - Login Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-6">
        <div className="bg-gray-800 rounded p-8 w-full max-w-md">
          <Form
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            className="text-gray-300"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input 
                placeholder="USERNAME OR EMAIL ADDRESS" 
                className="bg-transparent border border-gray-600 rounded p-2 text-gray-300"
                prefix={<span className="text-gray-400 pr-2">👤</span>}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                placeholder="PASSWORD"
                className="bg-transparent border border-gray-600 rounded p-2 text-gray-300"
                prefix={<span className="text-gray-400 pr-2">🔒</span>}
              />
            </Form.Item>
            
            <div className="flex justify-between items-center mb-4">
              <Form.Item name="remember" valuePropName="checked" className="mb-0">
                <Checkbox className="text-gray-300">Remember me</Checkbox>
              </Form.Item>
              <Link href="/auth/forgotPassword" className="text-gray-300 hover:text-white">
                Lost password
              </Link>
            </div>
            
            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            <Form.Item className="mb-4">
              <Button
                htmlType="submit"
                loading={isLoading}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white border-none h-10 rounded"
              >
                Login
              </Button>
            </Form.Item>

            <div className="text-center text-gray-300">
              <p>
                Don't have an Account?{" "}
                <Link href="/auth/singup">
                  <span className="text-gray-300 hover:text-white">Create Account</span>
                </Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;