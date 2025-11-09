import React from 'react'
import PsychologistSidebar from '../../../Components/Users/Psychologist/PsychologistSidebar'
import Navbar from '../../../Components/Users/Common/Navbar'
import CompletedAppointmentList from '../../../Components/Users/Common/CompletedAppointment'
import { PsychologistCompletedAppointmentsListApi } from '../../../api/prescriptionApi'

const PsychologistCompletedAppointments = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16 ">
            <Navbar/>
        <div className='flex-1 lg:ml-64 transition-all duration-300'>
        <PsychologistSidebar/>
            <CompletedAppointmentList
            role='psychologist'
            fetchApi={PsychologistCompletedAppointmentsListApi}/>
        </div>
    </div>
  )
}

export default PsychologistCompletedAppointments