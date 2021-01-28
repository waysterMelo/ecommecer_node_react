const Category = require('../models/category');
const {errorHandler} = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    const category = new Category(req.body);
    category.save((err, category) => {
        if (err){
            return res.sendStatus(400).json({
                error: errorHandler(err)
            });
        }
        res.json({category})
    });
}

exports.categoryId = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category){
            return res.sendStatus(400).json({error: "Category doesnt exist"});
        }
        req.category = category;
        next();
    })
}

exports.read = (req, res) => {
    return res.json(req.category);
}

exports.update_category = (req, res) => {
    const category = req.category;

    category.name = req.body.name;

    category.save((err, category) => {
        if (err){
            return res.sendStatus(400).json({
                error: errorHandler(err)
            });
        }
        res.json({category})
    });
}

exports.remove = (req, res) => {
    const category = req.category;
    category.remove((err, category) => {
        if (err){
            return res.sendStatus(400).json({
                error: errorHandler(err)
            });
        }
        res.json({message: "Category deleted"})
    });
}

exports.list = (req, res) => {
    Category.find().exec((err, category) => {
        if (err){
            return res.sendStatus(400).json({
                error: errorHandler(err)
            });
        }
        res.json(category);
    })
}