const { ref } = require("joi");
const mongoose = require("mongoose");

const cart = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userData'
        
     },
     products:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'productData'
            
        },
        quantity:{type:Number},
        // name:{type:String},
        // price:{type:Number}
}],
total:{
    type:Number
}
     
})

const addCart = mongoose.model("addCart", cart);

module.exports = addCart;
