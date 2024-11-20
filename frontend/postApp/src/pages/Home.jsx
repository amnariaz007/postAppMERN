import React, { useState, useEffect } from 'react';
import { MdAddCircle } from "react-icons/md";
import { apiClient } from '../lib/api-client';
import { CREATE_POST, USER_INFO, GET_USER_POST, LIKE_POST, ADD_COMMENT_POST } from '../utils/constants';
import { useAppStore } from '../store';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';

const Home = () => {
  const { userInfo, setuserInfo } = useAppStore();
  const token = localStorage.getItem('token');

  const [isAddPostOpen, setIsAddPostOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [posts, setPosts] = useState([]);

  const handleAddPostToggle = () => setIsAddPostOpen(!isAddPostOpen);
  const handleImageUpload = (e) => setPostImage(e.target.files[0]);

  const handleSubmitPost = async () => {
    try {
      const postData = {
        id: userInfo.id,
        postType: postImage ? 'file' : 'text',
        content: postContent,
      };

      let response;
      if (postImage) {
        const formData = new FormData();
        formData.append('id', postData.id);
        formData.append('postType', postData.postType);
        formData.append('content', postData.content);
        formData.append('file', postImage);

        response = await apiClient.post(CREATE_POST, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await apiClient.post(CREATE_POST, postData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      setIsAddPostOpen(false);
      setPostContent('');
      setPostImage(null);
      setPosts([response.data.post, ...posts]);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleLikePost = async (id) => {
    try {
      const response = await apiClient.post(LIKE_POST, { id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === id
            ? { ...post, likes: response.data.post.likes }
            : post
        )
      );
    } catch (err) {
      console.error('Error liking post:', err.message);
    }
  };

  const handleComment = async (postId, content) => {
    try {
      const response = await apiClient.post(ADD_COMMENT_POST, { postId, content }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: [...post.comments, response.data.comment] }
            : post
        )
      );
    } catch (err) {
      console.error('Error adding comment:', err.message);
    }
  };
  

  const handleDeletePost = (id) => {
    console.log('Delete post:', id);
    // Add delete functionality here
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await apiClient.get(USER_INFO, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setuserInfo(response.data);
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };

    if (!userInfo && token) fetchUserInfo();
  }, [userInfo, token, setuserInfo]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userInfo) return;
      try {
        const response = await apiClient.get(`${GET_USER_POST}/${userInfo.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data.posts);
      } catch (err) {
        console.error('Error fetching posts:', err.message);
      }
    };

    fetchPosts();
  }, [userInfo, token]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-grow p-4 space-y-4">
        {/* Add Post Card */}
        <div
          onClick={handleAddPostToggle}
          className="flex flex-col justify-center items-center bg-gray-600 rounded-sm p-4 cursor-pointer"
        >
          <h2 className="text-2xl">Add Post</h2>
          <MdAddCircle className="text-5xl" />
        </div>

        {/* Display Posts */}
        <div className="grid grid-cols-3 gap-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                userInfo={userInfo}
                handleLikePost={handleLikePost}
                handleComment={handleComment}
                handleDeletePost={handleDeletePost}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">No posts available</p>
          )}
        </div>

        {/* Add Post Form */}
        {isAddPostOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-1/3">
              <h3 className="text-xl text-black font-semibold mb-4">
                Create a New Post
              </h3>
              <textarea
                placeholder="Write your post here..."
                className="w-full p-2 mb-4 border rounded text-black"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
              <input type="file" className="w-full p-2 mb-4" onChange={handleImageUpload} />
              <div className="flex justify-end">
                <button
                  onClick={handleSubmitPost}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Submit Post
                </button>
                <button
                  onClick={handleAddPostToggle}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
