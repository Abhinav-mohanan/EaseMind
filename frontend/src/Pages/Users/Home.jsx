import React from 'react';
import Navbar from '../../Components/Users/Common/Navbar';
import Header from '../../Components/Users/Common/Header';
import Footer from '../../Components/Users/Common/Footer';
import BlogSection from '../../Components/Users/Common/BlogSection';
import PsychologistsSection from '../../Components/Users/Common/PsychologistsSection';
import CTASection from '../../Components/Users/Common/CTASection';

const Home = () => {
  return (
    <>
      <Navbar />
      <Header />
      <BlogSection />
      <PsychologistsSection />
      <CTASection />
      <Footer />
    </>
  );
};

export default Home;
