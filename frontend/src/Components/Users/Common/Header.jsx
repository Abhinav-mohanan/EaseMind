import React from 'react';

const Header = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">      
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[50vw] h-[40vh] bg-gradient-to-t from-customBlue via-blue-300 to-pink-300 rounded-bl-full rounded-br-full blur-3xl opacity-60"></div>
      <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="relative text-center mb-12">
            <div className="absolute inset-0 flex items-center justify-center">
            </div>
            <p className="relative text-lg text-textBlue mb-2 z-10">
              Trusted guide to
            </p>
            <h1 className="relative text-5xl md:text-6xl font-bold text-textBlue mb-6 leading-tight z-10">
              Mental Health & Wellness
            </h1>
            <p className="relative text-lg text-textBlue mb-8 max-w-md mx-auto z-10">
              "Your mental health matters—healing begins with a single conversation."

            </p>
            <button className="relative inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors duration-200 z-10">
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
        <div className="flex justify-center space-x-5 mb-16">
          <div className='relative w-[1.5px] h-16 bg-gray-300 overflow-hidden'>
            <div className='absolute top-0 left-0 w-full h-2 bg-blue-400 animate-slide'></div>
          </div>
          <div className='relative w-[1.5px] h-20 bg-gray-300 overflow-hidden'>
            <div className='absolute top-0 left-0 w-full h-2 bg-blue-400 animate-slide'></div>
          </div>
          <div className='relative w-[1.5px]  h-16 bg-gray-300 overflow-hidden'>
            <div className='absolute top-0 left-0 w-full h-2 bg-blue-400 animate-slide'></div>
          </div>
        </div>



        <div className="flex justify-center">
        <div className="relative w-[980px] h-[420px]">
          <div className="w-full h-full bg-cover bg-center rounded-2xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Therapy session" 
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        </div>
      </div>






      </div>
    </section>
  );
};

export default Header;