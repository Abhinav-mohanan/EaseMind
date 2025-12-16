import React from 'react'
import PsychologistCard from '../../Layouts/PsychologistCard';
import { usePsychologists } from '../../../Hooks/usePsychologists';
import { Link } from 'react-router-dom';

const PsychologistsSection = () => {
  const team = usePsychologists()

  return (
        <>
        {team.length > 0 &&(
            <section className="py-8 md:py-16 bg-white">
            <div className="container mx-auto px-6">
            <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Meet Our Compassionate Team
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-slate-600 ">
                Our accredited psychologists are dedicated to providing you with personalized and effective care.
            </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
                <PsychologistCard key={index} {...member} />
            ))}
            </div>
            <div className="text-center mt-12">
              <Link to='/therapist' className="bg-blue-600  text-white  font-semibold 
              py-3 px-8 rounded-full text-lg hover:bg-blue-700  transition-all">
                Meet Our Psychologists
          </Link>
            </div>
        </div>
        </section>
        )}
        </>
    );
};

export default PsychologistsSection