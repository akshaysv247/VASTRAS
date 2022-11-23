const category = require("../models/categorySchema");

module.exports = {
  admincategory: async (req, res) => {
    const data = await category.find();
    console.log(data);
    res.render("admin/categorys", { data });
  },

  addCategory: async (req, res) => {
    //console.log(req.body);
    const data = await category.create(req.body);
    res.redirect("/admin/category");
  },

  removeCategory: async (req, res) => {
    console.log(req.params.id);
    const catId = req.params.id;
    const dele = await category.findByIdAndDelete(catId);
    res.redirect("/admin/category");
  },
};
