const express = require('express');
const router = express.Router();

const {signUp, signin, signout, requireSignin} = require('../controller/auth');
const {userSignupValidator} = require('../validator/index');

router.post('/signUp', userSignupValidator, signUp);
router.post('/signin', signin);
router.get('/signout', signout);

module.exports = router;