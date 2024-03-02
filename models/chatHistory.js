// models/chatHistory.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'admin'],
    required: true,
  },
  text: String,
  timestamp: { type: Date, default: Date.now }
});

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true, // Each user should have only one chat history
  },
  messages: [messageSchema], // Array of messages sent by both users and admins
});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

module.exports = ChatHistory;
