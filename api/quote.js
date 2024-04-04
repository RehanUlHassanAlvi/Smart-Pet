const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();
const Quote = require('../models/generatedQuote');
const { sendQuoteEmail:sendQuoteEmail } = require('./email.js');
const user=require('../models/user.js')


router.post('/sendEstimate', async (req, res) => {
    const { userId, quotes } = req.body;
    let response = {};

    try {
        // Find the existing quotes for the user
        let existingQuote = await Quote.findOne({ userId });

        // If no existing quotes found, create a new document
        if (!existingQuote) {
            existingQuote = new Quote({ userId });
        }
        let userObj = await user.findOne({ 'id': userId });
        console.log("user", userObj.email)
        
        // Iterate over each new quote to add
        for (const newQuote of quotes) {
            // Check if the new quote has a quoteId
            if (newQuote.hasOwnProperty('quoteId') && newQuote.quoteId !== '') {
                const existingQuoteIndex = existingQuote.quotes.findIndex(quote => quote.quoteId === newQuote.quoteId);
                if (existingQuoteIndex !== -1) {
                    const existingQuoteItem = existingQuote.quotes[existingQuoteIndex];
                    if (existingQuoteItem.status === 'sent') {
                        // If status is 'sent', send the email again but do not update the object
                        await sendQuoteEmail({ ...newQuote, email: userObj.email });
                    } else {
                        // If status is 'draft', update the quote and send email
                        existingQuoteItem.status = 'sent';
                        existingQuote.quotes[existingQuoteIndex] = { ...existingQuoteItem, ...newQuote };
                        await existingQuote.save();
                        await sendQuoteEmail({ ...newQuote, email: userObj.email });
                    }
                } else {
                    // If quoteId not found, create a new quote
                    await createNewQuote(existingQuote, newQuote);
                    await sendQuoteEmail({ ...newQuote, email: userObj.email });
                }
            } else {
                // If the new quote doesn't have a quoteId, create a new quote with quoteId and quoteLeadID and status=sent
                await createNewQuote(existingQuote, newQuote);
                await sendQuoteEmail({ ...newQuote, email: userObj.email });
            }
        }

        res.status(200).json({ message: 'Quotes saved successfully', response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Function to create a new quote
async function createNewQuote(existingQuote, newQuote) {
    const quoteId = existingQuote.quotes.length + 1;
    const quoteLeadId = formatId(quoteId.toString());
    existingQuote.quotes.push({
        ...newQuote,
        quoteId,
        quoteLeadId,
        status: 'sent'
    });
    response = await existingQuote.save(); // Save the updated document
}




router.post('/saveQuote', async (req, res) => {
    const { userId, quotes } = req.body;

    try {
        // Find the existing quotes for the user
        let existingQuote = await Quote.findOne({ userId });

        // If no existing quotes found, create a new document
        if (!existingQuote) {
            existingQuote = new Quote({ userId });
        }

        // Iterate over each new quote to add
        for (const newQuote of quotes) {
            // Check if the new quote has a status and if it's already sent
            if (newQuote.hasOwnProperty('status') && newQuote.status === 'sent') {
                // Skip updating if the status is "sent"
                console.log('Skipping update for sent quote');
                continue;
            }

            // Check if the new quote has a quoteId
            if (newQuote.hasOwnProperty('quoteId') && newQuote.quoteId !== '') {
                // Find the quote with the same quoteId in the existing quotes array
                const existingQuoteIndex = existingQuote.quotes.findIndex(quote => quote.quoteId === newQuote.quoteId);

                // If the quote with the same quoteId is found, update its details
                if (existingQuoteIndex !== -1) {
                    existingQuote.quotes[existingQuoteIndex] = {
                        ...newQuote,
                        quoteLeadId: existingQuote.quotes[existingQuoteIndex].quoteLeadId, // Preserve existing quoteLeadId
                        status: 'draft'
                    };
                } else {
                    // If the quote with the same quoteId is not found, just create a new quote
                    existingQuote.quotes.push({
                        ...newQuote,
                        quoteLeadId: formatId(newQuote.quoteId.toString()), // Create quoteLeadId if not present
                        status: 'draft'
                    });
                }
            } else {
                // If the new quote doesn't have a quoteId, create a new quote with quoteLeadId and status
                existingQuote.quotes.push({
                    ...newQuote,
                    quoteId: existingQuote.quotes.length + 1, // Assign a new quoteId
                    quoteLeadId: formatId((existingQuote.quotes.length + 1).toString()), // Create quoteLeadId
                    status: 'draft'
                });
            }
        }

        // Save the updated document
       let response=await existingQuote.save();
        res.status(200).json({ message: 'Quotes saved successfully', res: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



router.get('/getQuotes/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
      // Find quotes for the specified email
      const existingQuote = await Quote.findOne({ userId });

      if (existingQuote) {
          // Return the quotes if found
          res.status(200).json(existingQuote.quotes);
      } else {
          // Return a message if no quotes found for the email
          res.status(404).json({ message: 'No quotes found for the specified user' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
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
