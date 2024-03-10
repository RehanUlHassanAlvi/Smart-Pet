const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();

async function sendEmail(mailObj) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'info@smartpetairtravel.com', 
        pass: 'hith jacw dkjz vjec' 
      }
    });

    let emailContent=generateEmailContent(mailObj)

    let toEmail = 'info@smartpetairtravel.com';
  
    const mailOptions_admin = {
      from: 'info@smartpetairtravel.com',
      to: toEmail, 
      subject: 'User Filled Form',
      html: emailContent
    };

    const mailOptions_user = {
      from: 'info@smartpetairtravel.com',
      to: mailObj.email, 
      subject: 'User Filled Form',
      html: emailContent
    };

    transporter.sendMail(mailOptions_admin, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        reject(error);
      } else {
        console.log('Email sent to admin:', info.response);
        resolve();
      }
    });

    transporter.sendMail(mailOptions_user, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        reject(error);
      } else {
        console.log('Email sent to user:', info.response);
        resolve();
      }
    });
  });
}

router.post('/', async (req, res) => {
  const mailObj = req.body;
  const userName = req.body.name;

  try {
    await sendEmail(mailObj); // Wait for email sending to complete
    res.status(200).json({ message: 'Email successfully sent!', userName });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error Sending Email!', userName });
  }
});



// Generate HTML email content
const generateEmailContent = (userData) => {
  let htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f2f2f2;
        margin: 0;
        padding: 20px;
      }
      h1 {
        color: #333;
        text-align: center;
      }
      .invoice {
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        padding: 20px;
        margin-bottom: 20px;
      }
      .invoice h2 {
        color: #007bff;
      }
      .invoice p {
        margin-bottom: 5px;
      }
      .pet {
        background-color: #f9f9f9;
        border-radius: 5px;
        padding: 10px;
        margin-top: 10px;
      }
      .pet h3 {
        color: #555;
      }
    </style>
  </head>
  <body>
  <h2>Thanks for filling the estimate form  ${userData.invoices[0].name} !</h2>  
    <!-- Iterate over invoices -->
    ${userData.invoices.map(invoice => `
      <div class="invoice">
        <h2>Name: ${invoice.name}</h2>
        <p>Phone: ${invoice.phone}</p>
        <p>Moved From: ${invoice.shippedFrom}</p>
        <p>Moved To: ${invoice.shippedTo}</p>
        <p>Departure Date: ${invoice.departureDate}</p>
        <h3>Pet Details</h3>
        ${invoice.pets.map(pet => `
          <div class="pet">
            <p>Name: ${pet.name}</p>
            <p>Breed: ${pet.breed}</p>
            <p>Age:   ${pet.ageInYears} years</p>
            <p>Weight: ${pet.weight} lbs</p>
            <p>Height: ${pet.height} inches</p>
            <p>length: ${pet.width} inches</p>
          </div>`).join('')}
  
        <p>Additional Comments: ${invoice.additionalComments}</p>
        <p>Have airline approved crates: ${invoice.approvedKennels}</p>
        <p>Referred By: ${invoice.hearDetails}</p>
        <p>Military Vet: ${invoice.militaryVet}</p>
        <p>Pets Microchipped: ${invoice.petsMicrochipped}</p>
        <p>Vaccinated for rabies in past 12 months: ${invoice.rabiesVaccine}</p>
        <p>Personal travel within 5 days: ${invoice.with5DaysTravel}</p>
      </div>`).join('')}
  </body>
  </html>`;  

  return htmlContent;
};


module.exports = router;
