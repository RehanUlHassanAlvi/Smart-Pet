// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const userRouter = require('./api/user');
const emailRouter=require ('./api/email')
const chatRouter=require ('./api/chat')

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
// Middleware

app.use('/api', chatRouter);
app.use('/api/user', userRouter);
app.use('/api/email', emailRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
