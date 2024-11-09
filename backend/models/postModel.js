const PostSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Reference to User model
        required: true
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }], // Users who liked the post
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }] // Comments on the post
}, {
    timestamps: true
});

module.exports = mongoose.model('post', PostSchema);