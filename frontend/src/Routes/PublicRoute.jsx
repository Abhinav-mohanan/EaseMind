import React from 'react'
import { useAuth } from '../Hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const PublicRoute = () => {
    const {isAuthenticated, role, loading} = useAuth()

    if (loading){
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-gray-50 p-8 rounded-md shadow-2xl border border-gray-200 text-center">
                    <div className="relative mb-6">
                        <Loader2 className="h-12 w-12 text-blue-800 animate-spin mx-auto" />
                    </div>

                    <h3 className="text-xl font-serif font-semibold text-gray-900">Please wait...</h3>
                    <p className="text-sm font-serif text-gray-700 mt-2">Loading...</p>
                </div>
            </div>
        )
    }
    if(isAuthenticated){
        if(role === 'admin')return <Navigate to='/admin/dashboard' replace/>
        if(role === 'psychologist')return <Navigate to='psychologist/profile' replace />
        return <Navigate to='user/profile' replace/>
    }
    return <Outlet/>
}

export default PublicRoute