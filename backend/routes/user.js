const express = require('express');
const router = express.Router();

const {userById, read, updated} = require('../controller/user_controller');
const {requireSignin, isAdmin, isAuthent} = require('../controller/auth');


router.get('/secret/:userId', requireSignin, isAuthent, isAdmin, (req, res) => {
        res.json({
            user: req.profile
        });
});
router.param('userId', userById);
router.get('/user/:userId', requireSignin, isAuthent, read);
router.put('/user/:userId', requireSignin, isAuthent, updated);

module.exports = router;