import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreateUserHealthTrackerApi, GetUserHealthTrackerApi } from '../../../api/HealthTrackingApi'
import ErrorHandler from '../../../Components/Layouts/ErrorHandler'
import Loading from '../../../Components/Layouts/Loading';
import UserSidebar from '../../../Components/Users/User/UserSidebar';
import Navbar from '../../../Components/Users/Navbar';
import { Calendar, Heart, Activity, Brain, BookOpen, Moon, Share2, ChevronRight, TrendingUp } from 'lucide-react';

const UserHealthTracking = () => {
    const navigate = useNavigate()
    const [entries,setEntries] = useState([])
    const [formData,setFormData] = useState({
        stress_level:10,
        emotionalstate:'neutral',
        exercise:false,
        meditation:false,
        journaling:false,
        notes:'',
        sleep_hours:'',
        is_shared_with_psychologist:false  
    })
    const [isLoading,setIsLoading] = useState(false)
    const [totalPages,setTotalPages] = useState(1)
    const [currentPage,setCurrentPage] = useState(1)
    const page_size = 6

    const GetHealthTracking = async() =>{
        setIsLoading(true)
        try{
            const data = await GetUserHealthTrackerApi()
            setEntries(data.results)
            setTotalPages(Math.ceil(data.count / page_size))
        }catch(error){
            ErrorHandler(error)
        }finally{
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        GetHealthTracking()
    },[currentPage])

    const handleInputChange =(e) =>{
        const {name,value,type,checked} = e.target
        setFormData({
            ...formData,
            [name]:type==='checkbox'?checked:value
        })
    }

    const handlePageChange=(pageNum) =>{
        if(pageNum > 0 && pageNum <= totalPages){
            setCurrentPage(pageNum)
        }
    }
    
    const handleSubmit = async(e) =>{
        e.preventDefault()
        setIsLoading(true)
        try{
            const data = await CreateUserHealthTrackerApi()
            setEntries(data.results)
            setFormData({
                stress_level: 10,
                emotionalstate: 'neutral',
                exercise: false,
                meditation: false,
                journaling: false,
                notes: '',
                sleep_hours: '',
                is_shared_with_psychologist: false
            })
        }catch(error){
            ErrorHandler(error)
        }finally{
            setIsLoading(false)
        }
    }

    const getEmotionalStateColor = (state) => {
        const colors = {
            happy: 'text-green-600 bg-green-50',
            neutral: 'text-gray-600 bg-gray-50',
            sad: 'text-blue-600 bg-blue-50',
            anxious: 'text-orange-600 bg-orange-50',
            angry: 'text-red-600 bg-red-50',
            excited: 'text-purple-600 bg-purple-50'
        }
        return colors[state] || 'text-gray-600 bg-gray-50'
    }

    const getStressLevelColor = (level) => {
        if (level <= 3) return 'text-black bg-green-100'
        if (level <= 6) return 'text-black bg-yellow-100'
        return 'text-black bg-red-100'
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-Us", {
        year: "numeric",
        month: "long",
        day: "numeric",
        });
    };

    return (
        <Loading isLoading={isLoading}>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <UserSidebar />
                <div className="flex-1 lg:ml-64">
                    <Navbar />
                    <div className="p-4 sm:p-6 lg:p-8">
                        <div className="max-w-7xl mx-auto mb-8">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent p-2 mb-2">
                                    Health Tracking
                                </h1>
                                <p className="text-gray-600 text-lg max-w-2xl mt-2 mx-auto">
                                    Monitor your daily wellness journey and share insights with your healthcare provider
                                </p>
                            </div>
                        </div>

                        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                            <div className="xl:col-span-2">
                                <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-3xl p-6 lg:p-8 border border-white/20">
                                    <div className="flex items-center mb-6">
                                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                                            <Heart className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="ml-4">
                                            <h2 className="text-2xl font-bold text-gray-800">Log Today's Health</h2>
                                            <p className="text-gray-600">Track your wellness metrics for today</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl border border-red-100">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Stress Level (0-10)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    name="stress_level"
                                                    value={formData.stress_level}
                                                    onChange={handleInputChange}
                                                    min="0"
                                                    max="10"
                                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    required
                                                />
                                                <TrendingUp className="absolute right-8 top-3 h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Emotional State
                                            </label>
                                            <select
                                                name="emotionalstate"
                                                value={formData.emotionalstate}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                                                required
                                            >
                                                <option value="happy">😊 Happy</option>
                                                <option value="neutral">😐 Neutral</option>
                                                <option value="sad">😢 Sad</option>
                                                <option value="anxious">😰 Anxious</option>
                                                <option value="angry">😠 Angry</option>
                                                <option value="excited">🤩 Excited</option>
                                            </select>
                                        </div>

                                        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-xl border border-green-100">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Activities Completed
                                            </label>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-all">
                                                    <input
                                                        type="checkbox"
                                                        name="exercise"
                                                        checked={formData.exercise}
                                                        onChange={handleInputChange}
                                                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <Activity className="h-5 w-5 text-green-600 mr-2" />
                                                    <span className="font-medium">Exercise</span>
                                                </label>
                                                <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-all">
                                                    <input
                                                        type="checkbox"
                                                        name="meditation"
                                                        checked={formData.meditation}
                                                        onChange={handleInputChange}
                                                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <Brain className="h-5 w-5 text-purple-600 mr-2" />
                                                    <span className="font-medium">Meditation</span>
                                                </label>
                                                <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-all">
                                                    <input
                                                        type="checkbox"
                                                        name="journaling"
                                                        checked={formData.journaling}
                                                        onChange={handleInputChange}
                                                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                                                    <span className="font-medium">Journaling</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Sleep Hours
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    name="sleep_hours"
                                                    value={formData.sleep_hours}
                                                    onChange={handleInputChange}
                                                    step="0.5"
                                                    min="0"
                                                    max='24'
                                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="Enter hours of sleep"
                                                />
                                                <Moon className="absolute right-8 top-3 h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-100">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Notes
                                            </label>
                                            <textarea
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                                placeholder="Any additional notes about your day..."
                                            />
                                        </div>

                                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-xl border border-teal-100">
                                            <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-all">
                                                <input
                                                    type="checkbox"
                                                    name="is_shared_with_psychologist"
                                                    checked={formData.is_shared_with_psychologist}
                                                    onChange={handleInputChange}
                                                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <Share2 className="h-5 w-5 text-teal-600 mr-2" />
                                                <span className="font-medium">Share with Psychologist</span>
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold flex items-center justify-center hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                                        >
                                            <Heart className="h-5 w-5 mr-2" />
                                            Save Entry
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <div className="xl:col-span-1">
                                <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-3xl p-6 border border-white/20 h-fit">
                                    <div className="flex items-center mb-6">
                                        <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl">
                                            <Calendar className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="ml-4">
                                            <h2 className="text-2xl font-bold text-gray-800">Recent History</h2>
                                            <p className="text-gray-600">Your wellness journey</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {entries.map(entry => (
                                            <div
                                                key={entry.id}
                                                className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg cursor-pointer border border-gray-100 hover:border-blue-200 transition-all duration-200 group"
                                                onClick={() => navigate(`/user/health-tracking/${entry.id}`)}
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center">
                                                        <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                                                        <p className="font-semibold text-gray-800">{formatDate(entry.date)}</p>
                                                    </div>
                                                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-medium text-gray-500">Emotional State</span>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmotionalStateColor(entry.emotionalstate)}`}>
                                                            {entry.emotionalstate}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-medium text-gray-500">Stress Level</span>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStressLevelColor(entry.stress_level)}`}>
                                                            {entry.stress_level}/10
                                                        </span>
                                                    </div>
                                                </div>

                                                {entry.is_shared_with_psychologist && (
                                                    <div className="mt-3 flex items-center">
                                                        <Share2 className="h-3 w-3 text-green-500 mr-1" />
                                                        <span className="text-xs text-green-600 font-medium">Shared</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        
                                        {entries.length === 0 && (
                                            <div className="text-center py-8">
                                                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                                <p className="text-gray-500 font-medium">No entries yet</p>
                                                <p className="text-gray-400 text-sm">Start tracking your wellness journey</p>
                                            </div>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Loading>
    );
};

export default UserHealthTracking