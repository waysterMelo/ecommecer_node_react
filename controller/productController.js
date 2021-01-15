const Product = require('../models/product');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const {errorHandler} = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    //enable form
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  
  //work with parse
  form.parse(req, (err, fields, files)=>{
      if (err){
          return res.status(400).json({error: "Image could not be uploaded"});
      }

      const {name, description, price, category, quantity, shipping} = fields;

      if (!name || !description || !price || !category || !quantity || !shipping){
          return res.status(400).json({
              error: "All fields are required"});
      }

      let product = new Product(fields);

      if (files.photo){
          if (files.photo.size > 1000000){
              return res.status(400).json(
                  {error: "Image should be less than 1mb in size"})
          }
          product.photo.data = fs.readFileSync(files.photo.path);
          product.photo.contentType = files.photo.type;

      }
      product.save((err, product) =>{
          if (err){
              return res.status(400).json(
                  {error: errorHandler(err)});
          }
          res.json(product);
      })
  })
}

exports.productById = (req, res, next, id) =>{
    Product.findById(id).exec((err, product) =>{
        if (err || !product) {
            return res.status(400).json({
                error: "Product not found"
            });
        }
        req.product = product
        next();
    }); 
}

exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

exports.remove = (req,res) => {
   let product = req.product;
   product.remove((err, product) => {
      if (err){
          return res.status(400).json({error: errorHandler(err)});
      }
      res.json({product, message: "Product deleted"});
   });
}

exports.update = (req, res) => {
    //enable form
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    //work with parse
    form.parse(req, (err, fields, files)=>{
        if (err){
            return res.status(400).json({error: "Image could not be uploaded"});
        }

        const {name, description, price, category, quantity, shipping} = fields;

        if (!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({
                error: "All fields are required"});
        }

        let product = req.product;
        product = _.extend(product, fields);

        if (files.photo){
            if (files.photo.size > 1000000){
                return res.status(400).json(
                    {error: "Image should be less than 1mb in size"})
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;

        }
        product.save((err, product) =>{
            if (err){
                return res.status(400).json(
                    {error: errorHandler(err)});
            }
            res.json(product);
        })
    })
}

exports.list = (req, res) =>{
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy: '_id';
    let limit = req.query.limit ? parseInt(req.query.limit): 6

    Product.find().select("-photo").populate('category')
        .sort([[sortBy,order]])
        .limit(limit)
        .exec((err, data) =>{
            if (err){
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.send(data);
        })

}

exports.listRelated = (req, res) => {

    let limit = req.query.limit ? parseInt(req.query.limit): 6

    Product.find({_id: {$ne: req.product}, category: req.product.category})
        .limit(limit)
        .populate("category", "_id name")
        .exec((err, products) =>{
            if (err){
                res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json(products)
        });

}

exports.listCategories = (req, res) =>{

    Product.distinct("category", {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                error: "Category not found "
            });
        }
        res.json(categories)
    });

}

exports.listBySearch = (req, res) =>{

    let order = req.query.order ? req.query.order: 'desc';
    let sortBy = req.query.sortBy ? req.query.sortBy: '_id'
    let limit = req.query.limit ? req.query.limit: 100
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    for (let key in req.body.filters){
        if (req.body.filters[key].leading > 0){
            if (key === "price"){
                findArgs[key] = {
                    $qtd: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };

            } else {
               findArgs[key] = req.body.filters[key]
            }

        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) return res.status(400).send(err);
            res.json({
                size: data.length, data
            });
        });
};

exports.photo = (req, res, next) => {
    if (req.product.photo.data){
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

