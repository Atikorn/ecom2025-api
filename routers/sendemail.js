const express = require('express');
const router = express.Router();

// Import sendEmail controller function
const { sendemail,resetPassword } = require('../controllers/sendemail')

// Define the route to send email
router.post('/sendemail', sendemail);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
