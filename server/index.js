const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const cors = require('cors')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const port = process.env.PORT || 8080
const saltRounds = 10
const uri = process.env.URI
app.use(express.json())
app.use(cors())


mongoose.connect(uri)
  .then((res) => {
    console.log(`Mongo database is now connected.`);
  })
  .catch((err) => {
    console.log(`Error connecting to Mongo database.`);
  })


const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const userModel = mongoose.model('User', userSchema);


app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body
  try {

    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new userModel({ firstName, lastName, email, phone, password: hashedPassword });
    await user.save();

    console.log("user saved successfully");
    res.status(201).json({ message: "user saved successfully", accountNumber });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: "Welcome to WebVault! Your Account is Ready",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Welcome to WebVault</title>
            <style>
              body {
                font-family: 'Segoe UI', Arial, sans-serif;
                background: linear-gradient(135deg, #e3f0ff 0%, #f6f9fc 100%);
                margin: 0; padding: 0; color: #222;
              }
              .container {
                max-width: 600px;
                margin: 40px auto;
                background: #fff;
                border-radius: 20px;
                box-shadow: 0 12px 40px rgba(45,114,217,0.18);
                padding: 48px 36px;
                border: 2px solid #2d72d9;
              }
              .header {
                text-align: center;
                margin-bottom: 36px;
              }
              .logo {
                font-size: 2.8rem;
                font-weight: 900;
                color: #2d72d9;
                letter-spacing: 2px;
                margin-bottom: 10px;
                text-shadow: 0 2px 8px #e3f0ff;
              }
              .welcome {
                font-size: 1.6rem;
                color: #2d72d9;
                font-weight: 700;
                margin-bottom: 12px;
              }
              .divider {
                height: 4px;
                background: linear-gradient(90deg, #2d72d9 0%, #6bb7ff 100%);
                border-radius: 2px;
                margin: 18px 0 32px 0;
              }
              .details {
                background: #f0f4fa;
                padding: 22px;
                border-radius: 12px;
                margin: 28px 0;
                box-shadow: 0 2px 8px rgba(45,114,217,0.08);
              }
              .details li {
                margin: 10px 0;
                font-size: 1.15rem;
              }
              .account-number {
                color: #2d72d9;
                font-weight: bold;
                font-size: 1.25rem;
                letter-spacing: 1px;
              }
              .cta {
                background: linear-gradient(90deg, #2d72d9 0%, #6bb7ff 100%);
                color: #fff;
                padding: 16px 0;
                border-radius: 10px;
                text-align: center;
                font-size: 1.15rem;
                font-weight: 700;
                margin: 32px 0 18px 0;
                box-shadow: 0 2px 8px #e3f0ff;
              }
              .footer {
                text-align: center;
                font-size: 13px;
                color: #888;
                margin-top: 48px;
              }
              .icon {
                display: block;
                margin: 0 auto 18px auto;
                width: 64px;
                height: 64px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">WebVault</div>
                <div class="welcome">Welcome, ${firstName}!</div>
                <div class="divider"></div>
              </div>
              <p style="font-size:1.1rem;">Dear <strong>${firstName} ${lastName}</strong>,</p>
              <p style="font-size:1.1rem;">Thank you for opening your new <strong style="color:#2d72d9;">WebVault</strong> account!</p>
              <div class="cta">Your account is now active and ready to use.</div>
              <p style="margin-bottom:0;font-size:1.08rem;">Here are your account details:</p>
              <ul class="details">
                <li><strong>Account Number:</strong> <span class="account-number">${accountNumber}</span></li>
                <li><strong>Name:</strong> ${firstName} ${lastName}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Phone:</strong> ${phone}</li>
              </ul>
              <p style="font-size:1.08rem;">You can now start banking with us and enjoy secure, modern financial services designed for you.</p>
              <p style="font-size:1.08rem;">If you have any questions or need support, reply to this email or contact our helpdesk.</p>
              <p style="margin-top:36px;font-size:1.08rem;">Best regards,<br><strong style="color:#2d72d9;">The WebVault Team</strong></p>
            </div>
            <div class="footer">
              &copy; 2025 WebVault. All rights reserved.
            </div>
          </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(`Error sending mail: ${error.message}`);
      }
      res.status(201).send(`Email sent successfully: ${info.response}`);
    });
  } catch (err) {
    console.log(err);
    res.status(501).json({ message: "user not saved" });
  }

})


app.post('/signin', (req,res) =>{
  const userData = {
    email: req.body.email,
    password: req.body.password,
  };

  userModel.findOne({ email: userData.email })
    .then((foundUser) => {
      if (!foundUser || foundUser == null) {
        res.status(401).json({message : "No user found"});
      } else {
        bcrypt.compare(foundUser.password, userData.password)
        .then((isMatch)=>{
          if (isMatch) {
    
            jwt.sign({user: foundUser}, process.env.JWT_SECRET, {expiresIn: "10m"}, (err, token) =>{
  
              if(err) {
              console.log(`Token not generated`, err);
              return res.status(500).json({ message : 'Error generating token' });
  
              }else{
                  console.log(token);
                  return res.status(200).json({message : 'User found and signed in', token});
              }
  
              })
  
          } else {
            res.status(401).json({message: "Invalid password"});
          }   
        })
      }
    })
    .catch((err) => {
      console.log(`No user has been found with this email`, err);
    });
})




app.listen(port, () => {
  console.log(`The question isn't who is going to let me, it's who is going to stop me. - ${port} running.`);

})