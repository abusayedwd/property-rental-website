"use client"
import React, { useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import Link from 'next/link';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { useLoginMutation } from '@/redux/fetures/auth/login';
import toast from 'react-hot-toast';
import AuthLayout, { FieldLabel, FormError, buttonClass, inputClass } from './AuthLayout';

const LoginPage = () => {
  const [error, setError] = useState('')
  const [logingData, {isLoading}] = useLoginMutation()

  const onFinish = async (values) => {
    const { remember, ...formValues } = values;
    setError('');

    try {
        const res = await logingData(formValues).unwrap();

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
    <AuthLayout
      heading="Find a place you'll love to call home"
      subheading="Sign in to pick up where you left off — saved homes, messages and your listings are waiting."
      title="Welcome back"
      subtitle="Log in to your account to continue."
    >
      <Form
        name="login_form"
        layout="vertical"
        requiredMark={false}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          label={<FieldLabel>Email address</FieldLabel>}
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input
            size="large"
            placeholder="you@example.com"
            autoComplete="email"
            prefix={<HiOutlineMail className="mr-1 text-gray-400" size={18} />}
            className={inputClass}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={<FieldLabel>Password</FieldLabel>}
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password
            size="large"
            placeholder="Enter your password"
            autoComplete="current-password"
            prefix={<HiOutlineLockClosed className="mr-1 text-gray-400" size={18} />}
            className={inputClass}
          />
        </Form.Item>

        <div className="-mt-1 mb-6 flex items-center justify-between">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox><span className="text-sm text-gray-600">Remember me</span></Checkbox>
          </Form.Item>
          <Link href="/auth/forgotPassword" className="text-sm font-medium text-primary hover:text-primaryDark hover:underline">
            Forgot password?
          </Link>
        </div>

        <FormError message={error} />

        <Button htmlType="submit" loading={isLoading} className={buttonClass}>
          Log in
        </Button>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/auth/singup" className="font-semibold text-primary hover:text-primaryDark hover:underline">
            Create account
          </Link>
        </p>
      </Form>
    </AuthLayout>
  );
};

export default LoginPage;
