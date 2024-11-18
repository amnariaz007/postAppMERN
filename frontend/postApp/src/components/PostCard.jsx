import React from 'react';
import { MdOutlineFavorite, MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";

const PostCard = ({ post, userInfo, handleLikePost, handleUpdatePost, handleDeletePost }) => {
  const isLiked = post.likes.includes(userInfo.id);  // Check if the logged-in user has liked the post
  
  return (
    <div key={post._id} className="flex flex-col justify-between bg-gray-600 rounded-sm p-4">
            <div className="text-gray-200 mt-2">{post.user.fullname}</div>
      <div>
        <p className="text-gray-300 my-2">{post.content}</p>
        {post.postType === 'file' && post.fileUrl && (
          <img src={post.fileUrl} alt="Post Image" className="w-full h-auto rounded" />
        )}
      </div>
      
      {/* Display the username (post.user.name) */}
  
      
      <div className="mt-4 w-full flex items-center">
        <div className="text-white p-2 w-3/6 text-xl font-semibold flex justify-around">
          {/* Like button */}
          <div>
            <button onClick={() => handleLikePost(post._id)}>
              {isLiked ? (
                <MdOutlineFavorite style={{ color: "white" }} />
              ) : (
                <CiHeart />
              )}
            </button>
          </div>
          
          {/* Edit button (for the logged-in user to update their own post) */}
          <button onClick={() => handleUpdatePost(post._id)}>
            <FaEdit />
          </button>
          
          {/* Delete button (for the logged-in user to delete their own post) */}
          <button onClick={() => handleDeletePost(post._id)}>
            <MdDelete />
          </button>
        </div>
        
        {/* Display the number of likes */}
        <p className="text-sm text-gray-400">{post.likes.length} likes</p>
      </div>
    </div>
  );
};

export default PostCard;
