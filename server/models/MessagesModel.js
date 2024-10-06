import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    messageType: {
        type: String,
        enum: ['text', 'file'],
        required: true,
    },
    content: {
        type: String,
        required: function () {
            return this.messageType === 'text';  // Only required for text messages
        },
    },
    fileUrl: {
        type: String,
        required: function () {
            return this.messageType === 'file';  // Only required for file messages
        },
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

// Default export
const Message = mongoose.model('Messages', messagesSchema);

export default Message;
