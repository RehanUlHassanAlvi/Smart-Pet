
const nodemailer = require('nodemailer');
const express = require('express');
const router=express.Router();


router.post('/',async(req,res)=> {
    const mailObj=req.body;
    const userName=req.body.name
    try{
        sendEmail(mailObj)
        res.status(200).json({ message: 'Email successfully sent!', userName });
    }
    catch(error){
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error Sending Email!', userName });
    }
});





function sendEmail(mailObj) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'treatmentbuilderapp@gmail.com', 
      pass: 'madv zedu cfqh eiyn' 
    }
  });

    toEmail="";
  if (mailObj.to === 'formStep1'){
    toEmail="ralvi7007@gmail.com"
  }

  const mailOptions = {
    from: "smartPet@gmail.com",
    to: toEmail, 
    subject: 'User Filled Form',
    text: `${mailObj.name},\n\n filled out the form`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = router;
