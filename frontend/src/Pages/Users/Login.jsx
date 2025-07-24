import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../Components/Users/AuthForm';

// login
const Login = () => {
  const navigate = useNavigate();
  const role = useSelector((state) => state.role.selectedRole);
  useEffect(() => {
    if (!role) navigate('/roleSelection');
  }, [role, navigate]);
  const fields = [
    { name: 'email', type: 'email', placeholder: 'Enter your email' },
    { name: 'password', type: 'password', placeholder: 'Enter your password' },
  ];
  return <AuthForm role={role} type="login" fields={fields} />;
};

export default Login;
