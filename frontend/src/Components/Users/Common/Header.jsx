import React from 'react';
import banner_img from '../../../assets/banner_img.png';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate()
  return (
    <section className="relative min-h-[80vh] md:min-h-screen flex flex-col items-center justify-center pt-16 md:pt-20 overflow-hidden">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[80vw] md:w-[50vw] h-[30vh] md:h-[40vh] 
                      bg-gradient-to-t from-customBlue via-blue-300 to-pink-300 
                      rounded-bl-full rounded-br-full blur-3xl opacity-60">
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div className="mb-8 md:mb-12">
          <p className="text-sm sm:text-base md:text-lg text-textBlue mb-2">
            Trusted guide to
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-textBlue mb-4 md:mb-6 leading-snug md:leading-tight">
            Mental Health & Wellness
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-textBlue mb-6 md:mb-8 max-w-md mx-auto px-2">
            "Your mental health matters—healing begins with a single conversation."
          </p>
          <button
          onClick={()=>navigate('/therapist')}
           className="inline-flex items-center px-5 sm:px-6 py-2.5 sm:py-3 
                             bg-blue-600 hover:bg-blue-700 text-white font-medium 
                             rounded-full text-sm sm:text-base transition-all duration-200">
            Book Slot
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>

        <div className="hidden sm:flex justify-center space-x-3 md:space-x-5 mb-10 md:mb-16">
          <div className="relative w-[1.5px] h-10 md:h-16 bg-gray-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-400 animate-slide"></div>
          </div>
          <div className="relative w-[1.5px] h-14 md:h-20 bg-gray-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-400 animate-slide"></div>
          </div>
          <div className="relative w-[1.5px] h-10 md:h-16 bg-gray-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-400 animate-slide"></div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative w-full sm:w-[90%] md:w-[980px] h-[220px] sm:h-[320px] md:h-[420px] rounded-2xl overflow-hidden">
            <img
              src={banner_img}
              alt="Therapy session"
              className="w-full h-full object-cover object-center opacity-90"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
