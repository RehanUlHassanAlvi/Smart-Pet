const express = require('express');
const Pusher = require('pusher');
const ChatHistory = require('../models/chatHistory.js');
const user=require('../models/user.js')

const router = express.Router();
const pusher = new Pusher({
  appId: '1765121',
  key: 'ef1652ecbd8986016d7d',
  secret: 'adaf7bd2c537f2e6d386',
  cluster: 'ap2',
});

router.post('/messages', async (req, res) => {
  const { userId, sender, text } = req.body;
  
  try {
      // Save message to chat history
      let chatHistory = await ChatHistory.findOneAndUpdate(
          { userId },
          { $push: { messages: { sender, text } } },
          { upsert: true, new: true }
      );
      
      // Update user timestamp
      let userObj = await user.findOneAndUpdate(
          { id: userId },
          { lastMessageTimestamp: new Date() },
          { new: true }
      );
      
      // Trigger Pusher event
      await pusher.trigger('chat', 'message', { sender, text, userId });
      
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