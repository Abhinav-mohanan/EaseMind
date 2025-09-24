import React, { useEffect, useState } from 'react';
import { replace, useLocation, useNavigate } from 'react-router-dom';
import { resendOTPApi, verifyOTPApi } from '../../api/authApi';
import { toast } from 'react-toastify';
import ErrorHandler from '../Layouts/ErrorHandler';
import imageSrc from '../../assets/image_src.jpeg';
import Loading from '../Layouts/Loading';

const VerifyOTP = ({ initialEmail, purpose, description }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: initialEmail || '', otp: '' });
  const [timeLeft, setTimeLeft] = useState(300);
  const [resendOTP,setResendOTP] = useState(false)
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const OTP_EXPIRY = parseInt(import.meta.env.VITE_OTP_EXPIRY || '300')

  useEffect(() => {
    let expiryTime = localStorage.getItem('otp_expiry')
    if(!expiryTime){
      expiryTime = Date.now() + OTP_EXPIRY * 1000;
      localStorage.setItem('otp_expiry',expiryTime)
    } 
    const remaining = Math.floor((expiryTime - Date.now()) / 1000)
    setTimeLeft(remaining > 0 ? remaining:0);

    const timer = setInterval(() => {
      setTimeLeft((prev) =>{
        if(prev <=1){
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    },1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (otpError) setOtpError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.otp || formData.otp.trim() === '') {
      setOtpError('Please Enter OTP');
      return;
    }
    try {
      setIsLoading(true);
      const data = await verifyOTPApi(formData.email, formData.otp, purpose); // api call
      toast.success(data.message);
      localStorage.removeItem('otp_expiry');
      navigate(purpose === 'password_reset' ? '/reset-password' : '/login', {
        state: { email: formData.email, otp: formData.otp },
        replace: true, // Prevent going back
      });
    } catch (error) {
      ErrorHandler(error, navigate);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendOTP(true)
    try {
      const data = await resendOTPApi(formData.email, purpose);
      toast.success(data.message);
      const expiryTime = Date.now() + OTP_EXPIRY * 1000
      localStorage.setItem('otp_expiry',expiryTime)
      const remaining = Math.floor((expiryTime - Date.now())/1000)
      setTimeLeft(remaining > 0? remaining:0);
    } catch (error) {
      ErrorHandler(error);
    }finally{
      setResendOTP(false)
    }
  };

  return (
    <Loading isLoading={isLoading}>
      <div className="h-screen flex bg-gray-100">
        <div className="hidden lg:flex lg:w-1/2 relative">
          <img
            src={imageSrc}
            alt="Psychology consultation room"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-8 left-8 max-w-sm">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
              <p className="font-medium italic">
                "EaseMind — Professional support for your path to mental wellness."
              </p>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-6">
            <div className="w-full max-w-sm mx-auto">
              <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  Welcome to <span className="text-teal-500">EaseMind</span>
                </h1>
                <p className="text-sm text-gray-500 ">
                  {description} OTP expires in {formatTime(timeLeft)}.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-100 transition-colors text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
                      disabled
                      aria-label="Email"
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter your OTP"
                      value={formData.otp}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-100 transition-colors text-sm ${
                        otpError ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      aria-label="OTP"
                    />
                  </div>
                  {otpError && <p className="text-red-500 text-xs mt-1">{otpError}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full p-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 text-sm"
                >
                  Verify OTP
                </button>
              </form>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
              </div>
              <button
              disabled={resendOTP}
                onClick={handleResend}
                className={'w-full p-3 rounded-lg font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 bg-teal-500 text-white hover:bg-teal-600 disabled:cursor-not-allowed'
                }
              >
                {resendOTP?'Resending':'Resend OTP'}
              </button>
              <div className="text-center mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default VerifyOTP;
