import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordApi } from '../../api/authApi';
import { toast } from 'react-toastify';
import reset_img from '../../assets/image_src.jpeg';
import ErrorHandler from '../../Components/Layouts/ErrorHandler';
import Loading from '../../Components/Layouts/Loading';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const role = useSelector((state) => state.role.selectedRole);
  const [formData, setFormData] = useState({ email: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!role) {
      return navigate('/roleSelection');
    }
  }, [role, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    let formErrors = {};
    if (formData.email.trim() === '') {
      formErrors.email = 'Email is required';
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setIsLoading(true);
      const data = await ForgotPasswordApi({ ...formData, role });
      toast.success(data.message);
      navigate('/resetpassword/email-verify', { state: { email: formData.email } });
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Loading isLoading={isLoading}>
      <div className="flex h-screen">
        <div className="hidden lg:flex lg:w-1/2 relative">
          <img
            src={reset_img}
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
        <div className="w-1/2 flex flex-col items-center justify-center p-8">
          <h1 className="text-2xl font-semibold mb-4">Forgot Password</h1>
          <p className="text-gray-500 text-center mb-6">
            Enter your email to receive a password reset OTP.
          </p>
          <div className="w-full max-w-md">
            <div className="mb-4 relative">
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <button
            onClick={handleSubmit}
            className="mt-6 w-full max-w-md p-3 bg-teal-700 text-white rounded-full hover:bg-teal-800"
          >
            Send OTP
          </button>
        </div>
      </div>
    </Loading>
  );
};

export default ForgotPassword;
