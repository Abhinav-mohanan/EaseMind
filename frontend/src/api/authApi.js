import CONFIG from './config';
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

// forgotPassword Api
export const ForgotPasswordApi = async(data)=>{
    const response = await axios.post(`${CONFIG.BACKEND_URL}/forgot-password/`,data)
    return response.data
}

// ResetPassword
export const ResetPasswordApi = async(data)=>{
    const response = await axios.post(`${CONFIG.BACKEND_URL}/reset-password/`,data)
    return response.data
}

// Fetch user profile
export const FetchUserDetail = async() =>{
    const response = await axiosInstance.get('/user/profile/')
    return response.data
}

// Update user profile
export const UserProfileApi = async(data) =>{
    const response = await axiosInstance.patch('/user/profile/',data,{headers:{
        'Content-Type':'multipart/form-data'
    }})
    return response.data
}

// Fetch Psychologist profile
export const FetchPsychologistDetail = async()=>{
    const response = await axiosInstance.get('/psychologist/profile/')
    return response.data
}

// Update Psychologist Profile
export const PsychologistProfileApi = async(data) =>{
    const response = await axiosInstance.patch('/psychologist/profile/',data,{headers:{
        'Content-Type':'multipart/form-data'
    }})
    return response.data
}
