const express = require("express");
const authenticationController = require("../controllers/authenticationController");

const router = express.Router();

router.post('/sign-up', authenticationController.signUp);
router.post('/sign-in', authenticationController.signIn);
router.get('/is-logged-in', authenticationController.isLoggedIn);
router.get('/log-out', authenticationController.logOut);

router.get('/email-already-exists', authenticationController.emailAlreadyExists);
router.get('/email-verified', authenticationController.emailVerified);

router.post('/send-verification-email', authenticationController.sendVerificationEmail);
router.get('/verify-account/:token', authenticationController.verifyAccount);

router.post('/send-reset-password-email', authenticationController.sendResetPasswordEmail);
router.post('/reset-password', authenticationController.resetPassword);

module.exports = router;
