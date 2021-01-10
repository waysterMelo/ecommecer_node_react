const express = require('express');
const router = express.Router();

const {create, categoryId, read, update_category, list, remove} = require('../controller/categoryController');
const {requireSignin, isAuthent, isAdmin} = require('../controller/auth');
const {userById} = require('../controller/user_controller');

router.post('/category/create/:userId', create, requireSignin, isAdmin, isAuthent);
router.param("userId", userById);
router.param("categoryId", categoryId);
router.get('/category/:categoryId', read)
router.put('/category/:categoryId/:userId', requireSignin, isAdmin, isAuthent, update_category);
router.delete('/category/:categoryId/:userId', remove, requireSignin, isAdmin, isAuthent);
router.get('/categories', list);

module.exports = router;