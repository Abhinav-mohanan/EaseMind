import React from 'react'
import { Route } from 'react-router-dom'
import AdminDashboard from '../Pages/Admin/AdminDashboard'
import ManageUser from '../Pages/Admin/ManageUser'
import ManagePsychologist from '../Pages/Admin/ManagePsychologist'
import ArticlesManage from '../Pages/Admin/ArticlesManage'
import ViewAppointments from '../Pages/Admin/ViewAppointments'
import AddCategory from '../Pages/Admin/AddCategory'
import ManagePayout from '../Pages/Admin/ManagePayout'
import RevenueDetails from '../Pages/Admin/RevenueDetails'
import PsychologistVerification from '../Pages/Admin/PsychologistVerification'

const AdminRoutes = (
    <>
    <Route path='dashboard' element={<AdminDashboard />} />
    <Route path='user/management' element={<ManageUser />} />
    <Route path='psychologist/management' element={<ManagePsychologist />} />
    <Route path='psychologist/verification' element={<PsychologistVerification   />} />
    <Route path='articles' element={<ArticlesManage />} />
    <Route path='appointments' element={<ViewAppointments />} />
    <Route path='categories/create' element={<AddCategory />} />
    <Route path='payouts' element={<ManagePayout />} />
    <Route path='revenue-details' element={<RevenueDetails />} />
    </>
  )

export default AdminRoutes