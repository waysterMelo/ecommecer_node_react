const User = require('../models/user');

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user){
            return res.status(404).json({error: '' +
                    'User not found'});
        }
        req.profile = user;
        next();
    })
}

exports.read = (req, res) => {

    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.updated = (req, res) => {
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true},
        (err , data) =>{
            if (err){
                return res.status(400).json({error: 'You not authorized'});
            }
            data.hashed_password = undefined;
            data.salt= undefined;
            res.json(data);
        });
};