import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resendOTPApi, verifyOTPApi } from '../../api/authApi';
import { toast } from 'react-toastify';
import ErrorHandler from '../Layouts/ErrorHandler';
import imageSrc from '../../assets/image_src.jpeg';
import Loading from '../Layouts/Loading';

const VerifyOTP = ({ initialEmail, purpose, description }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: initialEmail || '', otp: '' });
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimeLeft, setResendTimeLeft] = useState(0);
  const RESEND_COOLDOWN = 60

  useEffect(() => {
    const expiry = localStorage.getItem('resend_expiry');
    if (expiry) {
      const remaining = Math.floor((parseInt(expiry) - Date.now()) / 1000);
      if (remaining > 0) {
        setResendDisabled(true);
        setResendTimeLeft(remaining);
      } else {
        localStorage.removeItem('resend_expiry');
      }
    }
  }, []);

  useEffect(() => {
    let timer;
    if (resendTimeLeft > 0) {
      timer = setInterval(() => {
        setResendTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            localStorage.removeItem('resend_expiry');
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (otpError) setOtpError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.otp.trim()) {
      setOtpError('Please Enter OTP');
      return;
    }
    try {
      setIsLoading(true);
      const data = await verifyOTPApi(formData.email, formData.otp, purpose);
      toast.success(data.message);
      localStorage.removeItem('resend_expiry')
      navigate(purpose === 'password_reset' ? '/reset-password' : '/login', {
        state: { email: formData.email, otp: formData.otp },
        replace: true,
      });
    } catch (error) {
      ErrorHandler(error, navigate);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendDisabled(true);
    setResendTimeLeft(RESEND_COOLDOWN);
    const expiryTime = Date.now() + RESEND_COOLDOWN * 1000;
    localStorage.setItem('resend_expiry', expiryTime.toString());

    try {
      const data = await resendOTPApi(formData.email, purpose);
      toast.success(data.message);
    } catch (error) {
      ErrorHandler(error);
      setResendDisabled(false);
      setResendTimeLeft(0);
      localStorage.removeItem('resend_expiry');
    }
  };

  return (
    <Loading isLoading={isLoading}>
      <div className="h-screen flex bg-gray-100">
        <div className="hidden lg:flex lg:w-1/2 relative">
          <img src={imageSrc} alt="Psychology consultation room" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-8 left-8 max-w-sm">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
              <p className="font-medium italic">
                "EaseMind — Professional support for your path to mental wellness."
              </p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-6">
          <div className="w-full max-w-sm mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Welcome to <span className="text-teal-500">EaseMind</span>
              </h1>
              <p className="text-sm text-gray-500">{description}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                value={formData.email}
                disabled
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
              />
              <div>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter your OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    otpError ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                />
                {otpError && <p className="text-red-500 text-xs mt-1">{otpError}</p>}
              </div>

              <button
                type="submit"
                className="w-full p-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 text-sm"
              >
                Verify OTP
              </button>
            </form>

            <div className="my-4 border-t border-gray-300" />

            <button
              onClick={handleResend}
              disabled={resendDisabled}
              className={`w-full p-3 rounded-lg font-semibold text-sm text-white transition-colors 
                ${resendDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'}`}
            >
              {resendDisabled
                ? `Resend available in ${formatTime(resendTimeLeft)}`
                : 'Resend OTP'}
            </button>
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default VerifyOTP;
