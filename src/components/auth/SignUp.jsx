"use client"
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Radio, Checkbox } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSignUpMutation } from '@/redux/fetures/auth/signUp';
import toast from 'react-hot-toast';
 
 

const SignUp = () => {

  const router = useRouter()

  const [pathName, setPathName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPathName(window.location.pathname);
    }
  }, []);

  // console.log(pathName)
  // const {data: users} = useGetUsersQuery()
  // console.log(users)

  const [register, {isLoading}] =  useSignUpMutation()


  const onFinish = async (values) => {
    // Destructure to exclude confirmPassword
    const { confirmPassword, agreement, ...formValues } = values;
    console.log('Received values of form: ', formValues);

   try{
    const res = await register(formValues).unwrap();
     console.log(res)
     if(res.code == 201){
      toast.success(res.message)
     }
     setTimeout(() => {
      router.push(`/auth/sendOtp?email=${values.email}&path=${pathName}`)
     }, 1000);
   }catch(error){
    toast.error(error.data.message)
    console.log(error.data)
   }


    
  };

  return (
    <div className="flex justify-center items-center lg:min-h-[700px] bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-[550Px]">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Your Account</h1>
        <Form
          name="signup_form"
          initialValues={{ role: 'user' }}
          onFinish={onFinish}
        >
          {/* Name and Email */}
          <div className="flex space-x-4">
            <Form.Item
              name="fullName"
              rules={[{ required: true, message: 'Please input your name!' }]}
              className="flex-1"
            >
              <Input placeholder="fullName" className="w-full p-2 border rounded" />
            </Form.Item>
            <Form.Item
              name="company"
             
              className="flex-1"
            >
              <Input placeholder="Company Name (Optional)" className="w-full p-2 border rounded" />
            </Form.Item>
          </div>

          {/* Street and Steel Name */}
          <div className="flex space-x-4">
          <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
              className="flex-1"
            >
              <Input placeholder="Email" className="w-full p-2 border rounded" />
            </Form.Item>
           
             
          </div>

          
          {/* Password */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              placeholder="Password"
              className="w-full p-2 border rounded"
            />
          </Form.Item>

          {/* Confirm Password (not logged to console) */}
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm Password"
              className="w-full p-2 border rounded"
            />
          </Form.Item>

          {/* Role Selection */}
          <Form.Item
            name="role"
            rules={[{ required: true, message: 'Please select your role!' }]}
          >
            <Radio.Group>
              <Radio value="user">User</Radio>
              <Radio value="landlord">Landlord</Radio>
            </Radio.Group>
          </Form.Item>

          {/* Agreement Checkbox */}
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              { validator: (_, value) => value ? Promise.resolve() : Promise.reject('Should accept agreement') },
            ]}
          >
            <Checkbox>
            Have read & agreed to Peared's Terms of Use and Privacy Policy.
            </Checkbox>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
           
              htmlType="submit"
            className="w-full !bg-[#2E7D32] text-white p-3 rounded "
            >
              Create Account
            </Button>
          </Form.Item>

          {/* Already have an account? Log in */}
          <div className="text-center">
            <h1>
            Already have an account?  
            <Link href="/auth/login" className="text-blue-500 hover:underline">
             Log in
            </Link>
            </h1>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;