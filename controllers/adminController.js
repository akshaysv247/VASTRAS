const userHelper = require("../helpers/userHelper");
const adminHelper = require("../helpers/adminHelper");
const productHelper = require("../helpers/productHelpers");
const category = require("../models/categorySchema");
const productDB = require("../models/productSchema");
const categoryDB = require("../models/categorySchema");
const orderDB = require("../models/orderSchema");
const bannerDB = require("../models/banner");
const couponDB = require("../models/coupon");
const moment = require("moment");
const userDB = require("../models/userSchema");
const addProVali = require("../validation/adminValidation")

const adminLogin = (req, res, next) => {
  try {
    if (!req.session.admin) {
      res.render("admin/login", { message: req.flash("adminErr") });
    } else {
      res.redirect("/admin/dashboards");
    }
  } catch (err) {
    next(err);
  }
};

const adminSign = (req, res, next) => {
  try {
    // console.log(req.body);
    adminHelper.adminId(req.body).then((response) => {
      if (response) {
        req.session.admin = true;

        res.redirect("/admin/dashboards");
      } else {
        req.flash("adminErr", " Incorrect username or password ! ");
        res.redirect("/admin");
      }
    });
  } catch (err) {
    next(err);
  }
};

const adminView = async (req, res, next) => {
  try {
    if (req.session.admin) {
      let sales = 0;
      let online = 0;
      let offline = 0;
      let profit = 0;
      let monthSalesCount = 0;
      const totalSales = await orderDB.aggregate([
        {
          $group: {
            _id: null,
            price: { $sum: "$price" },
          },
        },
      ]);
      if (totalSales.length > 0) {
        sales = totalSales[0].price;
      }

      const onlineTotal = await orderDB.aggregate([
        { $match: { payment: "Online" } },
        {
          $group: {
            _id: null,
            price: { $sum: "$price" },
          },
        },
      ]);
      if (onlineTotal.length > 0) {
        online = onlineTotal[0].price;
      }
      const offlineTotal = await orderDB.aggregate([
        { $match: { payment: "COD" } },
        {
          $group: {
            _id: null,
            price: { $sum: "$price" },
          },
        },
      ]);
      if (offlineTotal.length > 0) {
        offline = offlineTotal[0].price;
      }
      const totalProfit = await orderDB.aggregate([
        { $match: { status: "DELIVERED" } },
        {
          $group: {
            _id: null,
            price: { $sum: "$price" },
          },
        },
      ]);
      if (totalProfit.length > 0) {
        profit = totalProfit[0].price;
      }

      const orderList = await orderDB.find({}).sort({ time: -1 }).limit(9);

      const newDate = Date.now();
      const totalUsers = await userDB.find({}).count();
      console.log(totalUsers);
      const blockedUser = await userDB.find({ is_active: false }).count();
      console.log(blockedUser);
      const totalorders = await orderDB.find({}).count();
      console.log(totalorders);
      const todayorders = await orderDB.find({ date: newDate }).count();
      console.log(todayorders);

      // console.log(orderList);
      res.render("admin/dashboard", {
        sales,
        online,
        offline,
        profit,
        totalUsers,
        blockedUser,
        totalorders,
        todayorders,
        orderList,
      });
    } else {
      res.redirect("/admin");
    }
  } catch (err) {
    next(err);
  }
};

const adminProduct = (req, res, next) => {
  try {
    adminHelper.getProducts().then(async (product) => {
      //console.log(product);
      // console.log(product.category.name)
      res.render("admin/products", { product });
    });
  } catch (err) {
    next(err);
  }
};

const addProduct = async (req, res, next) => {
  try {
    const data = await category.find();
    res.render("admin/addproduct", { data, message: req.flash("adminErr")  });
  } catch (err) {
    next(err);
  }
};

