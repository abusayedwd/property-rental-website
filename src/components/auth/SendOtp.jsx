"use client"

import { useVerifyEmailMutation } from '@/redux/fetures/auth/varifyEmail';
import { useForgotPasswordMutation } from '@/redux/fetures/auth/forgotPassword';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import toast from 'react-hot-toast';
import OTPInput from 'react-otp-input';
import { HiOutlineMailOpen } from 'react-icons/hi';
import AuthLayout, { FormError, buttonClass } from './AuthLayout';

const OTP_LENGTH = 6;

const SendOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('')
  const router = useRouter();
  const [email, setEmail] = useState('')
  const [path, setPath] = useState('')

  useEffect(() => {
    // Extract query parameters on client-side
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get('email') || '');
    setPath(params.get('path') || '');
  }, []);

  const [verifyOtp, {isLoading}] = useVerifyEmailMutation()
  const [resendOtp, {isLoading: isResending}] = useForgotPasswordMutation()
  const isSignup = path === "/auth/singup";

  const handleOtp = async (e) => {
    e?.preventDefault();
    setError('');
    try {
      const res = await verifyOtp({ email, oneTimeCode: otp }).unwrap();

      if (res?.code === 200) {
          toast.success(res?.message);

          if (isSignup) {
              router.push(`/auth/login`);
          } else if (path === "/auth/forgotPassword") {
            router.push(`/auth/resetPassword?email=${email}`);
          }
      }
    } catch (error) {
      setError(error?.data?.message || 'Invalid or expired code. Please try again.')
    }
  };

  const handleResend = async () => {
    try {
      const res = await resendOtp({ email }).unwrap();
      toast.success(res?.message || 'A new code has been sent to your email.');
    } catch (error) {
      toast.error(error?.data?.message || 'Could not resend code. Please try again.');
    }
  };

  return (
    <AuthLayout
      image="/images/appr.jpg"
      heading={isSignup ? "You're almost in" : "Just one more step"}
      subheading="Verifying your email keeps your account and conversations secure."
      highlights={[]}
      icon={<HiOutlineMailOpen size={24} />}
      title={isSignup ? 'Verify your email' : 'Enter verification code'}
      subtitle={
        <>
          We sent a {OTP_LENGTH}-digit code to{' '}
          <span className="font-medium text-navy">{email || 'your email'}</span>. Enter it below to continue.
        </>
      }
      backHref={isSignup ? '/auth/singup' : '/auth/forgotPassword'}
    >
      <form onSubmit={handleOtp}>
        <OTPInput
          value={otp}
          onChange={setOtp}
          numInputs={OTP_LENGTH}
          shouldAutoFocus
          inputType="tel"
          containerStyle={{ display: 'flex', gap: '10px' }}
          inputStyle={{ width: '100%' }}
          renderInput={(props) => (
            <input
              {...props}
              className="h-12 min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 text-center text-xl font-semibold text-navy outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 sm:h-14"
            />
          )}
        />

        {!isSignup && (
          <div className="mt-5 flex items-center justify-between text-sm">
            <span className="text-gray-500">Didn&apos;t receive the code?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || !email}
              className="font-semibold text-primary hover:text-primaryDark hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isResending ? 'Sending...' : 'Resend code'}
            </button>
          </div>
        )}

        <div className="mt-6">
          <FormError message={error} />
          <Button
            htmlType="submit"
            loading={isLoading}
            disabled={otp.length !== OTP_LENGTH}
            className={buttonClass}
          >
            {isSignup ? 'Verify account' : 'Verify code'}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SendOtp;
