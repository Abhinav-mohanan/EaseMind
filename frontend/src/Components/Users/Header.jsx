import React from 'react';
import banner_image from '../../assets/Banner_image.webp';

const Header = () => {
  return (
    <section
      className="relative h-[100vh] bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${banner_image})`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-35"></div>
      <div className="relative text-center text-white z-10 max-w-4xl mx-auto px-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Your trusted guide to mental wellness
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          We empower you with the knowledge and skills you need to strengthen your mental
          well-being.
        </p>
      </div>
    </section>
  );
};

export default Header;
