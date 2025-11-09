import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GetUserHealthTrackerDetailsApi, UpdateUserHealthTrackerApi } from '../../../api/HealthTrackingApi';
import ErrorHandler from '../../../Components/Layouts/ErrorHandler';
import Loading from '../../../Components/Layouts/Loading';
import UserSidebar from '../../../Components/Users/User/UserSidebar';
import Navbar from '../../../Components/Users/Common/Navbar';
import { ArrowLeft, Edit, Save, TrendingUp, Heart, Brain, BookOpen, Moon, Share2 } from 'lucide-react';

const UserHealthTrackingDetail = () => {
    const { health_tracking_id } = useParams();
    const navigate = useNavigate();
    const [entry, setEntry] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        stress_level: 10,
        emotionalstate: 'neutral',
        exercise: false,
        meditation: false,
        journaling: false,
        notes: '',
        sleep_hours: '',
        is_shared_with_psychologist: false
    });
    const [isLoading, setIsLoading] = useState(false);

    const getHealthTracker = async () => {
        setIsLoading(true);
        try {
            const data = await GetUserHealthTrackerDetailsApi(health_tracking_id);
            setEntry(data);
            setFormData({
                stress_level: data.stress_level,
                emotionalstate: data.emotionalstate,
                exercise: data.exercise,
                meditation: data.meditation,
                journaling: data.journaling,
                notes: data.notes || '',
                sleep_hours: data.sleep_hours || '',
                is_shared_with_psychologist: data.is_shared_with_psychologist
            });
        } catch (error) {
            ErrorHandler(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getHealthTracker();
    }, [health_tracking_id]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = await UpdateUserHealthTrackerApi(health_tracking_id, formData);
            setEntry(data);
            setIsEditing(false);
        } catch (error) {
            ErrorHandler(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getEmotionalStateColor = (state) => {
        const colors = {
            happy: 'text-green-600 bg-green-50',
            neutral: 'text-gray-600 bg-gray-50',
            sad: 'text-blue-600 bg-blue-50',
            anxious: 'text-orange-600 bg-orange-50',
            angry: 'text-red-600 bg-red-50',
            excited: 'text-purple-600 bg-purple-50'
        };
        return colors[state] || 'text-gray-600 bg-gray-50';
    };

    const getStressLevelColor = (level) => {
        if (level <= 3) return 'text-black bg-green-100';
        if (level <= 6) return 'text-black bg-yellow-100';
        return 'text-black bg-red-100';
    };

    return (
        <Loading isLoading={isLoading}>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-16">
                    <Navbar />
                <div className="ml-0 lg:ml-64 transition-all duration-300">
                <UserSidebar />
                    <div className="p-4 sm:p-6 lg:p-8">
                        <div className="max-w-4xl mx-auto mb-8">
                            <div className="flex items-center mb-6">
                                <button onClick={() => navigate('/user/health-tracking')} className="mr-4 p-2 rounded-full bg-white/50 backdrop-blur-sm shadow-md hover:bg-gray-100 transition-colors">
                                    <ArrowLeft className="h-6 w-6 text-gray-600" />
                                </button>
                                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text p-2 text-transparent">
                                    Health Tracking 
                                </h1>
                            </div>
                            <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-3xl p-6 lg:p-8 border border-white/20">
                                {entry && !isEditing ? (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-100">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</p>
                                                <p className="font-bold text-lg text-gray-800">{entry.date}</p>
                                            </div>
                                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl shadow-inner border border-blue-100">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Emotional State</p>
                                                <span className={`px-3 py-1 mt-1 rounded-full text-sm font-medium ${getEmotionalStateColor(entry.emotionalstate)}`}>
                                                    {entry.emotionalstate}
                                                </span>
                                            </div>
                                            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl shadow-inner border border-red-100">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Stress Level</p>
                                                <span className={`px-3 py-1 mt-1 rounded-full text-sm font-medium ${getStressLevelColor(entry.stress_level)}`}>
                                                    {entry.stress_level}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="flex items-center p-4 bg-green-50 rounded-xl shadow-inner border border-green-100">
                                                <Heart className="h-6 w-6 text-green-600 mr-3" />
                                                <span className="font-semibold text-gray-700">Exercise: {entry.exercise ? 'Yes' : 'No'}</span>
                                            </div>
                                            <div className="flex items-center p-4 bg-purple-50 rounded-xl shadow-inner border border-purple-100">
                                                <Brain className="h-6 w-6 text-purple-600 mr-3" />
                                                <span className="font-semibold text-gray-700">Meditation: {entry.meditation ? 'Yes' : 'No'}</span>
                                            </div>
                                            <div className="flex items-center p-4 bg-blue-50 rounded-xl shadow-inner border border-blue-100">
                                                <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
                                                <span className="font-semibold text-gray-700">Journaling: {entry.journaling ? 'Yes' : 'No'}</span>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-2">
                                            <div className="flex items-center">
                                                <Moon className="h-5 w-5 text-indigo-500 mr-2" />
                                                <p className="font-semibold text-gray-700">Sleep Hours:</p>
                                                <span className="ml-auto text-lg font-bold text-gray-800">{entry.sleep_hours || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Share2 className="h-5 w-5 text-teal-500 mr-2" />
                                                <p className="font-semibold text-gray-700">Shared with Psychologist:</p>
                                                <span className={`ml-auto font-bold ${entry.is_shared_with_psychologist ? 'text-teal-600' : 'text-gray-500'}`}>
                                                    {entry.is_shared_with_psychologist ? 'Yes' : 'No'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes</p>
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{entry.notes || 'N/A'}</p>
                                        </div>

                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold flex items-center justify-center hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                                            >
                                                <Edit className="h-5 w-5 mr-2" /> Edit 
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl border border-red-100">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Stress Level (0-10)</label>
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
                                                <TrendingUp className="absolute right-8 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Emotional State</label>
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
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">Activities Completed</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-all">
                                                    <input
                                                        type="checkbox"
                                                        name="exercise"
                                                        checked={formData.exercise}
                                                        onChange={handleInputChange}
                                                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <Heart className="h-5 w-5 text-green-600 mr-2" />
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
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Sleep Hours</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    name="sleep_hours"
                                                    value={formData.sleep_hours}
                                                    onChange={handleInputChange}
                                                    step="0.1"
                                                    min="0"
                                                    max="24"
                                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="Enter hours of sleep"
                                                />
                                                <Moon className="absolute right-8 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-100">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
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
                                        <div className="flex space-x-4">
                                            <button
                                                type="submit"
                                                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold flex items-center justify-center hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                                            >
                                                <Save className="h-5 w-5 mr-2" /> Save Changes
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-2xl font-semibold hover:bg-gray-300 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Loading>
    );
};

export default UserHealthTrackingDetail;