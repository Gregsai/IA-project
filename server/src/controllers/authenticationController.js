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
  try {
    const { email } = req.query;
    const verified = await authService.emailVerified(email);
    
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
  try {
    const { email } = req.body;
    const response = await authService.sendResetPasswordEmail(email);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    console.log('reset password', token, password);
    const response = await authService.resetPassword(token, password);
    res.status(200).send(response);
  } catch (error) {
    console.log('error',error);
    res.status(500).send('Error while updating password');
  }
}

async function signIn(req, res) {
  try {
    const { email, password } = req.body;
    const signInResult = await authService.signIn(email, password);

    if (signInResult.error) {
      res.status(401).json({ error: signInResult.error });
      return;
    }

    const { token } = signInResult;

    res.cookie('token', token, {
      httpOnly: true,
    });
    console.log('token',token);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during sign in:', error);
    res.status(500).json({ error: 'Error during sign in' });
  }
}

async function isLoggedIn(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const renewedToken = authService.checkAndRenewToken(token);

    if (renewedToken !== null) {
      res.cookie('token', renewedToken, {
        httpOnly: true,
      });
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
