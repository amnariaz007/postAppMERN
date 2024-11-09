const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Reference to User model
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post', // Reference to Post model
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('comment', CommentSchema);