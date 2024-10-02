import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../Models/ProductModel.js';
import protect from '../Middleware/AuthMiddleware.js';
import mongoose from 'mongoose';
const productRoute = express.Router();

productRoute.get("/", asyncHandler(async(req, res) => {

    const pageSize = 8;

    const page = Number(req.query.pageNumber) || 1;

    

    const keyword = req.query.keyword ? {
        name : {
            $regex: req.query.keyword,
            $options: "i",
        }
    } : {};

    const minPrice = req.query.minPrice ? {
        price: {
            $gte: parseFloat(req.query.minPrice),
        }
    } : {};

    const maxPrice = req.query.maxPrice ? {
        price: {
            $lte: parseFloat(req.query.maxPrice),
        }
    } : {};


    // note that categoryFilter is an array, therefore each category is checked individually
    const categoryFilter = req.query.categoryFilter ? {
        category: {
            $in: req.query.categoryFilter.split(','),
        }
    } : {};
    





    const count = await Product.countDocuments({...keyword, ...minPrice, ...maxPrice, ...categoryFilter});



    const products = await Product.find({...keyword, ...minPrice, ...maxPrice, ...categoryFilter}).limit(pageSize).skip(pageSize*(page-1)).sort({_id: -1});




    res.json({products, page, pages: Math.ceil(count/pageSize)});
}
));


productRoute.get("/all", asyncHandler(async(req, res) => {
    const products = await Product.find({});
    res.json(products);
}));

productRoute.get("/:id", asyncHandler(async(req, res) => {
    const ok = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!ok) {
        res.status(404);
        throw new Error("Invalid Product Id");
    }
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error("Product Not Found");
    }

}
));

// create a review
productRoute.post("/:id/reviews", asyncHandler(async(req, res) => {
    const {rating, comment} = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
        const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
        if (alreadyReviewed) {
            res.status(400);
            throw new Error("Product Already Reviewed");
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;

        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0)/product.reviews.length;
    } else {
        res.status(404);
        throw new Error("Product Not Found");
    }
    await product.save();
    res.status(201).json({message: "Review Added"});
}
));



// product review
productRoute.post("/:id/review", protect, asyncHandler(async(req, res) => {
    const {rating, comment} = req.body;
    const ok = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!ok) {
        res.status(404);
        throw new Error("Invalid Product Id");
    }
    const product = await Product.findById(req.params.id);
    if (product) {
        const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
        if (alreadyReviewed) {
            res.status(400);
            throw new Error("Product Already Reviewed");
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0)/product.reviews.length;
        await product.save();
        res.status(201).json({message: "Review Added"}); 
        res.json(product);
    } else {
        res.status(404);
        throw new Error("Product Not Found");
    }

}
));




export default productRoute;