const addProductAdd = async (req, res) => {
  try {
     let validation = addProVali(req).then((result)=>{
      console.log(result);
      if(result==true){
        //console.log(req.body);
        if (req.files.length === 0) {
          productHelper.addproduct(req.body).then((response) => {
            // console.log(response);
            res.redirect("/admin/products");
          });
        } else {
          const img = [];
          req.files.forEach((element) => {
            img.push(element.filename);
          });
          Object.assign(req.body, { images: img });
          // console.log(req.body)
          productHelper.addproduct(req.body).then((response) => {
            // console.log(response);
            res.redirect("/admin/products");
          });
        }
      }else{
        req.flash("adminErr", " please full fill the form ! ");
        res.redirect("/admin/addproduct");
      }
     })
    
  } catch (err) {
    next(err);
  }
};

const adminLogout = (req, res, next) => {
  try {
    req.session.destroy();
    res.redirect("/admin");
  } catch (err) {
    next(err);
  }
};

const admingetUsers = (req, res, next) => {
  try {
    userHelper.getAllUsers().then((data) => {
      res.render("admin/allUsers", { data });
    });
  } catch (err) {
    next(err);
  }
};

const editProduct = async (req, res, next) => {
  try {
    //console.log(req.params.id);

    const product = await productHelper
      .getProductDetails(req.params.id)
      .then((data) => {
        console.log(data);
        res.render("admin/editProduct", { data: data[0] });
      });
  } catch (err) {
    next(err);
  }
};

const deleteProducts = async (req, res, next) => {
  try {
    //console.log(req.params.id);
    const product = await productHelper
      .deleteProduct(req.params.id)
      .then((result) => {
        // console.log(result);
        res.redirect("/admin/products");
      });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    if (req.files.length === 0) {
      const data = await productHelper
        .updateProduct(req.params.id, req.body)
        .then((response) => {
          // console.log(response);
          res.redirect("/admin/products");
        });
    } else {
      const img = [];
      req.files.forEach((element) => {
        img.push(element.filename);
      });
      Object.assign(req.body, { images: img });

      const data = await productHelper
        .updateProduct(req.params.id, req.body)
        .then((response) => {
          // console.log(response);
          res.redirect("/admin/products");
        });
    }
  } catch (err) {
    next(err);
  }
};

const blockUser = (req, res, next) => {
  try {
    //console.log(req.body);
    adminHelper.userBlock(req.params.id).then((response) => {
      res.redirect("/admin/allusers");
    });
  } catch (err) {
    next(err);
  }
};

const unBlockUser = (req, res, next) => {
  try {
    adminHelper.userUnBlock(req.params.id).then((response) => {
      res.redirect("/admin/allusers");
    });
  } catch (err) {
    next(err);
  }
};

const productActive = async (req, res, next) => {
  try {
    // console.log(req.params.id);
    const producId = req.params.id;
    const change = await productDB.findOneAndUpdate(
      { _id: producId },
      { active: true },
      { upsert: true }
    );
    res.redirect("/admin/products");
  } catch (err) {
    next(err);
  }
};

const orderDetails = async (req, res, next) => {
  try {
    //const data = await orderDB.find()
    const data = await orderDB.find().populate("userId").sort({time:-1})
    // let products = await orderDB.findOne().populate("products.productId");
    // console.log(data);
    // console.log(products);

    res.render("admin/orders", { data });
  } catch (err) {
    next(err);
  }
};

const getBannerPage = async (req, res, next) => {
  try {
    const data = await bannerDB.find({});
    const dataIm = data.images;
    res.render("admin/banner", { data, dataIm });
  } catch (err) {
    next(err);
  }
};

const addBanner = async (req, res, next) => {
  try {
    // console.log(req.body);
    // console.log(req.files);
    if (req.files.length == 0) {
      const data = await bannerDB.create(req.body);
      res.redirect("/admin/banner");
    } else {
      const img = [];
      req.files.forEach((element) => {
        img.push(element.filename);
      });
      Object.assign(req.body, { images: img });
      // console.log(req.body)
      const dataI = await bannerDB.create(req.body);
      res.redirect("/admin/banner");
    }
  } catch (err) {
    next(err);
  }
};

