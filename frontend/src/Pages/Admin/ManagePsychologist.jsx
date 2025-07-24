import React, { useEffect, useState } from 'react';
import { AdminPsychologistDetailApi, ManagePsychologistApi } from '../../api/adminApi';
import { toast } from 'react-toastify';
import ErrorHandler from '../../Components/Layouts/ErrorHandler';
import Loading from '../../Components/Layouts/Loading';
import AdminSidebar from '../../Components/Admin/AdminSidebar';
import AdminHeader from '../../Components/Admin/AdminHeader';
import { AlertCircle, CheckCircle, Filter, Mail, Phone, Search, 
    Shield, ShieldCheck, User, Users, XCircle } from 'lucide-react';
import Pagination from '../../Components/Layouts/Pagination';

const ManagePsychologist = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [psychologists, setPsychologists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalpage] = useState(1);
  const page_size = 6;

  const getPsychologistDetails = async (page) => {
    try {
      setIsLoading(true);
      const data = await AdminPsychologistDetailApi(page);
      setPsychologists(data.results);
      setTotalpage(Math.ceil(data.count / page_size));
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPsychologistDetails(currentPage);
  }, [currentPage]);

  const managePsychologist = async (psychologist_id, current_status) => {
    try {
      const data = await ManagePsychologistApi(psychologist_id, current_status);
      toast.success(data.message);
      getPsychologistDetails(currentPage);
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const handlePageChange = (pageNum) => {
    if (pageNum > 0 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <Loading isLoading={isLoading}>
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 ml-64 bg-gray-50">
        <AdminHeader />
        <main className="p-6">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Manage Psychologists</h1>
            </div>
            <p className="text-gray-600 ml-11">Manage and monitor all registered psychologists</p>
          </div>
          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl shadow-sm border border-teal-100 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            {psychologists.length > 0 ? (
              psychologists.map((ps) => (
                <div key={ps.id} className="bg-white rounded-xl shadow-sm border border-teal-100 hover:shadow-md transition-shadow duration-200">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
                            <User className="h-8 w-8 text-white" />
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                            ps.is_blocked ? 'bg-red-500' : 'bg-green-500'
                          }`}>
                            {ps.is_blocked ? (
                              <XCircle className="h-4 w-4 text-white" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-white" />
                            )}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{ps.name}</h3>
                          <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <Mail className="h-4 w-4" />
                            <span>{ps.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <Phone className="h-4 w-4" />
                            <span>{ps.phone_number}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              ps.is_blocked 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {ps.is_blocked ? (
                                <>
                                  <Shield className="h-3 w-3 mr-1" />
                                  Blocked
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="h-3 w-3 mr-1" />
                                  Active
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => managePsychologist(ps.id,ps.is_blocked)}
                          className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            ps.is_blocked
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-red-600 hover:bg-red-700 text-white'
                          }`}
                        >
                          {ps.is_blocked ? (
                            <>
                              <ShieldCheck className="h-4 w-4 mr-2" />
                              Unblock
                            </>
                          ) : (
                            <>
                              <Shield className="h-4 w-4 mr-2" />
                              Block
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-teal-100 p-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No Psychologists Found</h3>
                  <p className="text-gray-600">No psychologists match your current search criteria.</p>
                </div>
              </div>
            )}
          </div>
          {totalPages > 0 &&(
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
          )}
        </main>
      </div>
    </div>
    </Loading>
  )
}

export default ManagePsychologist;

