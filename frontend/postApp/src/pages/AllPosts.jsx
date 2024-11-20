import React, { useEffect, useState } from 'react';
import { apiClient } from '../lib/api-client'; 
import { GET_ALL_POST, LIKE_POST  } from '../utils/constants';
import PostCard from '../components/PostCard'

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({}); // Assuming you have a way to set this (maybe from context or local storage)

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

  const handleComment = (postId) => {
    // Implement the logic to update a post here
    console.log('Update post:', postId);
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
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">All Posts</h1>
      {posts.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              userInfo={userInfo}
              handleLikePost={handleLikePost}
              handleUpdatePost={handleComment}
              handleDeletePost={handleDeletePost}
            />
          ))}
        </div>
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default AllPosts;
