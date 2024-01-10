const authenticationService = require("../services/authenticationService");

async function signUp(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log("signing up in the authentication controller", firstName, lastName, email, password)
    console.log("waiting for signUp service function ...")
    await authenticationService.signUp(firstName, lastName, email, password);
    console.log("signUp service function finished successfully")
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 

async function emailAlreadyExists(req, res) {
  try {
    const { email } = req.query;
    console.log("checking if the email already exists in emailAlreadyExists function", email);
    console.log("waiting for emailAlreadyExists service function ...")
    const exists = await authenticationService.emailAlreadyExists(email);
    console.log("emailAlreadyExists service function finished successfully. The user exists ? ", exists)
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
  try {
    const { email } = req.query;
    console.log("checking if the email is already verified in emailVerified function", email);
    console.log("waiting for emailVerified service function ...")
    const verified = await authenticationService.emailVerified(email);
    console.log("emailVerified service function finished successfully. The user is verified ? ", verified)
    if (verified) {
      res.status(200).json({ verified: true, message: 'User verified' });
    } else {
      res.status(200).json({ verified: false, message: 'User not verified' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function sendVerificationEmail(req, res) {
  try {
    const { email } = req.body;
    console.log("Sending a verification email in the sendVerificationEmail function : ", email);
    console.log("waiting for sendConfirmationEmail service function ...")
    const response = await authenticationService.sendConfirmationEmail(email);
    console.log("sendConfirmationEmail service function finished successfully")
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function verifyAccount(req, res) {
  try {
    const { token } = req.params;
    console.log("Verifying email verification token in the verifyAccount function : ", token);
    console.log("waiting for verifyAccount service function ...")
    const response = await authenticationService.verifyAccount(token);
    console.log("verifyAccount service function finished successfully")
    res.status(200).send(response);
  } catch (error) {
    console.log('error',error);
    res.status(500).send('Error while account verification');
  }
}

async function sendResetPasswordEmail(req, res) {
  try {
    const { email } = req.body;
    console.log("Sending a reset password email in the sendResetPasswordEmail function : ", email);
    console.log("waiting for sendResetPasswordEmail service function ...")
    const response = await authenticationService.sendResetPasswordEmail(email);
    console.log("sendResetPasswordEmail service function finished successfully")
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    console.log(`Reset password in the resetPassword function. Token : ${token}, Password : ${password}`);
    console.log("waiting for resetPassword service function ...")
    console.log('reset password', token, password);
    const response = await authenticationService.resetPassword(token, password);
    console.log("resetPassword service function finished successfully")
    res.status(200).send(response);
  } catch (error) {
    console.log('error',error);
    res.status(500).send('Error while updating password');
  }
}

async function signIn(req, res) {
  try {
    const { email, password } = req.body;
    console.log(`Sign in function for email : ${email} and password :  ${password}`);
    console.log("waiting for signIn service function ...")
    const signInResult = await authenticationService.signIn(email, password);
    console.log("signIn service function finished successfully")

    if (signInResult.error) {
      res.status(401).json({ error: signInResult.error });
      return;
    }

    const { token } = signInResult;
    console.log("Getting the logged in token : ", token);

    res.cookie('token', token, {
      httpOnly: true,
    });
    console.log('token stored in cookie');
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during sign in:', error);
    res.status(500).json({ error: 'Error during sign in' });
  }
}

async function isLoggedIn(req, res) {
  console.log('Checking if the user is logged in')
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(200).json({ authenticated: null });
    }

    const renewedToken = await authenticationService.checkAndRenewToken(token);

    if (renewedToken !== null) {
      res.cookie('token', renewedToken, {
        httpOnly: true,
      });
    }else {
      res.clearCookie('token');
    }

    return res.status(200).json({ authenticated: renewedToken !== null });
  } catch (error) {
    console.error('Error checking login status:', error);
    return res.status(500).json({ error: 'Error checking login status' });
  }
}

async function logOut(req, res) {
  try {
    res.clearCookie('token');
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Error during log out:', error);
    res.status(500).json({ error: 'Error during log out' });
  }
}
module.exports = {
  signUp,
  signIn,
  emailAlreadyExists,
  emailVerified,
  sendVerificationEmail,
  verifyAccount,
  sendResetPasswordEmail,
  resetPassword,
  isLoggedIn,
  logOut
};
