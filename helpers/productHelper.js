const { reject } = require('bcrypt/promises');
const { response } = require('../app');
const { editProduct } = require('../controllers/adminController');
const { db } = require('../models/productSchema');
const productData = require('../models/productSchema');
const dbProduct = require('../models/productSchema');

module.exports = {
    addproduct:(productData)=>{
              return new Promise(async(resolve,reject)=>{
            const product = await dbProduct.create(productData).then((data)=>{
                    resolve(data._id)
                })
 
              })
    },

    getAllProducts:()=>{
      return new Promise ((resolve,reject)=>{
        dbProduct.find().then((data)=>{
          resolve(data)
        })
      })
    },

    getProductDetails:(producId)=>{
      return new Promise ((resolve,reject)=>{
        dbProduct.find({_id:producId}).then((data)=>{
          //console.log(data);
          resolve(data)
        })
      })
    },

    deleteProduct : (producId)=>{
      return new Promise ((resolve,reject)=>{
        dbProduct.remove({_id:Object(producId)}).then((response)=>{
           resolve(response)
        })
      })
    },
    updateProduct: (producId,productData)=>{
      return new Promise ((resolve,reject)=>{
        dbProduct.updateOne({_id:producId},
        {
          $set:{ title : productData.title,
                 price : productData.price,
                 description : productData.description,
                 quantity : productData.quantity,
                 category : productData.category,
                 subcategory : productData.subcategory,
                 size : productData.size ,
                 img : productData.img}

        }).then((response)=>{
          resolve()
        })
      })
    },

    productsUserSide : ()=>{
      return new Promise ((resolve,reject)=>{
        dbProduct.find().then((data)=>{
          resolve(data)
        })
      })
    }

    
}