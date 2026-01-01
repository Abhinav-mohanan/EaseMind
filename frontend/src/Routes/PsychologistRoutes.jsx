import React from 'react'
import PsychologistProfile from '../Pages/Users/Psychologist/PsychologistProfile'
import CreateArticle from '../Pages/Users/Psychologist/CreateArticle'
import PsychologistAvailability from '../Pages/Users/Psychologist/PsychologistAvailability'
import PsychologistAppointments from '../Pages/Users/Psychologist/PsychologistAppointments'
import PsychologistAppointmentDetails from '../Pages/Users/Psychologist/PsychologistAppointmentDetails'
import PsychologistWallet from '../Pages/Users/Psychologist/PsychologistWallet'
import PsychologistCompletedAppointments from '../Pages/Users/Psychologist/PsychologistCompletedAppointments'
import PsychologistPrescription from '../Pages/Users/Psychologist/PsychologistPrescription'
import UserHealthStatus from '../Pages/Users/Psychologist/UserHealthStatus'
import { Route } from 'react-router-dom'

const PsychologistRoutes = (
    <>
    <Route path='profile' element={<PsychologistProfile />} />
    <Route path='articles' element={<CreateArticle />} />
    <Route path='availability' element={<PsychologistAvailability />} />
    <Route path='appointments' element={<PsychologistAppointments />} />
    <Route path='appointment/:appointment_id' element={<PsychologistAppointmentDetails />} />
    <Route path='wallet/transaction' element={<PsychologistWallet />} />
    <Route path='consultations' element={<PsychologistCompletedAppointments />} />
    <Route path='prescription/:appointment_id' element={<PsychologistPrescription />} />
    <Route path='user/health-status' element={<UserHealthStatus />} />
    </>
  )

export default PsychologistRoutes