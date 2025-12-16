import React from 'react'
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-8 md:py-8">
      <div className="container mx-auto px-6">
        <div className="bg-gray-50 text-center rounded-2xl py-16 px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 ">
            Ready to Start Your Journey?
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-slate-600 ">
            Take the first step towards a more fulfilling life. Book a consultation 
            with one of our specialists is just a click away.
          </p>
          <div className="mt-8">
            <Link to='/therapist' className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-full text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Schedule Your Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection