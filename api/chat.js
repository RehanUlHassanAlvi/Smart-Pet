const express = require('express');
const Pusher = require('pusher');
const ChatHistory = require('../models/chatHistory.js');

const router = express.Router();
const pusher = new Pusher({
  appId: '1765121',
  key: 'ef1652ecbd8986016d7d',
  secret: 'adaf7bd2c537f2e6d386',
  cluster: 'ap2',
});

// Save message to database and broadcast via Pusher
router.post('/messages', async (req, res) => {
    const { userId, sender, text } = req.body;
    try {
      let chatHistory = await ChatHistory.findOne({ userId });
  
      if (!chatHistory) {
        // If chat history doesn't exist, create a new one
        chatHistory = new ChatHistory({ userId, messages: [] });
      }
  
      // Add the new message to the chat history
      chatHistory.messages.push({ sender, text });
      await chatHistory.save();
      console.log(req.body);

      // Trigger 'message' event on 'chat' channel (Pusher)
      pusher.trigger('chat', 'message', { sender, text ,userId});
  
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Retrieve chat history for a user
  router.get('/messages/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const chatHistory = await ChatHistory.findOne({ userId });
  
      if (!chatHistory) {
        return res.status(404).json({ message: 'Chat history not found' });
      }
  
      res.json(chatHistory.messages);
    } catch (error) {node
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });


  
  module.exports = router;