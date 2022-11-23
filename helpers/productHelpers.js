const dbProduct = require("../models/productSchema");
const category = require("../models/categorySchema");

module.exports = {
  addproduct: (productData) => {
    return new Promise(async (resolve, reject) => {
      const product = await dbProduct.create(productData).then((data) => {
        resolve(data._id);
      });
    });
  },

  // getAllProducts:() => {
  //   return new Promise ((resolve,reject)=>{
  //      dbProduct.find().then((result)=>{

  //       resolve(result)
  //     })
  //   })
  // },

  getProductDetails: (producId) => {
    return new Promise((resolve, reject) => {
      dbProduct.find({ _id: producId }).then((data) => {
        //console.log(data);
        resolve(data);
      });
    });
  },

  deleteProduct: (producId) => {
    return new Promise((resolve, reject) => {
      dbProduct
        .findOneAndUpdate(
          { _id: producId },
          { active: false },
          { upsert: true }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },

  updateProduct: (producId, productData) => {
    return new Promise((resolve, reject) => {
      dbProduct
        .updateMany(
          { _id: producId },
          {
            $set: {
              title: productData.title,
              price: productData.price,
              description: productData.description,
              quantity: productData.quantity,
              category: productData.category,
              subcategory: productData.subcategory,
              size: productData.size,
              images: productData.img,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },

  productsUserSide: () => {
    return new Promise((resolve, reject) => {
      dbProduct.find({ active: true }).then((data) => {
        resolve(data);
      });
    });
  },
};
