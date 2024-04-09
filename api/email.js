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
     //let toEmail = 'ralvi7007@gmail.com';

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
    const { emailContent, attachments } = await generateQuotationEmailContent(mailObj);

    // Print email content for debugging
    console.log('Email Content:', emailContent);

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
      // attachments: attachments // Attachments included here
    };

    const mailOptions_user = {
      from: 'ralvi7007@gmail.com',
      to: mailObj.email,
      subject: 'Quotation Response',
      html: emailContent
      // attachments: attachments // Attachments included here
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
  const fs = require('fs');

  // Read the SVG image file
  // const petImageContent = fs.readFileSync('src/pet.png', { encoding: 'base64' });
  // Construct email content with pet information, routing details, and comments at the bottom
  let emailContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #e5dcd2; /* Light beige background for the entire email */
        color: #969796; /* Text color */
      }
      .center-container {
        text-align: center;
        max-width: 100%; 
        padding: 0 10%;
    }
    
    .content-container {
        background-color: #fff; /* White background */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        padding: 20px; /* Add space from all sides */
        margin: 0 auto; /* Center the content container horizontally */
        max-width: 100%; /* Make it fill the whole width of the viewport */
    }
    
    .outer-container {
        background-color: #e5dcd2; /* Light beige background for the entire email */
        padding: 0 10%; /* Padding on the sides */
    }
    
    @media (max-width: 767px) {
        .center-container,
        .content-container {
            padding: 0; /* Remove padding on mobile devices */
        }
        .outer-container {
            padding: 0; /* Remove padding on mobile devices */
        }
    }
    
    
      h1 {
        color: #333;
        margin-top: 0; /* Remove default margin */
      }
      .details {
        margin-top: 20px;
        text-align: left;
      }
      .details p span {
        font-weight: bold; /* Make keys bold */
        color: #969796; /* Text color */
      }
      .estimate-notes {
        margin-top: 20px;
        font-style: italic;
        text-align: left;
      }
      .estimate-notes p {
        font-weight: bold; /* Make Estimate Notes bold */
        font-size: 16px; /* One size bigger than normal text */
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }
      th, td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
        color: #969796; /* Text color */
      }
      th {
        border-bottom-width: 2px; /* Thicker bottom border for table headers */
      }
      tr:nth-child(3n+2) td {
        border-top: 1px solid #ddd; /* Add border between specified rows */
      }
    </style>
  </head>
  <body>
    <div class="outer-container">
      <div class="center-container">
        <div class="content-container">
        <img src="https://raw.githubusercontent.com/RehanUlHassanAlvi/Smart-Pet/main/src/pet.png" alt="Image" style="width: 100%; max-width: 600px; margin-bottom: 20px;">
          <h2>View your customized estimate below:</h2>
          <div class="details">
          <p><span>Name:</span> ${mailObj.name}</p>
          <p><span>Email:</span> ${mailObj.email}</p>
          <p><span>From Address:</span> ${mailObj.routing.from}</p>
          <p><span>To Address:</span> ${mailObj.routing.to}</p>
          <p><span>Ideal Pickup Date:</span> ${formatDate(mailObj.timestamp)}</p>
          <p><span>Number of Pets:</span> ${mailObj.pets.length}</p>
          </div>
          <table>
            <tr>
              <th>Service</th>
              <th>Included</th>
            </tr>
            ${generateServiceRows(mailObj)}
            <tr>
              <th>Total</th>
              <th>$${mailObj.categories.total.price}</th>
            </tr>
          </table>
          <div class="estimate-notes">
            <p>Estimate Notes:</p>
            <p>${mailObj.comments || 'No comments'}</p>
          </div>
          <h1>Thank you for choosing Smart Pet Air Travel!</h1>
        </div>

      </div>
    </div>
  </body>
  </html>
  `;

  // Define attachments
  const attachments = [
    {
      // filename: 'pet.png',
      // content: petImageContent,
      // encoding: 'base64',
      // cid: 'petImage', // Content ID for referencing in HTML
    },
  ];

  return { emailContent, attachments };

  function generateServiceRows(mailObj) {
    const serviceCharges = [
      { name: 'Air Cargo Charges', value: mailObj.rates?.airCargoCharges },
      { name: 'Administrative Fees', value: mailObj.categories?.admin?.included },
      { name: 'Kennel Charges', value: mailObj.categories?.crate?.included },
      { name: 'Veterinary Charges', value: mailObj.categories?.vetCharges?.included },
      { name: 'USDA Charges', value: mailObj.categories?.usdaCharges?.included },
      { name: 'Ground @ Origin', value: mailObj.categories?.groundOrigin?.included },
      { name: 'Boarding @ Origin', value: mailObj.categories?.boardingOrigin?.included },
      { name: 'Boarding @ Stop', value: mailObj.categories?.boardingStop?.included },
      { name: 'Boarding @ Arrival', value: mailObj.categories?.boardingArrival?.included },
      { name: 'Ground @ Arrival', value: mailObj.categories?.groundArrival?.included },
      { name: 'Import Permit', value: mailObj.categories?.importPermit?.included },
      { name: 'Customs Clearance', value: mailObj.categories?.customClearance?.included },
    ];
  
    return serviceCharges.map(charge => `
      <tr>
        <td>${charge.name}</td>
        <td>${charge.value !== undefined ? (charge.value ? 'YES' : '...') : '...'}</td>
      </tr>
    `).join('');
  }
  
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
