const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();

async function sendEmail(mailObj) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'treatmentbuilderapp@gmail.com', 
        pass: 'madv zedu cfqh eiyn' 
      }
    });

    let emailContent = `Thank you for your inquiry, ${mailObj.name}!\n\n`;

    emailContent += `Here are the details you provided:\n`;
    emailContent += `- Email: ${mailObj.email}\n`;
    emailContent += `- Phone: ${mailObj.phone}\n`;

    if (mailObj.shippedFrom) {
        emailContent += `- Shipped From: ${mailObj.shippedFrom}\n`;
    }

    if (mailObj.shippedTo) {
        emailContent += `- Shipped To: ${mailObj.shippedTo}\n`;
    }

    if (mailObj.departureDate) {
        const departureDate = new Date(mailObj.departureDate.$date.$numberLong);
        emailContent += `- Departure Date: ${departureDate.toDateString()}\n`;
    }

    if (mailObj.pets && mailObj.pets.length > 0) {
        emailContent += `- Pets:\n`;
        mailObj.pets.forEach(pet => {
            emailContent += `  - Name: ${pet.name}\n`;
            emailContent += `    Breed: ${pet.breed}\n`;
            emailContent += `    Age: ${pet.ageInYears.$numberInt} years\n`;
            emailContent += `    Weight: ${pet.weight.$numberInt} lbs\n`;
            emailContent += `    Crate Size: ${pet.crateSize}\n`;
        });
    }

    if (mailObj.additionalComments) {
        emailContent += `- Additional Comments: ${mailObj.additionalComments}\n`;
    }

    if (mailObj.approvedKennels) {
        emailContent += `- Approved Kennels: Yes\n`;
    } else {
        emailContent += `- Approved Kennels: No\n`;
    }

    emailContent += `- Heard about us from: ${mailObj.hearDetails}\n`;

    if (mailObj.militaryVet) {
        emailContent += `- Military Veteran: Yes\n`;
    } else {
        emailContent += `- Military Veteran: No\n`;
    }

    if (mailObj.petsMicrochipped) {
        emailContent += `- Pets Microchipped: Yes\n`;
    } else {
        emailContent += `- Pets Microchipped: No\n`;
    }

    if (mailObj.rabiesVaccine) {
        emailContent += `- Rabies Vaccine: Yes\n`;
    } else {
        emailContent += `- Rabies Vaccine: No\n`;
    }

    if (mailObj.with5DaysTravel) {
        emailContent += `- With 5 Days Travel: Yes\n`;
    } else {
        emailContent += `- With 5 Days Travel: No\n`;
    }

    let toEmail = '';
    if (mailObj.to === 'formStep1'){
      toEmail = 'ralvi7007@gmail.com';
    }

    const mailOptions_admin = {
      from: 'smartPet@gmail.com',
      to: toEmail, 
      subject: 'User Filled Form',
      text: emailContent
    };

    const mailOptions_user = {
      from: 'smartPet@gmail.com',
      to: mailObj.email, 
      subject: 'User Filled Form',
      text: emailContent
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

module.exports = router;
