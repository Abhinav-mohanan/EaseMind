import axios from 'axios';
import React from 'react';
import CONFIG from './config';
import ErrorHandler from '../Components/Layouts/ErrorHandler';

const axiosInstance = axios.create({
  baseURL: CONFIG.BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if(originalRequest.url.includes('/token/refresh/')){
      ErrorHandler(error);
      window.location.href='/login';
      return Promise.reject(error);
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axiosInstance.post(
          `/token/refresh/`,
          {}, // No body needed; backend reads from cookie
          { withCredentials: true }
        );
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        ErrorHandler(refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
