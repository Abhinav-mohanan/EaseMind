import React from 'react'
import PsychologistSidebar from '../../../Components/Users/Psychologist/PsychologistSidebar'
import Navbar from '../../../Components/Users/Navbar'
import CompletedAppointmentList from '../../../Components/Users/CompletedAppointment'
import { PsychologistCompletedAppointmentsListApi } from '../../../api/prescriptionApi'

const PsychologistCompletedAppointments = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <PsychologistSidebar/>
        <div className='flex-1 lg:ml-64 transition-all duration-300'>
            <Navbar/>
            <CompletedAppointmentList
            role='psychologist'
            fetchApi={PsychologistCompletedAppointmentsListApi}/>
        </div>
    </div>
  )
}

export default PsychologistCompletedAppointments