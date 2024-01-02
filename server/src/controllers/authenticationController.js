// authenticationController.js
const authService = require("../services/authenticationService");

async function signUp(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;
      const userEmail = await authService.signUpUser(firstName, lastName, email, password);
      const response = await authService.sendConfirmationEmail(userEmail);
      res.status(201).json(response);
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
    confirmAccount,
    signIn,
    logOut,
    passwordForgotten
};
