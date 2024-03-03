const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/', async (req, res) => {
  try {
    const email = req.body.email;
    let user = await User.findOne({ 'email': email });

    if (user) {
      let existingInvoice = user.invoices.find(invoice => invoice.phone === req.body.invoices[0].phone);

      if (existingInvoice) {
        // If invoice already exists, update its details
        existingInvoice = Object.assign(existingInvoice, req.body.invoices[0]);
      } else {
        // If invoice doesn't exist, create a new one
        let maxInvoiceId = 0;
        if (user.invoices && user.invoices.length > 0) {
          maxInvoiceId = Math.max(...user.invoices.map(invoice => invoice.invoiceId));
        }
        const currentInvoice = req.body.invoices[0];
        currentInvoice.invoiceId = maxInvoiceId + 1;
        user.invoices.push(currentInvoice);
      }

      await user.save();
      return res.status(200).json({ message: 'User updated successfully', user });
    } else {
      // Insert scenario
      let maxId = 0;
      const result = await User.find().sort({ id: -1 }).limit(1);
      if (result.length > 0) {
        maxId = result[0].id + 1;
        console.log('Max ID:', maxId);
      } else {
        console.log('No documents found in the collection.');
      }

      const userObj = req.body;
      userObj.id = maxId;
      userObj.invoices[0].invoiceId = 1;

      user = new User(userObj);
      await user.save();

      res.status(201).json({ message: 'New user created successfully', user });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
