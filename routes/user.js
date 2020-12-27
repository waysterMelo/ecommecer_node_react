const express = require('express');
const router = express.Router();

const {userById} = require('../controller/user_controller');
const {requireSignin, isAdmin, isAuthent} = require('../controller/auth');


router.get('/secret/:userId', requireSignin, isAuthent, isAdmin, (req, res) => {
        res.json({
            user: req.profile
        });
});
router.param('userId', userById);

module.exports = router;