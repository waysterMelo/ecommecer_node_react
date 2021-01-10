const express = require('express');
const router = express.Router();

const {create, productById, read, remove, update} = require('../controller/productController');
const {requireSignin, isAuthent, isAdmin} = require('../controller/auth');
const {userById} = require('../controller/user_controller');

router.post('/product/create/:userId', create, requireSignin, isAdmin, isAuthent);
router.param("userId", userById);
router.param("productId", productById);
router.get("/product/:productId", read);
router.delete("/product/:productId/:userId", requireSignin, isAdmin, isAuthent, remove);
router.put("/product/:productId/:userId", requireSignin, isAdmin, isAuthent, update);


module.exports = router;