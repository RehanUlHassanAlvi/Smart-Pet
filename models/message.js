// models/message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  // Add other necessary fields
});

module.exports = mongoose.model('Message', messageSchema);
