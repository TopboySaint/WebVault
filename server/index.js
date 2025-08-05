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
    res.status(501).json({ message: "User account not created" });
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

app.post('/decodetoken', (req,res)=>{
    const token = req.body.token
    jwt.verify(token, process.env.JWT_SECRET, (err, decode)=>{
        if(err){
            return res.status(401).send(`Invalid token`)
        }
        res.status(201).send(`${decode}`)
    })
})




app.listen(port, () => {
  console.log(`The question isn't who is going to let me, it's who is going to stop me. - ${port} running.`);

})