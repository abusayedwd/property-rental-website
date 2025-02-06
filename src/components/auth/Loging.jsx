"use client"
import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import Link from 'next/link';
import { useLoginMutation } from '@/redux/fetures/auth/login';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

const LoginPage = () => {
const router = useRouter()

const [logingData, {isLoading}] = useLoginMutation()

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
    <div className="flex justify-center items-center lg:min-h-[700px] bg-gray-100">
      <Toaster />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full md:max-w-[500px]">
        <h1 className="text-2xl font-bold mb-6 text-center">Log In</h1>
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input placeholder="Email" className="w-full p-2 border rounded" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              placeholder="Password"
              className="w-full p-2 border rounded"
            />
          </Form.Item>
          <div className='flex justify-between items-center'>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox className="">Remember me</Checkbox>
          </Form.Item>
          <Link href="/auth/forgotPassword" className="text-blue-500 hover:underline">
              Forgot password?
            </Link>

          </div>
          <Form.Item>
            <Button
           
              htmlType="submit"
              className="w-full !bg-[#2E7D32] text-white p-3 rounded "
            >
              LOG IN
            </Button>
          </Form.Item>

          <div className=" text-center">
            
            <h1 className=''>
              Already have an account?
              <Link href="/auth/singup">

               <span className="text-blue-500 hover:underline">Create account </span> 
              </Link>
            </h1>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;