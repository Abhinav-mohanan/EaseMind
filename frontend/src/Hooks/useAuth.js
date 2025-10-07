import { useState, useEffect } from 'react';
import { AuthStatusApi } from '../api/authApi';

export const useAuth = () => {
  const [auth, setAuth] = useState({
    isAuthenticated: undefined, 
    role: null,
    is_verified: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await AuthStatusApi();
        setAuth({
          isAuthenticated: data.isAuthenticated,
          role: data.role,
          is_verified: data.is_verified,
        });
        localStorage.setItem('is_verified', data.is_verified);
        localStorage.setItem('role', data.role);
      } catch (error) {
        setAuth({
          isAuthenticated: false,
          role: null,
          is_verified: false,
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { ...auth, loading };
};