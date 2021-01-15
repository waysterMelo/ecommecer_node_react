const express = require('express');
const router = express.Router();

const {create, productById, read, remove, update, list, listRelated,
    listCategories, listBySearch, photo} = require('../controller/productController');
const {requireSignin, isAuthent, isAdmin} = require('../controller/auth');
const {userById} = require('../controller/user_controller');

router.post('/product/create/:userId', create, requireSignin, isAdmin, isAuthent);
router.param("userId", userById);
router.param("productId", productById);
router.get("/product/:productId", read);
router.delete("/product/:productId/:userId", requireSignin, isAdmin, isAuthent, remove);
router.put("/product/:productId/:userId", requireSignin, isAdmin, isAuthent, update);
router.get("/products", list);
router.get("/products/related/:productId", listRelated);
router.get("/products/categories", listCategories);
router.post("/products/by/search", listBySearch);
router.get("/product/photo/:productId", photo)

module.exports = router;