const User = require('../models/user');
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const {errorHandler} = require('../helpers/dbErrorHandler');

exports.signUp = (req, res) =>{
    console.log("req.body", req.body);
    const user = new User(req.body);
    user.save((err, user) => {
        if (err){
            return res.status(400).json({err: errorHandler(err)})
        }
        user.salt = undefined;
        user.hashed_password = undefined;

        res.json({user})
    });
};

exports.signin = (req, res)=>{
    const {email, password} = req.body;
    User.findOne({email}, (err, user) =>{
       if (err || !user){
           return res.status(400).json({
               err: "user doesnt exist"
           });
        }

       if (!user.authenticate(password)){
           return res.status(401).json({
               err: "Email and Password dont match"
           });
       }

       const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

       // res.cookie('token', token, {expires: new Date() + 9999});

       const {_id, email, name, role} = user;

       return res.json({token, user: {_id, email, name, role}})
    });
};

exports.signout = (req, res) => {
    res.clearCookie('token');
    res.json({message: 'Signout success'})
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});

exports.isAuthent = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user){
        return res.status(403).json({
            error: 'Access Denied'
        });
    }
    next();
}

exports.isAdmin = (req, res, next) => {

    if (req.profile.role === 0){
        return res.status(403).json({
            error: 'Admin resources access denied'
        });
    }
    next();
}

