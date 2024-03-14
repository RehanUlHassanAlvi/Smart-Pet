const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/', async (req, res) => {
  try {
    const email = req.body.email;
    let user = await User.findOne({ 'email': email });

    if (user) {
      let existingRfq = user.rfqs.find(rfq => rfq.phone === req.body.rfqs[0].phone);

      if (existingRfq) {
        // If rfq already exists, update its details
        existingRfq = Object.assign(existingRfq, req.body.rfqs[0]);
      } else {
        // If rfq doesn't exist, create a new one
        let maxrfqId = 0;
        if (user.rfqs && user.rfqs.length > 0) {
          maxrfqId = Math.max(...user.rfqs.map(rfq => rfq.rfqId));
        }
        const currentrfq = req.body.rfqs[0];
        currentrfq.rfqId = maxrfqId + 1;
        user.rfqs.push(currentrfq);
      }

      await user.save();
      return res.status(200).json({ message: 'User updated successfully', user });
    } else {
      // Insert scenario
      let maxId = 1;
      const result = await User.find().sort({ id: -1 }).limit(1);
      if (result.length > 0) {
        maxId = result[0].id + 1;
        console.log('Max ID:', maxId);
      } else {
        console.log('No documents found in the collection.');
      }
      
      const userObj = req.body;
      userObj.id = maxId;
      userObj.leadId=formatId(maxId)
      userObj.rfqs[0].rfqId = 1;

      user = new User(userObj);
      await user.save();

      res.status(201).json({ message: 'New user created successfully', user });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});




   // Retrieve chat history for a user
   router.get('/users', async (req, res) => {
   
  
    try {
      const users = await User.find({ }).sort({ lastMessageTimestamp : -1});
  
      if (!users) {
        return res.status(200).json({ message: 'No Users found' });
      }
  
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });


  //generate leadId from Id
  function formatId(id) {
    let today = new Date();
    let year = today.getFullYear().toString();
    let month = (today.getMonth() + 1).toString().padStart(2, '0'); 
    let day = today.getDate().toString().padStart(2, '0');  
    let yymmdd = year + month + day;

    let paddedId = id.toString().padStart(3, '0'); // Pad ID to at least 3 digits
    let length = paddedId.length;
    let maxDigits = 3; // Maximum digits before extending YYMMDD

    while (length > maxDigits) {
        yymmdd += 'N'; // Extend YYMMDD with 'N' for each additional digit
        maxDigits++;
    }

    return yymmdd + paddedId;
}




module.exports = router;
