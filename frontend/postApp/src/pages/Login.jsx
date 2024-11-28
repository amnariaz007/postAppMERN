import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
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
      toast.error('email is required');
      return false;
    }
    if (!password.length) {
      toast.error('password is required');
      return false;
    }
    return true;
  };

  const HandleLogin = async () => {
    if (validatelogin()) {
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
    }
  };

  const handleGoogleLoginSuccess = async (tokenResponse) => {
    console.log('Google Token:', tokenResponse);

    try {
      // Send token to your backend for verification
      const response = await apiClient.post(GOOGLE_LOGIN, { token: tokenResponse.access_token });
      console.log('Backend response:', response.data);

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setuserInfo(response.data.user);
        navigate('/');
      }
    } catch (err) {
      console.error('Google login failed:', err);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: (error) => {
      console.error('Google Login Failed:', error);
    },
  });

  useEffect(() => {
    console.log('Current userInfo:', userInfo);
  }, [userInfo]);

  return (
    <>
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
            <button
              onClick={() => googleLogin()}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Login with Googlee
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
