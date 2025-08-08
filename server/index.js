const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const decode = require('jwt-decode')
require('dotenv').config()
const welcomeEmailTemplate = require('./emailTemplates/welcomeMail')
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
  accountNumber: { type: String, required: true, unique: true },
  balance: { type: Number, default: 50000 },
  createdAt: { type: Date, default: Date.now }
});

const userModel = mongoose.model('User', userSchema);


app.post('/signup', async (req, res) => {
  const { firstName, lastName, phone, password } = req.body;
  const email = req.body.email.toLowerCase();
  try {

    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new userModel({ firstName, lastName, email, phone, password: hashedPassword, accountNumber });
    await user.save();

    console.log("user saved successfully");
    res.status(201).json({ message: "User account has been created !", accountNumber });

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
      html: welcomeEmailTemplate(firstName, lastName, email, phone, accountNumber),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(`Error sending mail: ${error.message}`);
      }
      res.status(201).send(`Email sent successfully: ${info.response}`);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "User account not created" });
  }

})


app.post('/signin', (req,res) =>{
  const userData = {
    email: req.body.email.toLowerCase(),
    password: req.body.password,
  };

  userModel.findOne({ email: userData.email })
    .then((foundUser) => {
      if (!foundUser || foundUser == null) {
        res.status(401).json({message : "No user found"});
      } else {
        bcrypt.compare(userData.password,foundUser.password)
        .then((isMatch)=>{
          if (isMatch) {
    
            jwt.sign({user: foundUser}, process.env.JWT_SECRET, {expiresIn: "10m"}, (err, token) =>{
  
              if(err) {
              console.log(`Token not generated`, err);
              return res.status(500).json({ message : 'Error generating token' });
  
              }else{
                  console.log(token);
                  return res.status(200).json({message : 'User found and signed in !', token});
              }
  
              })
  
          } else {
            res.status(401).json({message: "Invalid password"});
          }   
        })
        .catch((err)=>{
          console.log(`Password did not match`);
        })
      }
    })
    .catch((err) => {
      console.log(`No user has been found with this email`, err);
    });
})


app.post('/transfer', async (req, res) => {
  const { token, recipientAccountNumber, amount } = req.body;
  
  try {
    // Verify the token and get sender info
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const senderId = decoded.user._id;
    
    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid transfer amount" });
    }
    
    // Find sender and recipient
    const sender = await userModel.findById(senderId);
    const recipient = await userModel.findOne({ accountNumber: recipientAccountNumber });
    
    if (!recipient) {
      return res.status(404).json({ message: "Recipient account not found" });
    }
    
    if (sender.accountNumber === recipientAccountNumber) {
      return res.status(400).json({ message: "Cannot transfer to your own account" });
    }
    
    // Check if sender has sufficient balance
    if (sender.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    
    // Perform the transfer
    sender.balance -= amount;
    recipient.balance += amount;
    
    // Save both users
    await sender.save();
    await recipient.save();
    
    res.status(200).json({ 
      message: "Transfer successful", 
      newBalance: sender.balance,
      recipientName: `${recipient.firstName} ${recipient.lastName}`
    });
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Transfer failed" });
  }
});




app.listen(port, () => {
  console.log(`The question isn't who is going to let me, it's who is going to stop me. - ${port} running.`);

})