import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LOGOUT } from '../utils/constants';
import { apiClient } from '../lib/api-client';

const Sidebar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

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
      <div>
        <h2 className="text-xl font-serif">Sidebar Title</h2>
        <h4 className="text-gray-600 mb-3">Subtitle</h4>
        <hr />
      </div>
      <div className="my-2 flex-grow">
       
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
