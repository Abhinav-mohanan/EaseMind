import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-7xl font-extrabold text-customBlue mb-4">404</h1>

      <p className="text-2xl font-semibold text-gray-800 mb-2">
        Page Not Found
      </p>

      <p className="text-gray-600 mb-8 max-w-md">
        Sorry, the page you are looking for doesn't exist or may have been moved.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-6 py-2 bg-customBlue text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Home size={18} />
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
