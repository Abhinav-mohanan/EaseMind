import { toast } from 'react-toastify';

const ErrorHandler = (error, defaultMsg = 'An error occurred. Please try again later.') => {
  const errorMessages = error?.response?.data || { error: [defaultMsg] };

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
