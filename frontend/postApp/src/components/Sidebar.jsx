import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api-client'; 
import { GET_ALL_POST,LOGOUT } from '../utils/constants'; 

const Sidebar = ({ setPosts }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  console.log(token,"tokensidebar")
  
  // Logout function
  const logout = async () => {
    try {
      // Make the API call to logout using POST method
      await apiClient.get(LOGOUT, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      // Clear the token from localStorage
      localStorage.removeItem('token');
  
      // Redirect to the login page after successful logout
      navigate('/Login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  

  // Get all posts function
  const getAllPosts = async () => {
    try {
      // Make the API call to get all posts
      const response = await apiClient.get(GET_ALL_POST, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Set the posts state with the response data
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div>
        <h2 className="text-xl font-serif">Sidebar Title</h2>
        <h4 className="text-gray-600 mb-3">Subtitle</h4>
        <hr />
      </div>

      {/* Add your navigational links here */}
      <div className="my-2 flex-grow">
        <Link
          to="/"
          className="flex items-center gap-2 p-2 hover:bg-slate-500 transition-all rounded"
        >
          Home
        </Link>
        <Link
          to="/tasks"
          className="flex items-center gap-2 p-2 hover:bg-slate-500 transition-all rounded"
        >
          Tasks
        </Link>
      </div>

      {/* Get All Posts Button */}
      <div className="my-2">
        <button
          onClick={getAllPosts}
          className="bg-blue-400 rounded w-full p-4"
        >
          Get All Posts
        </button>
      </div>

      {/* Logout Button */}
      <div className="mt-auto">
        <button onClick={logout} className="bg-gray-400 rounded w-full p-4">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
