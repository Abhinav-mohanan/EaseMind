import CONFIG from './config';
import { toast } from 'react-toastify';
import ErrorHandler from '../Components/Layouts/ErrorHandler';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';

// signup or login based on role
export const SignupApi = async (role, type, data) => {
    const rolePrefix = role === 'psychologist' ? 'psychologist' : 'user';
    const endpoint = `${CONFIG.BACKEND_URL}/${rolePrefix}/${type}/`;
    const response = await axiosInstance.post(endpoint, data);
    return response.data;
};

// verify otp (email verification / reset password)
export const verifyOTPApi = async(email,otp,purpose) =>{
    const response = await axios.post(`${CONFIG.BACKEND_URL}/verify-otp/`,{
        email:email,
        otp:otp,
        purpose:purpose
    })
    return response.data
}

// Resend OTP
export const resendOTPApi = async(email,purpose) =>{
    const response = await axios.post(`${CONFIG.BACKEND_URL}/resend-otp/`,{
        email:email,
        purpose:purpose
    })
    return response.data
}

// Check Auth status
export const AuthStatusApi = async() =>{
    const response = await axiosInstance.get('/auth/status/')
    return response.data
}

// Logout Api
export const LogoutApi = async() =>{
    const response = await axiosInstance.post('/logout/')
    return response.data
}