import React, { useState } from 'react';
import { MdOutlineFavorite, MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";

const PostCard = ({ post, userInfo, handleLikePost, handleComment, handleDeletePost }) => {
    const [commentContent, setCommentContent] = useState('');
    const isLiked = post.likes.includes(userInfo.id); // Check if the logged-in user has liked the post
  
    const submitComment = () => {
      if (commentContent.trim()) {
        handleComment(post._id, commentContent); // Add the comment
        setCommentContent(''); // Clear the input after submitting
      }
    };
  
    return (
      <div className="flex flex-col justify-between bg-gray-600 rounded-sm p-4">
        <div className="text-gray-200 mt-2">{post.user.fullname}</div>
        <div>
          <p className="text-gray-300 my-2">{post.content}</p>
          {post.postType === 'file' && post.fileUrl && (
            <img src={post.fileUrl} alt="Post Image" className="w-full h-auto rounded" />
          )}
        </div>
  
        <div className="mt-4 w-full flex items-center">
          <div className="text-white p-2 w-3/6 text-xl font-semibold flex justify-around">
            {/* Like button */}
            <button onClick={() => handleLikePost(post._id)}>
              {isLiked ? (
                <MdOutlineFavorite style={{ color: 'white' }} />
              ) : (
                <CiHeart />
              )}
            </button>
  
            {/* Add Comment Button */}
            <button onClick={submitComment}>
              <FaEdit />
            </button>
  
            {/* Delete button */}
            <button onClick={() => handleDeletePost(post._id)}>
              <MdDelete />
            </button>
          </div>
  
          <p className="text-sm text-gray-400">{post.likes.length} likes</p>
        </div>
  
        {/* Comment Input */}
        <div className="mt-4">
          <input
            type="text"
            className="w-full p-2 rounded text-black"
            placeholder="Write a comment..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <button
            onClick={submitComment}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Comment
          </button>
        </div>
  
        {/* Display Comments */}
        <div className="mt-4 space-y-2">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment._id} className="flex justify-between items-center text-sm text-gray-400">
                <span className="font-semibold">{comment.user.fullname}:</span> {/* Display commenter's name */}
                <span>{comment.content}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet</p>
          )}
        </div>
      </div>
    );
  };
  
  export default PostCard;
  
  



