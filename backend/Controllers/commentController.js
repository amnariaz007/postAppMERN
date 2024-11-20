const commentModel = require('../models/commentModel')
const postModel = require('../models/postModel'); 

module.exports.addComment = async (req, res) => {
    try {
        const { postId, content } = req.body;
        const userId = req.user._id; 
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const comment = new commentModel({
            content,
            user: userId,
            post: postId
        }).populate('user', 'fullname');
        await comment.save();
        post.comments.push(comment._id); 
        await post.save();

        res.status(201).json({ message: 'Comment added successfully', comment });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports.deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.body;

        // Find and delete the comment
        const comment = await commentModel.findByIdAndDelete(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Remove the comment ID from the post's comments array
        const updateResult = await postModel.updateOne(
            { id: postId },
            { $pull: { comments: commentId } }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(404).json({ message: "Post not found or comment not linked to post" });
        }

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

