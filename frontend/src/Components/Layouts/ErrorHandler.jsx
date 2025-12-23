import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';

const ErrorHandler = (error, defaultMsg = 'An error occurred. Please try again later.') => {
  const errorMessages = error?.response?.data || { error: [defaultMsg] };
  const status = error?.response?.status
  if (status === 403){
    toast.error("Access denied.Please login again")
    axiosInstance.post('/logout/')
    .catch(()=>{})
    setTimeout(() => {
      window.location.href='/login'
    }, 2000);
    return
  }

  toast.error(
    <div>
      {Object.values(errorMessages)
        .flat()
        .map((msg, index) => (
          <p key={index} className="mb-1">
            {msg}
          </p>
        ))}
    </div>,
    { autoClose: 3000 }
  );
};

export default ErrorHandler;
