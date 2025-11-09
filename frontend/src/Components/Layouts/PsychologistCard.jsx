import React from 'react'
import default_img from '../../assets/default_image.png'

const PsychologistCard = ({ name, specialization, experience_years, profile_pic }) => {
  return (
    <div className="text-center p-4">
      <img 
        alt={name} 
        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg" 
        src={profile_pic || default_img} 
      />
      <h3 className="text-xl font-bold text-slate-900">{name}</h3>
      <p className="text-[#3B82F6] font-medium">{specialization}</p>
      <p className="text-slate-600 mt-2 text-sm">{experience_years} years Experience</p>
    </div>
  );
};


export default PsychologistCard