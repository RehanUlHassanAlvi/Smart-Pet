// api/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/', async (req, res) => {
  try {
    const { email, phone, name } = req.body;

    let user = await User.findOne({ email, phone, name });

    // If user exists, update
    if (user) {
      user = await User.findOneAndUpdate(
        { email, phone, name },
        { $set: req.body },
        { new: true }
      );
      return res.status(200).json({ message: 'User updated successfully', user });
    }

    // If user doesn't exist, create new user
    user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'New user created successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
