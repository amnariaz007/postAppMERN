const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', 
        required: true
    },
    postType:{
        type: String,
        enum: ["text", "file"],
        required : true
    },
    content: { type: String, required: function() { return this.messageType !== 'file'; } },
    fileUrl: { type: String, required: function() { return this.messageType === 'file'; } },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }], 
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }] 
}, {
    timestamps: true
});

module.exports = mongoose.model('post', PostSchema);