const removeBanner = async (req, res, next) => {
  try {
    const Id = req.params.id;
    const remove = await bannerDB.findOneAndDelete({ _id: Id });
    res.redirect("/admin/banner");
  } catch (err) {
    next(err);
  }
};

const getCouponsPage = async (req, res, next) => {
  try {
    const show = await couponDB.find({});
    res.render("admin/coupon", { show });
  } catch (err) {
    next(err);
  }
};

const addCoupon = async (req, res, next) => {
  try {
    res.render("admin/addcoupon");
  } catch (err) {
    next(err);
  }
};

const addCouponAdd = async (req, res, next) => {
  try {
    const data = req.body;
    const save = await couponDB.create(data);
    res.redirect("/admin/coupons");
  } catch (err) {
    next(err);
  }
};

const activateCoupons = async (req, res, next) => {
  try {
    const ID = req.params.id;
    const data = await couponDB.findOne({ _id: ID });
    if (data.active == true) {
      const update = await couponDB.findOneAndUpdate(
        { _id: ID },
        { active: false }
      );
    } else {
      const updateNew = await couponDB.findOneAndUpdate(
        { _id: ID },
        { active: true }
      );
    }
    res.redirect("/admin/coupons");
  } catch (err) {
    next(err);
  }
};

const deletecoupon = async (req, res, next) => {
  try {
    const ID = req.params.id;
    const deleteCoupon = await couponDB.findOneAndDelete({ _id: ID });
    res.redirect("/admin/coupons");
  } catch (err) {
    next(err);
  }
};

const viewOrdersProduct = async (req, res, next) => {
  try {
    // console.log(req.params.id);
    // console.log(req.body);
    const ID = req.params.id;
    let order = null;
    let data = null;
    const find = await orderDB.findOne({ _id: ID });
    if (find) {
      order = await orderDB.findOne({ _id: ID }).populate("products.productId");
      data = order.products;
      // console.log(order);
    }
    res.json({ status: true, order, data });
  } catch (err) {
    next(err);
  }
};
const orderStatus = async (req, res, next) => {
  try {
    // console.log(req.body);
    const orderId = req.body.orderId;
    const status = req.body.newOrderStatus;
    const update = await orderDB.findOneAndUpdate(
      { _id: orderId },
      { $set: { status: status } }
    );
    const orderUpdate = update.status;

    res.json({ status: true, orderUpdate });
  } catch (err) {
    next(err);
  }
};

// const salesReport = async(req,res)=>{
//   const totalSales = await orderDB.aggregate([{$group:{
//     _id:null,
//     price:{$sum:"$price"}
//   }}])
//   console.log(totalSales);
//     const sales = totalSales[0].price

//   const onlineTotal = await orderDB.aggregate([{$match:{payment:'Online'}},{$group:{
//     _id:null,
//     price:{$sum:"$price"}
//   }}])
//   const online = onlineTotal[0].price
//   const offlineTotal = await orderDB.aggregate([{$match:{payment:'COD'}},{$group:{
//     _id:null,
//     price:{$sum:"$price"}
//   }}])
//   const offline = offlineTotal[0].price
//   const totalProfit = await orderDB.aggregate([{$match:{status:'DELIVERED'}},{$group:{
//     _id:null,
//     price:{$sum:"$price"}
//   }}])
//   const profit = totalProfit[0].price

// }

