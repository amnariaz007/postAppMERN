import React, { useState, useEffect } from 'react';
import { MdOutlineFavorite, MdDelete, MdAddCircle } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { apiClient } from '../lib/api-client';
import { CREATE_POST, USER_INFO } from '../utils/constants'
import { useAppStore } from '../store';


const Home = () => {

  const { userInfo, setuserInfo } = useAppStore();
  console.log(userInfo);
  const token = localStorage.getItem('token');
  console.log('Token:', token);
  const [isAddPostOpen, setIsAddPostOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [posttype, setposttype] = useState(null);

  const handleAddPostToggle = () => {
    setIsAddPostOpen(!isAddPostOpen);
  };

  const handleImageUpload = (e) => {
    setposttype(e.target.files[0]);
  };

  const handleSubmitPost = async () => {


    try {
      const postData = {
        id: userInfo.id, 
        postType: posttype ,
        content: posttype === 'text' ? content : undefined,
        fileUrl: posttype === 'file' ? `uploads/posts/${req.file.filename}` : undefined,
      };

      let response;

      if (posttype) {
    
        const formData = new FormData();
        formData.append('id', postData.id);  
        formData.append('postType', postData.postType);
        formData.append('content', postData.content);
       


        response = await apiClient.post(CREATE_POST, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,  
        });
      } else {
        // For text-only posts, send JSON
        response = await apiClient.post(CREATE_POST, postData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      console.log(response.data);
      setIsAddPostOpen(false);
      setPostContent('');
      setposttype(null)
   

    } catch (err) {
      console.log(err.message)
    }

  };

  useEffect(() => {
    if (!userInfo && token) {
      const fetchUserInfo = async () => {
        try {
          const response = await apiClient.get(USER_INFO, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setuserInfo(response.data);  // Update store with user info
        } catch (err) {
          console.error('Error fetching user info:', err);
        }
      };
      fetchUserInfo();
    }
  }, [userInfo, token, setuserInfo]);



  return (
    <div className='grid grid-cols-3 gap-4 p-4'>
      {/* Existing post cards */}
      <div className='flex flex-col justify-between bg-gray-600 rounded-sm p-4'>
        <div>
          <h3 className='text-xl font-semibold'>Post Title</h3>
          <p className='text-gray-300 my-2'>Description</p>
        </div>
        <div className='mt-4 w-full flex items-center'>
          <div className='text-white p-2 w-3/6 text-xl font-semibold flex justify-around'>
            <button onClick={() => handleImportant()}>
              <CiHeart />
            </button>
            <button onClick={() => handleUpdate()}>
              <FaEdit />
            </button>
            <button onClick={() => handleDelete()}>
              <MdDelete />
            </button>
          </div>
        </div>
      </div>

      {/* Add Post Card */}
      <button onClick={handleAddPostToggle} className='flex flex-col justify-center items-center bg-gray-600 rounded-sm p-4'>
        <h2 className='text-2xl'>Add Post</h2>
        <MdAddCircle className='text-5xl' />
      </button>

      {/* Add Post Form (Visible when isAddPostOpen is true) */}
      {isAddPostOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-xl text-black font-semibold mb-4">Create a New Post</h3>
            <textarea
              placeholder="Write your post here..."
              className="w-full p-2 mb-4 border rounded text-black"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            <input
              type="file"
              className="w-full p-2 mb-4"
              onChange={handleImageUpload}
            />
            <div className="flex justify-end">
              <button onClick={handleSubmitPost} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                Submit Post
              </button>
              <button onClick={handleAddPostToggle} className="bg-gray-300 px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
