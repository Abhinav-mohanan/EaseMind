import React from 'react'
import UserProfile from '../Pages/Users/User/UserProfile'
import UserAppointments from '../Pages/Users/User/UserAppointments'
import UserAppointmentDetails from '../Pages/Users/User/UserAppointmentDetails'
import UserWalletTransactionList from '../Pages/Users/User/UserWalletTransactionList'
import UserCompletedAppointments from '../Pages/Users/User/UserCompletedAppointments '
import UserPrescription from '../Pages/Users/User/Userprescription'
import UserHealthTracking from '../Pages/Users/User/UserHealthTracking'
import UserHealthTrackingDetail from '../Pages/Users/User/UserHealthTrackingDetail'
import { Route } from 'react-router-dom'

const UserRoutes = (
    <>
    <Route path='profile' element={<UserProfile />} />
    <Route path='appointments' element={<UserAppointments />} />
    <Route path='appointment/:appointment_id' element={<UserAppointmentDetails />} />
    <Route path='wallet/transaction' element={<UserWalletTransactionList />} />
    <Route path='consultations' element={<UserCompletedAppointments />} />
    <Route path='prescription/:appointment_id' element={<UserPrescription />} />
    <Route path='health-tracking' element={<UserHealthTracking />} />
    <Route path='health-tracking/:health_tracking_id' element={<UserHealthTrackingDetail />} />
    </>
) 


export default UserRoutes;