const totalRevenue = async (req, res, next) => {
  try {
    const data = await orderDB.aggregate([
      { $group: { _id: { $month: "$time" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    //console.log(data);
    let counts = [];

    data.forEach((ele) => {
      counts.push(ele.count);
    });
    res.json({ status: true, counts });
  } catch (err) {
    next(err);
  }
};

const categorySales = (req, res, next) => {
  try {
    return new Promise(async (resolve, reject) => {
      const cat = await categoryDB.find({});
      if (cat.length > 0) {
        const men = await categoryDB.findOne({ name: "Men" });
        const women = await categoryDB.findOne({ name: "Women" });
        const child = await categoryDB.findOne({ name: "Children" });

        const findCatMen = await productDB.aggregate([
          { $match: { category: men._id } },
        ]);
        const findCatChild = await productDB.aggregate([
          { $match: { category: child._id } },
        ]);
        const findCatWomen = await productDB.aggregate([
          { $match: { category: women._id } },
        ]);
        //

        //console.log(findCatWomen);
        var salesPie = [];
        const findW = () => {
          let sum = 0;
          return new Promise(async (resolve, reject) => {
            for (let i = 0; i < findCatWomen.length; i++) {
              var catWomenSales = await orderDB.aggregate([
                { $unwind: "$products" },
                { $match: { "products.productId": findCatWomen[i]._id } },
                { $group: { _id: null, total: { $sum: "$products.total" } } },
              ]);
              for (let j = 0; j < catWomenSales.length; j++) {
                sum = catWomenSales[j].total + sum;
                //console.log(sum);
              }
            }
            resolve(sum);
          });
        };
        const findM = () => {
          let sum = 0;
          return new Promise(async (resolve, reject) => {
            for (let i = 0; i < findCatMen.length; i++) {
              var catMenSales = await orderDB.aggregate([
                { $unwind: "$products" },
                { $match: { "products.productId": findCatMen[i]._id } },
                { $group: { _id: null, total: { $sum: "$products.total" } } },
              ]);
              for (let j = 0; j < catMenSales.length; j++) {
                sum = catMenSales[j].total + sum;
                //console.log(sum);
              }
            }
            resolve(sum);
          });
        };
        const findC = () => {
          let sum = 0;
          return new Promise(async (resolve, reject) => {
            for (let i = 0; i < findCatChild.length; i++) {
              var catChildSales = await orderDB.aggregate([
                { $unwind: "$products" },
                { $match: { "products.productId": findCatChild[i]._id } },
                { $group: { _id: null, total: { $sum: "$products.total" } } },
              ]);
              for (let j = 0; j < catChildSales.length; j++) {
                sum = catChildSales[j].total + sum;
                //console.log(sum);
              }
            }
            resolve(sum);
          });
        };
        const newF = () => {
          return new Promise((resolve, reject) => {
            findW()
              .then((sum) => {
                //console.log(sum,);
                salesPie.push(sum);
              })
              .then(() => {
                findM()
                  .then((sum) => {
                    //console.log(sum,);
                    salesPie.push(sum);
                  })
                  .then(() => {
                    findC()
                      .then((sum) => {
                        //console.log(sum,);
                        salesPie.push(sum);
                      })
                      .then(() => {
                        resolve(salesPie);
                      });
                  });
              });
          });
        };

        newF().then((data) => {
          //console.log(data);
          resolve(data);
        });
      }
    });
  } catch (err) {
    next(err);
  }
};

const salesPieTotal = (req, res, next) => {
  try {
    categorySales().then((result) => {
      console.log(result);
      res.json({ status: true, result });
    });
  } catch (err) {
    next(err);
  }
};

const salesReport = async (req, res, next) => {
  try {
    let data = await orderDB
      .aggregate([{$match:{status:"DELIVERED"}},
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.productId",
            totalPrice: { $sum: "$products.total" },
            count: { $sum: "$products.quantity" },
          },
        },
      ])
      .sort({ count: -1 });

    //console.log(data);
    res.render("admin/salesreport", { data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  adminLogin,
  adminSign,
  adminView,
  adminProduct,
  addProduct,
  addProductAdd,
  adminLogout,
  admingetUsers,
  editProduct,
  deleteProducts,
  updateProduct,
  blockUser,
  unBlockUser,
  productActive,
  orderDetails,
  getBannerPage,
  addBanner,
  removeBanner,
  getCouponsPage,
  addCoupon,
  addCouponAdd,
  activateCoupons,
  deletecoupon,
  viewOrdersProduct,
  orderStatus,
  totalRevenue,
  salesPieTotal,
  salesReport,
};
