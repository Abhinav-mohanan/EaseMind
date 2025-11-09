import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setRole } from '../../Redux/roleSlice';
import { Brain, UserRound, ArrowLeft } from 'lucide-react';
import login_img from '../../assets/Login_img.jpg';

const RoleSelection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRoleSelection = (role) => {
    dispatch(setRole(role));
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src={login_img}
          alt="Psychology consultation room"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        {/* Quote */}
        <div className="absolute bottom-8 left-8 max-w-sm">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
            <p className="font-medium italic">
              "Taking care of your mental health is a sign of strength, not weakness."
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Role Selection */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl lg:text-4xl font-bold">
              Welcome to <span className="text-teal-500">EaseMind</span>
            </h1>

            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-600">"Your mental wellness matters"</p>
              <p className="text-gray-500 text-sm">
                Select how you'd like to use EaseMind - as a user seeking support or as a licensed
                psychologist
              </p>
            </div>
          </div>

          {/* Disabled Login/Register Tabs */}
          <div className="flex gap-2 justify-center">
            <button
              disabled
              className="px-6 py-2 text-sm rounded-full bg-gray-200 text-gray-400 cursor-not-allowed"
            >
              Login
            </button>
            <button
              disabled
              className="px-6 py-2 text-sm rounded-full bg-gray-200 text-gray-400 cursor-not-allowed"
            >
              Register
            </button>
          </div>

          {/* Role Selection Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => handleRoleSelection('user')}
              className="w-full flex items-center gap-4 p-4 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors group"
            >
              <UserRound className="w-8 h-8 text-black" />
              <div className="text-left text-black">
                <div className="font-semibold text-lg ">I'm a User</div>
                <div className="text-sm opacity-90 text-gray-800">
                  Seeking mental health support
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelection('psychologist')}
              className="w-full flex items-center gap-4 p-4 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors group"
            >
              <Brain className="w-8 h-8 text-black" />
              <div className="text-left">
                <div className="font-semibold text-lg text-black">I'm a Psychologist</div>
                <div className="text-sm opacity-90 text-gray-800">Providing professional care</div>
              </div>
            </button>
          </div>

          {/* Back to Home Link */}
          <div className="text-center">
            <Link
              to={'/'}
              className="text-gray-500 hover:text-gray-900 inline-flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
