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