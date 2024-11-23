import React, { useState } from 'react';
import { MdOutlineFavorite, MdDelete } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
const PostCard = ({ post, userInfo, handleLikePost, handleComment, handleDeletePost, handleDeleteComment }) => {
    const [commentContent, setCommentContent] = useState('');
    const isLiked = post.likes.includes(userInfo.id);
  
    const submitComment = () => {
      if (commentContent.trim()) {
        handleComment(post._id, commentContent);
        setCommentContent('');
      }
    };
  
    return (
      <div className="flex flex-col justify-between bg-gray-600 rounded-sm p-4">
        <div className="text-gray-200 mt-2">{post.user?.fullname || "Unknown User"}</div>
        <div>
          <p className="text-gray-300 my-2">{post.content}</p>
          {post.postType === 'file' && post.fileUrl && (
            <img src={post.fileUrl} alt="Post Image" className="w-full h-auto rounded" />
          )}
        </div>
  
        <div className="mt-4 w-full flex items-center">
          <div className="text-white p-2 w-3/6 text-xl font-semibold flex justify-around">
            <button onClick={() => handleLikePost(post._id)}>
              {isLiked ? <MdOutlineFavorite style={{ color: 'white' }} /> : <CiHeart />}
            </button>
           
            <button onClick={() => handleDeletePost(post._id)}>
              <MdDelete />
            </button>
          </div>
          <p className="text-sm text-gray-400">{post.likes.length} likes</p>
        </div>
  
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
  
        <div className="mt-4 space-y-2">
          {post.comments && post.comments.length > 0 ? (
            
            post.comments.map((comment) => (
                
              <div key={comment._id} className="flex justify-between items-center text-sm text-gray-400">
                <div>
                  <span className="font-semibold">
                    {comment.user?.fullname || "Unknown User"}:
                  </span>
                  {comment.content}
                </div>
                {comment.user?._id === userInfo.id && (
                    
                  <button
                    onClick={() => handleDeleteComment(post._id, comment._id)}
                    className="ml-2 white hover:white"
                  >
                    <MdDelete />
                  </button>
                )}




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
  
  
  



