import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ErrorHandler from '../../../Components/Layouts/ErrorHandler'
import { GetUserHealthStatusApi } from '../../../api/HealthTrackingApi'
import { Calendar, ChevronRight, Heart, TrendingUp, BookOpen, Brain, Moon, Activity, User, ArrowLeft } from 'lucide-react'
import Loading from '../../../Components/Layouts/Loading'
import Pagination from '../../../Components/Layouts/Pagination'
import { toast } from 'react-toastify'
import PsychologistSidebar from '../../../Components/Users/Psychologist/PsychologistSidebar'
import Navbar from '../../../Components/Users/Navbar'

const UserHealthStatus = () => {
  const location = useLocation()
  const user_id = location.state?.userID
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const page_size = 6

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getEmotionalStateColor = (state) => {
    const colors = {
      happy: 'bg-green-100 text-green-800',
      neutral: 'bg-gray-100 text-gray-800',
      sad: 'bg-blue-100 text-blue-800',
      anxious: 'bg-orange-100 text-orange-800',
      angry: 'bg-red-100 text-red-800',
      excited: 'bg-purple-100 text-purple-800',
    }
    return colors[state] || 'bg-gray-100 text-gray-800'
  }

  const getStressLevelColor = (level) => {
    if (level <= 3) return 'bg-green-100 text-green-800'
    if (level <= 6) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getUserHealthStatus = async () => {
    if (!user_id) {
      toast.error("User ID is missing")
      return
    }
    setIsLoading(true)
    try {
      const data = await GetUserHealthStatusApi(user_id, currentPage, page_size)
      setEntries(data.results)
      setTotalPages(Math.ceil(data.count / page_size))
      if (data.results.length > 0 && !selectedEntry) {
        setSelectedEntry(data.results[0])
      }
    } catch (error) {
      ErrorHandler(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getUserHealthStatus()
  }, [currentPage, user_id])

  const handlePageChange = (pageNum) => {
    if (pageNum > 0 && pageNum <= totalPages) {
      setCurrentPage(pageNum)
      setSelectedEntry(null) 
    }
  }

  const DetailCard = ({ icon, label, value }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
      <div className="p-3 bg-gray-100 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-lg font-bold text-gray-800 mt-1">{value.toUpperCase()}</p>
      </div>
    </div>
  )

  const ActivityBadge = ({ label, status, icon }) => (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200 ${
      status ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'
    }`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  )

  return (
    <Loading isLoading={isLoading}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
        <PsychologistSidebar />
        <div className="flex-1 ml-0 lg:ml-64 transition-all duration-300">
          <Navbar />
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <div className='flex item-center mb-6'>
            <button
            onClick={()=>navigate(-1)} 
            className='flex items-center px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors mr-4'>
                <ArrowLeft className='h-5 w-5 text-gray-700'/>
                <span className='ml-2 text-gray-700 font-medium'>Back</span>
            </button>
            <p className="text-gray-900 text-lg max-w-2xl m-2">
                Review daily wellness entries for your client
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-1 bg-white/70 backdrop-blur-sm shadow-xl rounded-3xl p-6 border border-white/20 h-fit max-h-[700px] overflow-y-auto">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-gray-800">All Entries</h2>
                    <p className="text-gray-600">Select an entry to view details</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {entries.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">No entries found</p>
                    </div>
                  ) : (
                    entries.map(entry => (
                      <div
                        key={entry.id}
                        className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 shadow-md ${
                          selectedEntry?.id === entry.id
                            ? "bg-blue-50 border border-blue-200"
                            : "bg-white border border-gray-100 hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedEntry(entry)}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-800">{formatDate(entry.date)}</p>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmotionalStateColor(entry.emotionalstate)}`}>
                            {entry.emotionalstate}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStressLevelColor(entry.stress_level)}`}>
                            Stress: {entry.stress_level}/10
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {totalPages > 1 && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
              <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm shadow-xl rounded-3xl p-6 border border-white/20 h-fit max-h-[700px] overflow-y-auto">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-gray-800">Entry Details</h2>
                    <p className="text-gray-600">Comprehensive view of the selected entry</p>
                  </div>
                </div>
                {selectedEntry ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <DetailCard
                        icon={<User className="h-6 w-6 text-orange-500" />}
                        label="Patient Name"
                        value={`${selectedEntry.user_name}`}
                      />
                      <DetailCard
                        icon={<Heart className="h-6 w-6 text-red-500" />}
                        label="Emotional State"
                        value={selectedEntry.emotionalstate}
                      />
                      <DetailCard
                        icon={<Moon className="h-6 w-6 text-indigo-500" />}
                        label="Sleep Hours"
                        value={selectedEntry.sleep_hours !=null ?`${selectedEntry.sleep_hours} hours`:'N/A'}
                      />
                      <DetailCard
                        icon={< TrendingUp className="h-6 w-6 text-teal-500" />}
                        label="Stress Level"
                        value={`${selectedEntry.stress_level}/10`}
                      />
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                      <h4 className="font-semibold text-gray-800">Activities Completed</h4>
                      <div className="flex flex-wrap gap-4">
                        <ActivityBadge label="Exercise" status={selectedEntry.exercise} icon={<Activity className="h-4 w-4" />} />
                        <ActivityBadge label="Meditation" status={selectedEntry.meditation} icon={<Brain className="h-4 w-4" />} />
                        <ActivityBadge label="Journaling" status={selectedEntry.journaling} icon={<BookOpen className="h-4 w-4" />} />
                      </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <h4 className="font-semibold text-gray-800 mb-2">Notes</h4>
                      <p className="text-gray-600 italic">{selectedEntry.notes || "No notes for this entry."}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 py-16">
                    <p>Select an entry from the list to see details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Loading>
  )
}

export default UserHealthStatus