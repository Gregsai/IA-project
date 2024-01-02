// authenticationRoutes.js
const express = require("express");
const authenticationController = require("../controllers/authenticationController");

const router = express.Router();

router.post('/signUp', authenticationController.signUp);
router.post('/sendConfirmationEmail', authenticationController.sendConfirmationEmail);
router.get('/confirm/:token', authenticationController.confirmAccount);
router.post('/signIn', authenticationController.signIn);
router.post('/logOut', authenticationController.logOut);
router.post('/passwordForgotten', authenticationController.passwordForgotten);

module.exports = router;
