"use client"; // Required for using Ant Design components in Next.js 13+

import { useForgotPasswordMutation } from "@/redux/fetures/auth/forgotPassword";
import { Form, Input, Button } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineMail, HiOutlineLockOpen } from "react-icons/hi";
import AuthLayout, { FieldLabel, FormError, buttonClass, inputClass } from "./AuthLayout";

export default function ForgotPassword() {
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const router = useRouter();
  const [pathName, setPathName] = useState("");

  const [passwordForgot, { isLoading }] = useForgotPasswordMutation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPathName(window.location.pathname);
    }
  }, []);

  const onFinish = async (values) => {
    setError("");
    try {
      const res = await passwordForgot(values).unwrap();
      if (res?.code == 200) {
        toast.success(res?.message);
        router.push(`/auth/sendOtp?email=${values.email}&path=${pathName}`);
      }
    } catch (error) {
      setError(error?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <AuthLayout
      image="/images/appr.jpg"
      heading="Locked out? It happens."
      subheading="We'll email you a one-time code so you can set a new password and get back to your account."
      highlights={[]}
      icon={<HiOutlineLockOpen size={24} />}
      title="Forgot password?"
      subtitle="Enter the email linked to your account and we'll send you a verification code."
      backHref="/auth/login"
      backLabel="Back to login"
    >
      <Form form={form} name="forgot-password" layout="vertical" requiredMark={false} onFinish={onFinish}>
        <Form.Item
          name="email"
          label={<FieldLabel>Email address</FieldLabel>}
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
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

        <FormError message={error} />

        <Button htmlType="submit" loading={isLoading} className={buttonClass}>
          Send code
        </Button>

        <p className="mt-8 text-center text-sm text-gray-600">
          Remembered it?{" "}
          <Link href="/auth/login" className="font-semibold text-primary hover:text-primaryDark hover:underline">
            Log in
          </Link>
        </p>
      </Form>
    </AuthLayout>
  );
}
