// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRouter = require('./api/user');
const emailRouter=require ('./api/email')

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());


app.use('/api/user', userRouter);
app.use('/api/email', emailRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
