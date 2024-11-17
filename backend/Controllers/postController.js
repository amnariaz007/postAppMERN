const postModel = require('../models/postModel');
const userModel = require("../models/userModel")
const mongoose = require('mongoose')

module.exports.createPost = async (req, res) => {
    try {
        const { id, postType, content } = req.body;
        
        if (postType === 'file') {
            console.log("File received:", req.file);
            if (!req.file) {
                return res.status(400).send("File is required for file-type posts.");
            }
        }
        const postData = {
            user: id,
            postType,
            content: postType === 'text' ? content : undefined,
            fileUrl: postType === 'file' ? `uploads/posts/${req.file.filename}` : undefined,
            likes: [],
            comments: []
        };

        const post = await postModel.create(postData);
        res.status(201).json({ message: 'Post created successfully', post });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send(err.message);
    }
};




module.exports.likePost = async (req, res) => {
    try {
        const { id } = req.body;
        const userId = req.user._id; 

        if (!id) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Post ID" });
        }

        let post = await postModel.findById(id).populate("user");
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        let resMessage;
        if (post.likes.indexOf(userId) === -1) {
            post.likes.push(userId);
            resMessage = "Post liked successfully";
        } else {
            post.likes.splice(post.likes.indexOf(userId), 1);
            resMessage = "Post unliked successfully";
        }
        await post.save();

        res.status(200).json({ message: resMessage, post });
    } catch (err) {
        console.error("Error liking post:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports.deletePost = async(req,res) =>{
    try {
        const { id } = req.body;
        const userId = req.user._id 
        console.log(userId, "user ID");

        // Find and delete the task
        const post = await postModel.findByIdAndDelete(id);
        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }
        await userModel.findByIdAndUpdate(userId, { $pull: { post: id } });
        res.status(200).json({ message: "post deleted successfully" });
    } catch (err) {
        console.error(err); 
        res.status(500).json({ message: "Internal server error" });
    }
}


module.exports.getUserPosts = async (req, res) => {
    try {
        let { id } = req.params; // Extract user ID from URL params
        console.log("User ID from params:", id);

        // Remove colon if present in the `id`
        id = id.startsWith(":") ? id.slice(1) : id;

        // Validate and convert `id` to ObjectId if possible
        const objectId = new mongoose.Types.ObjectId(id) ;

        // Fetch posts using the correct `user` field
        const posts = await postModel.find({ user: { $in: [id, objectId] } }).populate('user', 'fullname');;

        console.log("Query result:", posts);

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found for this user" });
        }

        res.status(200).json({ message: "All posts", posts });
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};






module.exports.getAllPosts = async (req, res) => {
    try {
        // Find all posts and populate user and comments fields if needed
        const posts = await postModel.find()
            .populate("user", "fullname email") // Populate user with selected fields
            .populate({
                path: 'comments',
                populate: {
                    path: 'user', // Populate user details within each comment
                    select: 'fullname email' // Select specific fields from user
                }
            })
            .sort({ createdAt: -1 }); 

        res.status(200).json({ message: "Posts retrieved successfully", posts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};




