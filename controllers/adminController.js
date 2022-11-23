const app = require("../app");
const userHelper = require("../helpers/userHelper");
const adminHelper = require("../helpers/adminHelper");
const productHelper = require("../helpers/productHelpers");
const category = require("../models/categorySchema");
const productDB = require("../models/productSchema");

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

const adminView = (req, res) => {
  if (req.session.admin) {
    res.render("admin/dashboard");
  } else {
    res.redirect("/admin");
  }
};

const adminProduct = (req, res) => {
  adminHelper.getProducts().then((product) => {
    res.render("admin/products", { product });
  });
};

const addProduct = async (req, res) => {
  const data = await category.find();
  res.render("admin/addproduct", { data });
};

const addProductAdd = async (req, res) => {
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
};
