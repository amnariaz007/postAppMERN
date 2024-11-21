const commentModel = require('../models/commentModel')
const postModel = require('../models/postModel'); 

module.exports.addComment = async (req, res) => {
    try {
      const { postId, content } = req.body;
      const userId = req.user._id; // Assuming `req.user` is populated from middleware
  
      // Check if the post exists
      const post = await postModel.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Create a new comment
      const comment = new commentModel({
        content,
        user: userId,
        post: postId,
      });
  
      // Save the comment to the database
      const savedComment = await comment.save();
  
      // Add the comment to the post's comments array
      post.comments.push(savedComment._id);
      await post.save();
  
      // Populate user field in the saved comment (optional)
      const populatedComment = await commentModel
        .findById(savedComment._id)
        .populate('user', 'fullname'); // Replace 'fullname' with the actual field you want
  
      res.status(201).json({ message: 'Comment added successfully', comment: populatedComment });
    } catch (err) {
      console.error('Error adding comment:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

  module.exports.deleteComment = async (req, res) => {
    const { postId, commentId } = req.body;
    try {
      const post = await postModel.findById(postId);
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);
      if (commentIndex === -1) return res.status(404).json({ message: "Comment not found" });
  
      post.comments.splice(commentIndex, 1);
      await post.save();
  
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Server error" });
    }
};

  
