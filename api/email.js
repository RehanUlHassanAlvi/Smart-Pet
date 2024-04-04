const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();
const PhoneNumber = require('libphonenumber-js');


async function sendFormEmail(mailObj) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'treatmentbuilderapp@gmail.com',
        pass: 'madv zedu cfqh eiyn'
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



async function sendQuoteEmail(mailObj) {
  try {
    // Generate email content asynchronously
    const emailContent = await generateQuotationEmailContent(mailObj);

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'treatmentbuilderapp@gmail.com',
        pass: 'madv zedu cfqh eiyn'        
      }
    });

    // Define mail options
    const mailOptions_admin = {
      from: 'ralvi7007@gmail.com',
      to: 'ralvi7007@gmail.com',
      subject: 'Quotation Sent to User',
      html: emailContent
    };

    const mailOptions_user = {
      from: 'ralvi7007@gmail.com',
      to: mailObj.email,
      subject: 'Quotation Response',
      html: emailContent
    };

    // Send emails
    await transporter.sendMail(mailOptions_admin);
    await transporter.sendMail(mailOptions_user);

    console.log('Emails sent successfully');
  } catch (error) {
    console.error('Error sending emails:', error);
    throw error; // Re-throw the error for handling it outside of this function
  }
}

async function generateQuotationEmailContent(mailObj) {
  // Construct email content with pet information, routing details, and comments at the bottom
  let emailContent = `<div style="background-color: #f2f2f2; padding: 20px; margin: 0;">`;
  
  // Add routing information
  if (mailObj.routing) {
      emailContent += '<h3>Routing Information:</h3>';
      emailContent += `<p>From: ${mailObj.routing.from}</p>`;
      if (mailObj.routing.via && mailObj.routing.via.length > 0) {
          emailContent += `<p>Via: ${mailObj.routing.via.join(', ')}</p>`;
      }
      emailContent += `<p>To: ${mailObj.routing.to}</p>`;
  } else {
      emailContent += `<p>No routing information available</p>`;
  }

  // Add comments
  if (mailObj.comments) {
      emailContent += `<h3 style="text-align: center;">Comments from the Business</h3>`;
      emailContent += `<p style="text-align: center;">${mailObj.comments}</p>`;
  } else {
      emailContent += `<h3 style="text-align: center;">No comments available</h3>`;
  }

  emailContent += `</div>`;
  
  return emailContent;
}



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
      .rfq {
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        padding: 20px;
        margin-bottom: 20px;
      }
      .rfq h2 {
        color: #007bff;
      }
      .rfq p {
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
  <h2>Thanks for filling the estimate form  ${userData.rfqs[0].name} !</h2>  
    ${userData.rfqs.map(rfq => `
      <div class="rfq">
        <h2>Name: ${rfq.name}</h2>
        <p>Phone: ${formatPhoneNumber(rfq.phone)}</p>
        <p>Moved From: ${rfq.shippedFrom}</p>
        <p>Moved To: ${rfq.shippedTo}</p>
        <p>Departure Date: ${formatDate(rfq.departureDate.toString())}</p>
        <h3>Pet Details</h3>
        ${rfq.pets.map(pet => `
          <div class="pet">
          <p>Type: ${pet.petType}</p>
            <p>Name: ${pet.name}</p>
            <p>Breed: ${pet.breed}</p>
            <p>Age:   ${pet.ageInYears} years</p>
            <p>Weight: ${pet.weight} lbs</p>
            <p>Height: ${pet.height} inches</p>
            <p>Length: ${pet.width} inches</p>
          </div>`).join('')}
  
        <p>Have airline approved crates: ${rfq.approvedKennels}</p>
        <p>Referred By: ${rfq.hearDetails}</p>
        <p>Military Vet: ${rfq.militaryVet}</p>
        <p>Pets Microchipped: ${rfq.petsMicrochipped}</p>
        <p>Rabies in past 12 months: ${rfq.rabiesVaccine}</p>
        <p>Personal travel within 5 days: ${rfq.with5DaysTravel}</p>
        <p>Additional Comments: ${rfq.additionalComments}</p>

      </div>`).join('')}
  </body>
  </html>`;  

  return htmlContent;
};


function formatDate(dateString) {
  const date = new Date(dateString);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  // Function to add ordinal suffix to the day
  function getOrdinal(day) {
      const suffixes = ['th', 'st', 'nd', 'rd'];
      const v = day % 100;
      return day + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  }

  const ordinalDay = getOrdinal(day);

  return `${monthName} ${ordinalDay}, ${year}`;
}

function formatPhoneNumber(phoneNumber) {
    try {
        const number = PhoneNumber.parse(phoneNumber);
        return PhoneNumber.format(number, PhoneNumber.FORMAT.NATIONAL);
    } catch (error) {
        console.error('Error formatting phone number:', error.message);
        return phoneNumber; // Return original number if formatting fails
    }
}

module.exports = {router, sendQuoteEmail}
