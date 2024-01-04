const authService = require("../services/authenticationService");

async function signUp(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;
    await authService.signUp(firstName, lastName, email, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function signIn(req, res) {

}

async function signOut(req, res) {

}

async function emailAlreadyExists(req, res) {
  try {
    const { email } = req.query;
    const exists = await authService.emailAlreadyExists(email);
    
    if (exists) {
      res.status(200).json({ exists: true, message: 'User exists' });
    } else {
      res.status(200).json({ exists: false, message: 'User does not exist' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function emailVerified(req, res) {

}

async function sendVerificationEmail(req, res) {
  try {
    const { email } = req.body;
    const response = await authService.sendConfirmationEmail(email);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function verifyAccount(req, res) {
  try {
    const { token } = req.params;
    const response = await authService.verifyAccount(token);
    res.status(200).send(response);
  } catch (error) {
    console.log('error',error);
    res.status(500).send('Error while account verification');
  }
}

async function sendResetPasswordEmail(req, res) {

}

async function resetPassword(req, res) {

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

module.exports = {
  signUp,
  signIn,
  signOut,
  emailAlreadyExists,
  emailVerified,
  sendVerificationEmail,
  verifyAccount,
  sendResetPasswordEmail,
  resetPassword
};
