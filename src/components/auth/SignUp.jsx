"use client"
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineOfficeBuilding, HiOutlineHome, HiOutlineKey } from 'react-icons/hi';
import { useSignUpMutation } from '@/redux/fetures/auth/signUp';
import toast from 'react-hot-toast';
import AuthLayout, { FieldLabel, FormError, buttonClass, inputClass } from './AuthLayout';

// Mirrors the server rule: at least 8 characters, 1 letter and 1 number
export const passwordRules = [
  { required: true, message: 'Please enter a password' },
  { min: 8, message: 'Password must be at least 8 characters' },
  { pattern: /^(?=.*[A-Za-z])(?=.*\d).+$/, message: 'Password must contain at least 1 letter and 1 number' },
];

const roles = [
  { value: 'user', label: 'Tenant / Buyer', description: 'Looking for a home', icon: HiOutlineHome },
  { value: 'landlord', label: 'Landlord', description: 'Listing a property', icon: HiOutlineKey },
];

const RoleSelect = ({ value, onChange }) => (
  <div className="grid grid-cols-2 gap-3" role="radiogroup">
    {roles.map(({ value: roleValue, label, description, icon: Icon }) => {
      const selected = value === roleValue;
      return (
        <button
          key={roleValue}
          type="button"
          role="radio"
          aria-checked={selected}
          onClick={() => onChange?.(roleValue)}
          className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-all ${
            selected
              ? 'border-primary bg-secondary ring-1 ring-primary'
              : 'border-gray-200 bg-gray-50 hover:border-gray-300'
          }`}
        >
          <span className={`mt-0.5 ${selected ? 'text-primaryDark' : 'text-gray-400'}`}>
            <Icon size={20} />
          </span>
          <span>
            <span className="block text-sm font-semibold text-navy">{label}</span>
            <span className="block text-xs text-gray-500">{description}</span>
          </span>
        </button>
      );
    })}
  </div>
);

const SignUp = () => {
  const router = useRouter()
  const [error, setError] = useState('')
  const [pathName, setPathName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPathName(window.location.pathname);
    }
  }, []);

  const [register, {isLoading}] =  useSignUpMutation()

  const onFinish = async (values) => {
    // Exclude confirmPassword/agreement and empty optional fields
    const { confirmPassword, agreement, ...rest } = values;
    const formValues = Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined && v !== ''));
    setError('');

    try {
      const res = await register(formValues).unwrap();
      if (res.code == 201) {
        toast.success(res.message)
      }
      setTimeout(() => {
        router.push(`/auth/sendOtp?email=${values.email}&path=${pathName}`)
      }, 1000);
    } catch (error) {
      setError(error?.data?.message || 'Could not create your account. Please try again.')
    }
  };

  return (
    <AuthLayout
      wide
      image="/images/premium.jpg"
      heading="Join a community of renters and landlords"
      subheading="Create a free account to list properties, save favourites and talk to owners directly."
      title="Create your account"
      subtitle="It only takes a minute to get started."
    >
      <Form
        name="signup_form"
        layout="vertical"
        requiredMark={false}
        initialValues={{ role: 'user' }}
        onFinish={onFinish}
      >
        <Form.Item
          name="role"
          label={<FieldLabel>I am a</FieldLabel>}
          rules={[{ required: true, message: 'Please select your role' }]}
        >
          <RoleSelect />
        </Form.Item>

        <div className="grid gap-x-4 md:grid-cols-2">
          <Form.Item
            name="fullName"
            label={<FieldLabel>Full name</FieldLabel>}
            rules={[{ required: true, whitespace: true, message: 'Please enter your name' }]}
          >
            <Input
              size="large"
              placeholder="John Doe"
              autoComplete="name"
              prefix={<HiOutlineUser className="mr-1 text-gray-400" size={18} />}
              className={inputClass}
            />
          </Form.Item>
          <Form.Item
            name="company"
            label={<FieldLabel>Company <span className="font-normal text-gray-400">(optional)</span></FieldLabel>}
          >
            <Input
              size="large"
              placeholder="Company name"
              autoComplete="organization"
              prefix={<HiOutlineOfficeBuilding className="mr-1 text-gray-400" size={18} />}
              className={inputClass}
            />
          </Form.Item>
        </div>

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

        <div className="grid gap-x-4 md:grid-cols-2">
          <Form.Item
            name="password"
            label={<FieldLabel>Password</FieldLabel>}
            rules={passwordRules}
          >
            <Input.Password
              size="large"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              prefix={<HiOutlineLockClosed className="mr-1 text-gray-400" size={18} />}
              className={inputClass}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={<FieldLabel>Confirm password</FieldLabel>}
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Re-enter password"
              autoComplete="new-password"
              prefix={<HiOutlineLockClosed className="mr-1 text-gray-400" size={18} />}
              className={inputClass}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Please accept the terms to continue')) },
          ]}
        >
          <Checkbox>
            <span className="text-sm text-gray-600">
              I agree to the{" "}
              <Link href="/terms" className="font-medium text-primary hover:underline">Terms of Use</Link>
              {" "}and{" "}
              <Link href="/privacy" className="font-medium text-primary hover:underline">Privacy Policy</Link>
            </span>
          </Checkbox>
        </Form.Item>

        <FormError message={error} />

        <Button htmlType="submit" loading={isLoading} className={buttonClass}>
          Create account
        </Button>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-primary hover:text-primaryDark hover:underline">
            Log in
          </Link>
        </p>
      </Form>
    </AuthLayout>
  );
};

export default SignUp;
