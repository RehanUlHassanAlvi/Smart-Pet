// api/index.js
const express = require('express');
const router = express.Router();

const chatRouter = require('./chat');
const { router: emailRouter } = require('./email.js');

router.use('/chat', chatRouter);
router.use('/email', emailRouter);

module.exports = router;
