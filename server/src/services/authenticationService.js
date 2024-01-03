const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const pool = require("../../config/database");

async function signUpUser(firstName, lastName, email, password) {
  try {
    console.log("signUpUser", firstName, lastName, email, password)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User(firstName, lastName, email, hashedPassword, null, false);

    const queryText = 'INSERT INTO users (firstName, lastName, email, password, confirmationToken, confirmed) VALUES ($1, $2, $3, $4, $5, $6) RETURNING email';
    const values = [newUser.firstName, newUser.lastName, newUser.email, newUser.password, null, newUser.confirmed];

    const result = await pool.query(queryText, values);
    const insertedEmail = result.rows[0].email;

    return insertedEmail;
  } catch (error) {
    console.error('Error during registration :', error);
    throw new Error('Error during registration.');
  }
}

async function sendConfirmationEmail(email) {
  try {
    const emailFormatted = email.replace(/_/g, '.');
    console.log("emailFormatted", email)
    const confirmationToken = jwt.sign({ email }, 'secret', { expiresIn: '24h' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'internetapplication7@gmail.com',
        pass: 'simz hxia qtur oayu',
      },
    });

    const mailOptions = {
      from: 'internetapplication7@gmail.com',
      to: emailFormatted,
      subject: 'Verify your email address',
      html: `
      <p>
      Click on
      <a href="http://localhost:4200/verify-account/${confirmationToken}">this link</a> 
      to verify your account.
      </p>`,
    };

    await transporter.sendMail(mailOptions);
    return { message: 'Confirmation email sent. Please check your inbox' };
  } catch (error) {
    console.error('Error sending confirmation email :', error);
    throw new Error('Error sending confirmation email.');
  }
}

async function confirmUser(token) {
  try {
    const decoded = jwt.verify(token, 'secret');
    const email = decoded.email;

    const confirmUserQuery = 'UPDATE users SET confirmed = $1 WHERE email = $2';
    const values = [true, email];

    await pool.query(confirmUserQuery, values);

    return 'Account successfully activated. You will now be redirected to the main page.';
  } catch (error) {
    console.error('Error occured during activation process :', error);
    throw new Error('Error occured during activation process.');
  }
}

async function signInUser(email, password) {

}

async function logOutUser(email){

}

async function passwordForgottenUser(email){

}


module.exports = {
  signUpUser,
  sendConfirmationEmail,
  confirmUser,
  signInUser,
  logOutUser,
  passwordForgottenUser
};
