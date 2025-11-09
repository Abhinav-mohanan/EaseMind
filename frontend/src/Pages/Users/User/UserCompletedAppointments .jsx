import React from 'react'
import UserSidebar from '../../../Components/Users/User/UserSidebar'
import Navbar from '../../../Components/Users/Common/Navbar'
import CompletedAppointmentList from '../../../Components/Users/Common/CompletedAppointment'
import { UserCompletedAppointmentsListApi } from '../../../api/prescriptionApi'

const UserCompletedAppointments  = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16">
            <Navbar/>
        <div className='flex-1 lg:ml-64 transition-all duration-300'>
        <UserSidebar/>
            <CompletedAppointmentList
            role='user'
            fetchApi={UserCompletedAppointmentsListApi}/>
        </div>
    </div>
  )
}

export default UserCompletedAppointments 