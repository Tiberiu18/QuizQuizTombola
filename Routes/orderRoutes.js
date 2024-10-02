import express from 'express';
import asyncHandler from 'express-async-handler';
import protect from '../Middleware/AuthMiddleware.js';
import Order from '../Models/OrderModel.js';
import Product from '../Models/ProductModel.js';

const orderRouter = express.Router();



orderRouter.post("/", protect, asyncHandler(async(req, res) => {
    const {orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice} = req.body;
    if(orderItems && orderItems.length === 0){
        res.status(400);
        throw new Error("No order items");
        return;
    }else{
        // for each orderItem, increase its orderCount by 1
        orderItems.forEach(async(orderItem) => {
            const product = await Product.findById(orderItem.product);
            if(product){
                product.orderCount += 1;
                await product.save();
            }
        });

        const order = new Order({
            orderItems, 
            user: req.user._id,
            shippingAddress, 
            paymentMethod, 
            itemsPrice, 
            taxPrice, 
            shippingPrice, 
            totalPrice
        });
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }

}));


// Get Order by Id
orderRouter.get("/:id", protect, asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id).populate("user", "name email"); // populate("user", "name email") => get user name and email from user model

    if(order){
        res.json(order);
    }
    else{
        res.status(404);
        throw new Error("Order not found");
    }

}));


// Order Is Paid

orderRouter.put("/:id/pay", protect, asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id);
    
    if(order){
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id, 
            status: req.body.status, 
            update_time: req.body.update_time, 
            email_address: req.body.payer.email_address
        }
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    }
        
        else{
            res.status(404);
            throw new Error("Order not found");
        }
    }
)
);



// User Order List
orderRouter.get("/", protect, asyncHandler(async(req,res) => {
    const orders = await Order.find({user:req.user._id}).sort({createdAt:-1});
    res.json(orders);
}));


export default orderRouter;