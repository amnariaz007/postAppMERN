import React, { useEffect, useState } from 'react';
import { apiClient } from '../lib/api-client'; 
import { GET_ALL_POST, LIKE_POST , ADD_COMMENT_POST,DELETE_COMMENT_POST,USER_INFO } from '../utils/constants';
import PostCard from '../components/PostCard'
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AllPosts = () => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setuserInfo] = useState({}); // Assuming you have a way to set this (maybe from context or local storage)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await apiClient.get(GET_ALL_POST, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set the posts in local state
        setPosts(response.data.posts);
      } catch (err) {
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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

  const handleDeleteComment = async (postId, commentId) => {
    // Optimistically update the UI
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              comments: post.comments.filter(comment => comment._id !== commentId)
            }
          : post
      )
    );
  
    try {
      const response = await apiClient.post(DELETE_COMMENT_POST, {
        postId,
        commentId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Comment deleted:', response.data);
    } catch (error) {
      console.error('Error deleting comment:', error);
      // Revert the UI changes in case of failure
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: [...post.comments, { _id: commentId }] // Add back the comment if deletion fails
              }
            : post
        )
      );
    }
  };
  

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await apiClient.delete(`/delete-post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // After deleting a post, fetch the updated posts to reflect changes
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">All Posts</h1>
      
      <div className="my-2">
        <button
          onClick={() => navigate('/')}
          className="bg-blue-400 rounded p-4"
        >
          Go back to home
        </button>
      </div>
      {posts.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              userInfo={userInfo}
              handleLikePost={handleLikePost}
              handleComment={handleComment}
              handleDeleteComment={handleDeleteComment}
              handleDeletePost={handleDeletePost}
            />
          ))}
        </div>
      ) : (
        <p>No posts available.</p>
      )}
      
    </div>
    </div>
  );
};

export default AllPosts;
