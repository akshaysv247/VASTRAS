const { response } = require('../app')
const app = require('../app')
const productHelpers = require('../helpers/productHelper')
const userHelper = require('../helpers/userHelper')
const adminHelpers = require('../helpers/adminHelper')

   




    const adminLogin =(req,res)=>{

     
        res.render("admin/login",{ message: req.flash('adminErr') })
  
    }



  const adminSign = (req,res)=>{
       console.log(req.body);
    adminHelpers.adminId(req.body).then((response)=>{
        if(response){
      console.log(response);

        res.redirect('/admin/dashboards')
        }else{
        req.flash('adminErr'," Incorrect username or password ! ")
        res.redirect('/admin')}
    })
      
  
     
    //req.flash('adminErr', "Incorrect username or password ! "
    
    }

 const adminView = (req, res) => {

    res.render("admin/dashboard")
}


const adminProduct = (req, res) => {
 productHelpers.getAllProducts().then((data)=>{
    res.render("admin/products",{data})
 })
    
}

const addProduct = (req,res)=>{

    res.render('admin/addproduct')
}

const addProductAdd =async(req,res)=>{
   
   const image =await req.file.filename
   Object.assign(req.body,{img:image});
  // console.log(req.body)
    productHelpers.addproduct(req.body).then((response)=>{
       // console.log(response);
        res.redirect('/admin/products')
    })
}

const adminLogout = (req,res)=>{
   
   
    //req.flash("success_message", "You logged out successfully!");
    res.redirect('/admin')
}

const admingetUsers = (req,res)=>{
  userHelper.getAllUsers().then((data)=>{
    res.render('admin/allUsers',{data})
  })
}

const editProduct = async(req,res)=>{
    //console.log(req.params.id);
    const ID = req.params.id
    const product= await productHelpers.getProductDetails(ID).then((data)=>{
        res.render('admin/editProduct',{data:data[0]})
    })
   
}

const deleteProducts = async(req,res)=>{
  // console.log(req.params.id);
    const product = await productHelpers.deleteProduct(req.params.id).then((result)=>{
        console.log(result);
        res.redirect('/admin/products')
    })
}

 const updateProduct = async(req,res)=>{
    const image =await req.file.filename
    Object.assign(req.body,{img:image});
    
    const data = await productHelpers.updateProduct(req.params.id,req.body).then((response)=>{
       
        console.log(response);
        res.redirect('/admin/products')
    })
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
    updateProduct
    
}