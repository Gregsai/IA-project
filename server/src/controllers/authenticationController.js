// authenticationController.js
const authService = require("../services/authenticationService");

async function signUp(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;
      await authService.signUpUser(firstName, lastName, email, password);
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async function sendConfirmationEmail(req, res) {
    try {
      const { email } = req.body;
      const response = await authService.sendConfirmationEmail(email);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async function confirmAccount(req, res) {
    try {
      const { token } = req.params;
      const response = await authService.confirmUser(token);
      res.status(200).send(response);
    } catch (error) {
      res.status(500).send('Erreur lors de la confirmation du compte.');
    }
  }
  

async function signIn(req, res){

}

async function logOut(req, res){

}

async function passwordForgotten(req, res){

}

module.exports = {
    signUp,
    sendConfirmationEmail,
    confirmAccount,
    signIn,
    logOut,
    passwordForgotten
};
