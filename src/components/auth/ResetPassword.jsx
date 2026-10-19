"use client"
import React, { useEffect, useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useRouter } from 'next/navigation';
import { HiOutlineLockClosed, HiOutlineShieldCheck } from 'react-icons/hi';
import { useResetPasswordMutation } from '@/redux/fetures/auth/resetPassword';
import toast from 'react-hot-toast';
import AuthLayout, { FieldLabel, FormError, buttonClass, inputClass } from './AuthLayout';
import { passwordRules } from './SignUp';

const ResetPassword = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const [resetPassword, {isLoading}] = useResetPasswordMutation()
  useEffect(() => {
    // Extract query parameters on client-side
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get('email') || '');
  }, []);

  const onFinish = async(values) => {
    setError('');
    const data = {
      email,
      password: values?.confirmPassword,
    }
    try{
      const res = await resetPassword(data).unwrap();
      if(res?.code == 200){
        toast.success(res?.message)
        router.push(`/auth/login`);
      }
    }catch(error){
      setError(error?.data?.message || 'Could not reset your password. Please try again.')
    }
  };

  return (
    <AuthLayout
      image="/images/appr.jpg"
      heading="Secure your account"
      subheading="Pick a strong password you don't use anywhere else."
      highlights={[]}
      icon={<HiOutlineShieldCheck size={24} />}
      title="Set a new password"
      subtitle="Use at least 8 characters, including a letter and a number."
      backHref="/auth/login"
      backLabel="Back to login"
    >
      <Form name="reset_password_form" layout="vertical" requiredMark={false} onFinish={onFinish}>
        <Form.Item
          name="newPassword"
          label={<FieldLabel>New password</FieldLabel>}
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
          label={<FieldLabel>Confirm new password</FieldLabel>}
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
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

        <FormError message={error} />

        <Button htmlType="submit" loading={isLoading} className={`${buttonClass} mt-2`}>
          Reset password
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default ResetPassword;
