import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for errors
import { apiClient } from '../lib/api-client';
import { useAppStore } from '../store';
import { LOGIN_ROUTE, GOOGLE_LOGIN } from '../utils/constants';

const Login = () => {
  const navigate = useNavigate();
  const { userInfo, setuserInfo } = useAppStore();
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');

  const validatelogin = () => {
    if (!email.length) {
      toast.error('Email is required');
      return false;
    }
    if (!password.length) {
      toast.error('Password is required');
      return false;
    }
    return true;
  };

  const HandleLogin = async () => {
    if (validatelogin()) {
      try {
        const response = await apiClient.post(LOGIN_ROUTE, { email, password });
        console.log('Full response:', response);

        if (response.data && response.data.id && response.data.token) {
          localStorage.setItem('token', response.data.token);
          setuserInfo(response.data);
          setTimeout(() => {
            console.log('Updated userInfo after login:', useAppStore.getState().userInfo);
            navigate('/');
          }, 100);
        } else {
          console.error('Login failed or unexpected response structure:', response.data);
        }
      } catch (err) {
        console.error('Login error:', err);
        toast.error('Failed to login');
      }
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    console.log('Google Credential Response:', credentialResponse);

    if (!credentialResponse.credential) {
      console.error('Credential is missing in the Google login response');
      return;
    }

    try {
      const response = await apiClient.post(GOOGLE_LOGIN, { token: credentialResponse.credential });
      console.log('Backend response:', response.data);

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setuserInfo(response.data.user);
        navigate('/');
      }
    } catch (err) {
      console.error('Google login failed:', err);
      toast.error('Google login failed');
    }
  };

  useEffect(() => {
    console.log('Current userInfo:', userInfo);
  }, [userInfo]);

  return (
    <div className="top-0 left-0 flex items-center justify-center h-screen w-full">
      <div className="w-2/6 bg-gray-900 p-4 rounded">
        <input
          type="text"
          placeholder="Email"
          name="email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
          className="px-3 py-2 rounded w-full bg-gray-700"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          className="px-3 py-2 rounded w-full my-3 bg-gray-700"
        />
        <div className="w-full flex items-center justify-between">
          <button onClick={HandleLogin} className="bg-slate-500 rounded p-2">
            Login
          </button>
          <Link to="/Signup"> Signup here!</Link>
          <Link to="/forgetpassword"> forgot password </Link>
        </div>
        <div className="w-full flex items-center justify-center mt-3">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            clientId="215959850029-qgugg2bb27t50eohcaaj6jkssi0r1qt9.apps.googleusercontent.com" 
            onError={() => console.error('Google Login Failed')}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
