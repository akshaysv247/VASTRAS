const app = require("../app");
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

const adminLogin = (req, res) => {
  if (!req.session.admin) {
    res.render("admin/login", { message: req.flash("adminErr") });
  } else {
    res.redirect("/admin/dashboards");
  }
};

const adminSign = (req, res) => {
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

  //req.flash('adminErr', "Incorrect username or password ! "
};

const adminView = async(req, res,next) => {
  if (req.session.admin) {
    let sales = 0
    let online = 0
    let offline = 0
    let profit = 0
    let monthSalesCount = 0
    const totalSales = await orderDB.aggregate([{$group:{
      _id:null,
      price:{$sum:"$price"}
    }}])
   if(totalSales.length>0){
       sales = totalSales[0].price}
  
    const onlineTotal = await orderDB.aggregate([{$match:{payment:'Online'}},{$group:{
      _id:null,
      price:{$sum:"$price"}
    }}])
    if(onlineTotal.length>0){
     online = onlineTotal[0].price}
    const offlineTotal = await orderDB.aggregate([{$match:{payment:'COD'}},{$group:{
      _id:null,
      price:{$sum:"$price"}
    }}])
    if(offlineTotal.length>0){
      offline = offlineTotal[0].price
    }
    const totalProfit = await orderDB.aggregate([{$match:{status:'DELIVERED'}},{$group:{
      _id:null,
      price:{$sum:"$price"}
    }}])
    if(totalProfit.length>0){
     profit = totalProfit[0].price}
   // let date = moment().format("MMMM Do YYYY") 
    //let month = data.get
    let date = new Date();
    let theFirst = new Date(date.getFullYear(), 0, 1);
    let theLast = new Date(date.getFullYear(), 11, 31);
    let month = date.getUTCMonth()+1 
    let year = date.getFullYear();
    console.log(theFirst);
    console.log(theLast);
    console.log(year);
   
   
    res.render("admin/dashboard",{sales,online,offline,profit});
  } else {
    res.redirect("/admin");
  }
};

const adminProduct = (req, res) => {
  adminHelper.getProducts().then(async (product) => {
    //console.log(product);
    // console.log(product.category.name)
    res.render("admin/products", { product });
  });
};

const addProduct = async (req, res) => {
  const data = await category.find();
  res.render("admin/addproduct", { data });
};

const addProductAdd = async (req, res) => {
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
};

const adminLogout = (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
};

const admingetUsers = (req, res) => {
  userHelper.getAllUsers().then((data) => {
    res.render("admin/allUsers", { data });
  });
};

const editProduct = async (req, res) => {
  //console.log(req.params.id);

  const product = await productHelper
    .getProductDetails(req.params.id)
    .then((data) => {
      console.log(data);
      res.render("admin/editProduct", { data: data[0] });
    });
};

const deleteProducts = async (req, res) => {
  //console.log(req.params.id);
  const product = await productHelper
    .deleteProduct(req.params.id)
    .then((result) => {
      // console.log(result);
      res.redirect("/admin/products");
    });
};

const updateProduct = async (req, res) => {
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
};

const blockUser = (req, res) => {
  //console.log(req.body);
  adminHelper.userBlock(req.params.id).then((response) => {
    res.redirect("/admin/allusers");
  });
};

const unBlockUser = (req, res) => {
  adminHelper.userUnBlock(req.params.id).then((response) => {
    res.redirect("/admin/allusers");
  });
};

const productActive = async (req, res) => {
  // console.log(req.params.id);
  const producId = req.params.id;
  const change = await productDB.findOneAndUpdate(
    { _id: producId },
    { active: true },
    { upsert: true }
  );
  res.redirect("/admin/products");
};

const orderDetails = async (req, res) => {
  //const data = await orderDB.find()
  const data = await orderDB.find().populate("userId");
  // let products = await orderDB.findOne().populate("products.productId");
  // console.log(data);
  // console.log(products);

  res.render("admin/orders", { data });
};

const getBannerPage = async (req, res) => {
  const data = await bannerDB.find({});
  const dataIm = data.images;
  res.render("admin/banner", { data, dataIm });
};

const addBanner = async (req, res) => {
  console.log(req.body);
  console.log(req.files);
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
};

const removeBanner = async (req, res) => {
  const Id = req.params.id;
  const remove = await bannerDB.findOneAndDelete({ _id: Id });
  res.redirect("/admin/banner");
};

const getCouponsPage = async (req, res) => {
  const show = await couponDB.find({});
  res.render("admin/coupon", { show });
};

const addCoupon = async (req, res) => {
  res.render("admin/addcoupon");
};

const addCouponAdd = async (req, res) => {
  const data = req.body;
  const save = await couponDB.create(data);
  res.redirect("/admin/coupons");
};

const activateCoupons = async (req, res) => {
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
};

const deletecoupon = async (req, res) => {
  const ID = req.params.id;
  const deleteCoupon = await couponDB.findOneAndDelete({ _id: ID });
  res.redirect("/admin/coupons");
};

const viewOrdersProduct = async (req, res) => {
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
};
const orderStatus = async (req, res) => {
  // console.log(req.body);
  const orderId = req.body.orderId;
  const status = req.body.newOrderStatus;
  const update = await orderDB.findOneAndUpdate(
    { _id: orderId },
    { $set: { status: status } }
  );
  const orderUpdate = update.status;

  res.json({ status: true, orderUpdate });
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

const totalRevenue = async(req,res)=>{
  
  const data = await orderDB.aggregate([{$group:{_id:{$month:'$time'},count:{$sum:1}}},{$sort:{_id:1}}])
  console.log(data);
  let counts = []
  
   data.forEach(ele=> { 
   counts.push(ele.count)
  
   });
  res.json({status:true,counts})
}

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
  totalRevenue
  
};
