import React, { useEffect, useState } from 'react'
import { AdminUserDetailApi, ManageUserApi } from '../../api/adminApi'
import ErrorHandler from '../../Components/Layouts/ErrorHandler'
import { toast } from 'react-toastify'
import Loading from '../../Components/Layouts/Loading'
import AdminSidebar from '../../Components/Admin/AdminSidebar'
import AdminHeader from '../../Components/Admin/AdminHeader'
import { AlertCircle, CheckCircle, Filter, Mail, Phone, Search, Shield, ShieldCheck, User, Users, XCircle } from 'lucide-react'
import Pagination from '../../Components/Layouts/Pagination'

const ManageUser = () => {
    const [isLoading,setIsLoading] = useState(false)
    const [users,setUsers] = useState([])
    const [status,setStatus] = useState('all')
    const [currentPage,setCurrentPage] = useState(1)
    const [totalPages,setTotalpage] = useState(1)
    const page_size = 6

    const getUserDetails = async(page) =>{
        try{
            setIsLoading(true)
            const data = await AdminUserDetailApi(page,status)
            setUsers(data.results)
            setTotalpage(Math.ceil(data.count / page_size))
        }catch(error){
            ErrorHandler(error)
        }finally{
            setIsLoading(false)
        }
        
    }

    useEffect(()=>{
        getUserDetails(currentPage) 
    },[currentPage,status])

    const manageUser = async(user_id,current_status) =>{
        try{
            const data = await ManageUserApi(user_id,current_status)
            toast.success(data.message)
            setUsers((prevUsers)=>
            prevUsers.map((user)=>
            user.id === user_id ? {...user,is_blocked:!current_status}:user))
        }catch(error){
            ErrorHandler(error)
        }
    }
    
    const handlePageChange = (pageNum) =>{
        if(pageNum > 0 && pageNum <= totalPages){
            setCurrentPage(pageNum)
        }
    }
  return (
    <Loading isLoading={isLoading}>
      <div className='flex min-h-screen'>
        <AdminSidebar/>
        <div className='flex-1 ml-64 bg-gray-50'>
          <AdminHeader/>
          <main className='p-6'>
            <div className='mb-8'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='p-2 bg-teal-100 rounded-lg'>
                  <Users className='h-6 w-6 text-teal-600'/>
                </div>
                <h1 className='text-3xl font-bold text-gray-800'>Manage Users</h1>
              </div>
              <p className='text-gray-600 ml-11'>Manage and monitor Users</p>
            </div>
            <div className='bg-white rounded-xl shadow-sm border border-teal-100 p-6 mb-6'>
              <div className='flex flex-col md:flex-row gap-4'>
                <div className='flex-1'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400'/>
                    <input
                    type='text'
                    placeholder='search by name or email...'
                    className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                    />
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Filter className='h-4 w-4 text-gray-400'/>
                  <select
                  value={status}
                  onChange={(e)=>setStatus(e.target.value)}
                  className='px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'>
                    <option value='all'>All status</option>
                    <option value='active'>Active</option>
                    <option value='blocked'>Blocked</option>
                  </select>
                </div>
              </div>
            </div>
            <div className='grid gap-2'>
              {users.length > 0 ? (
                users.map((user)=>(
                  <div key={user.id} className=' bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200'>
                    <div className='p-4'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                          <div className='relative'>
                            <div className='w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center'>
                              <User className='h-8 w-8 text-white'/>
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                              user.is_blocked ? 'bg-red-500' : 'bg-green-500'
                            }`}>
                              {user.is_blocked ?(
                                <XCircle className='h-4 w-4 text-white'/>
                              ):(
                                <CheckCircle className='h-4 w-4 text-white'/>
                              )}
                            </div>
                          </div>
                          <div>
                            <h3 className='text-lg font-semibold text-gray-800'>{user.name}</h3>
                            <div className='flex items-center gap-2 text-gray-600 mt-1'>
                              <Mail className='h-4 w-4'/>
                              <span>{user.email}</span>
                            </div>
                            <div className='flex items-center gap-2 text-gray-600 mt-1'>
                              <Phone className='h-4 w-4'/>
                              <span>{user.phone_number}</span>
                            </div>
                            <div className='flex items-center gap-2 mt-2'>
                              <span className={`inline-flex itmes-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.is_blocked
                                ?'bg-red-100 text-red-800'
                                :'bg-green-100 text-green-800'
                              }`}>
                                {user.is_blocked ?(
                                  <>
                                  <Shield className='h-3 w-3 mr-1'/>
                                  Blocked
                                  </>
                                ):(
                                  <>
                                  <ShieldCheck className='h-3 w-3 mr-1'/>
                                  Active
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center gap-3'>
                          <button
                          onClick={()=>manageUser(user.id,user.is_blocked)}
                          className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            user.is_blocked
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                          }`}>
                            {user.is_blocked ?(
                              <>
                              <ShieldCheck className='h-4 w-4 mr-2'/>
                              Unblock
                              </>
                            ):(
                              <>
                              <Shield className='h-4 w-4 mr-2'/>
                              Block
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ):(
               <div className='bg-white rounded-xl shadow-sm border border-teal-100 p-12'>
                <div className='text-center'>
                  <div className='w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <AlertCircle className='h-8 w-8 text-teal-600'/>
                  </div>
                  <h3 className='text-lg font-medium text-gray-800 mb-2'>No users can found</h3>
                  <p className="text-gray-600">No Users match your current search criteria.</p>
                </div>
               </div> 
              )}
              {totalPages > 0 &&(
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
              )}
            </div>
          </main>
        </div>
      </div>
    </Loading>
  )
}

export default ManageUser