import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LOGOUT,USER_INFO  } from '../utils/constants';
import { apiClient } from '../lib/api-client';

const Sidebar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [userInfo, setUserInfo] = useState({ fullname: '', email: '' });

  // Fetch user info
  const fetchUserInfo = async () => {
    try {
      const response = await apiClient.get(USER_INFO, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const logout = async () => {
    try {
      await apiClient.get(LOGOUT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem('token');
      navigate('/Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* User Info Section */}
      <div className="p-4 bg-gray-100 rounded mb-4">
        <h2 className="text-xl text-gray-500 font-semibold">{userInfo.fullname}</h2>
        <p className="text-sm text-gray-500">{userInfo.email}</p>
      </div>
      <div>
       
        <hr />
      </div>
      <div className="my-2 flex-grow">
        {/* Other content */}
      </div>
      <div className="my-2">
        <button
          onClick={() => navigate('/AllPosts')}
          className="bg-blue-400 rounded w-full p-4"
        >
          Go to All Posts
        </button>
      </div>
      <div className="mt-auto">
        <button onClick={logout} className="bg-gray-400 rounded w-full p-4">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
