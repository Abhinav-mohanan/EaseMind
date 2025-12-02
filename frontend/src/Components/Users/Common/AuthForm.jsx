import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import login_img from '../../../assets/Login_img.jpg';
import { toast } from 'react-toastify';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { SignupApi } from '../../../api/authApi';
import ErrorHandler from '../../Layouts/ErrorHandler';
import Loading from '../../Layouts/Loading';

const AuthForm = ({ type, fields }) => {
  const navigate = useNavigate();
  const role = useSelector((state) => state.role.selectedRole);

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const togglePasswordVisibility = (fieldName) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach((field) => {
      const value = formData[field.name];
      if (!value || value.trim() === '') {
        newErrors[field.name] =
          `${field.name.replace(/_/g, ' ').toLowerCase() || field.placeholder} is required`;
      }
      if ((field.name === 'first_name' || field.name === 'last_name') && value) {
        if (!/^[A-Za-z]+$/.test(value)) {
          newErrors[field.name] = `Enter a Valid ${field.name.replace(/_/g, ' ')}`;
        }
      }
      if (field.name === 'phone_number' && value) {
        if (value.length < 10) {
          newErrors.phone_number = 'Enter a Valid Phone number';
        }
      }
      if (field.name === 'email' && value) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[field.name] = 'Please enter a valid email address';
        }
      }
      if (field.name === 'password' && value && type === 'signup') {
        if (value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        }
      }
    });
    if (formData.password && formData.confirm_password && type === 'signup') {
      if (formData.password !== formData.confirm_password) {
        newErrors.confirm_password = 'Passwords do not match';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      setIsLoading(true);
      const data = await SignupApi(role, type, formData);
      if (type == 'signup') {
        toast.success(data.message);
        navigate('/verify-otp', { state: { email: formData.email } });
      } else if (type == 'login') {
        if (data?.is_email_verified != true) {
          toast.error('Please verify your email before logged in');
          navigate('/verify-otp', { state: { email: formData.email } }); // If user is not email verified -> verify otp
        } else {
          toast.success(data.message);
          const { access, refresh } = data;
          if (!access || !refresh) {
            console.log('access or refresh is not present');
          }
          navigate('/'); // home
        }
      }
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Loading isLoading={isLoading}>
      <div className="min-h-screen flex bg-gray-100">
        {/* Left Side - Hero Image */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <img
            src={login_img}
            alt="Psychology consultation room"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />

          <div className="absolute bottom-8 left-8 max-w-sm">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
              <p className="font-medium italic">
                "The journey to mental wellness begins with a single step forward."
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
                <p className="text-sm text-gray-500">
                  {type === 'login'
                    ? 'Sign in to continue your wellness journey'
                    : 'Create your account and start your path to wellness'}
                </p>
              </div>

              {/* Auth Type Tabs */}
              <div className="flex gap-1 justify-center mb-6 bg-gray-200 p-1 rounded-lg">
                <button
                  onClick={() => navigate('/login')}
                  className={`flex-1 py-2 text-sm rounded-md font-medium transition-colors ${
                    type === 'login'
                      ? 'bg-teal-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className={`flex-1 py-2 text-sm rounded-md font-medium transition-colors ${
                    type === 'signup'
                      ? 'bg-teal-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {fields.map((field, index) => (
                  <div key={index}>
                    <div className="relative">
                      <input
                        type={
                          field.type === 'password' && showPassword[field.name]
                            ? 'text'
                            : field.type
                        }
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal=100 transition-colors text-sm ${
                          errors[field.name]
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-300 bg-white'
                        }`}
                        aria-label={field.placeholder || field.name.replace(/_/g, ' ')}
                      />
                      {field.type === 'password' && (
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => togglePasswordVisibility(field.name)}
                          aria-label={`Toggle ${field.name} visibility`}
                        >
                          {showPassword[field.name] ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      )}
                    </div>
                    {errors[field.name] && (
                      <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                    )}
                  </div>
                ))}

                {/* Forgot Password */}
                {type === 'login' && (
                  <div className="text-right">
                    <button
                      onClick={() => navigate('/forgot-password')}
                      type="button"
                      className="text-xs text-teal-500 hover:text-teal-600 font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full p-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 text-sm"
                >
                  {type === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-gray-100 text-gray-500">or</span>
                </div>
              </div>
  
              {/* Back to Home Link */}
              <div className="text-center mt-4">
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-500 hover:text-gray-900 inline-flex items-center gap-1 transition-colors text-sm"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default AuthForm;
