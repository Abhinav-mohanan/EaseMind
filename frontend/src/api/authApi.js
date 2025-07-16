import axios from 'axios';
import CONFIG from './config';
import { toast } from 'react-toastify';
import ErrorHandler from '../Components/Layouts/ErrorHandler';

// Dynamic signup or login based on role and type
export const SignupApi = async (role, type, data) => {
    try {
        const rolePrefix = role === 'psychologist' ? 'psychologist' : 'user';
        const endpoint = `${CONFIG.BACKEND_URL}/${rolePrefix}/${type}/`;
        const response = await axios.post(endpoint, data);
        return response.data;
    } catch (error) {
        // Handle specific error messages from the server
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
        ErrorHandler(error)
        throw error 
    }
};