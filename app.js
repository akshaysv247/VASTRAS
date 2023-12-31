const express = require("express");
const path = require("path");
const logger = require("morgan");
//const createError = require('http-errors');
const ejs = require("ejs");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();

const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const bcrypt = require("bcrypt")
const adminDB = require("./models/adminShema")
const app = express();


(async function (req,res,next) {

try {
   mongoose.connect(process.env.local_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true
    // serverApi: ServerApiVersion.v1
    
  });
} catch (err) {
  next(err)
}
})()
 



// const addadmin =  async(next) => {
//   try{
// let password = ""
// let salt = await bcrypt.genSalt(10)
// let pass = await bcrypt.hash(password, salt)
// let email = ""
//  await adminDB.insertMany({
//     Email:email,
//     Password:pass,
//     Name:"shoppersAdmin"
//   })
// }catch(err){
//   next(err)
// }
// }
//addadmin()


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use("/css", express.static(path.join(__dirname, "public/user/css")));
app.use("/fonts", express.static(path.join(__dirname, "public/user/fonts")));
app.use("/images", express.static(path.join(__dirname, "public/user/images")));
app.use("/js", express.static(path.join(__dirname, "public/user/js")));

app.use(
  "/editaddress/css",
  express.static(path.join(__dirname, "public/user/css"))
);
app.use(
  "/editaddress/fonts",
  express.static(path.join(__dirname, "public/user/fonts"))
);
app.use(
  "/editaddress/images",
  express.static(path.join(__dirname, "public/user/images"))
);
app.use(
  "/editaddress/js",
  express.static(path.join(__dirname, "public/user/js"))
);

app.use(
  "/product/css",
  express.static(path.join(__dirname, "public/user/css"))
);
app.use(
  "/product/fonts",
  express.static(path.join(__dirname, "public/user/fonts"))
);
app.use(
  "/product/images",
  express.static(path.join(__dirname, "public/user/images"))
);
app.use("/product/js", express.static(path.join(__dirname, "public/user/js")));
app.use(
  "/public/private",
  express.static(path.join(__dirname, "public/private"))
);
app.use(
  "/categoryproduct/css",
  express.static(path.join(__dirname, "public/user/css"))
);
app.use(
  "/categoryproduct/fonts",
  express.static(path.join(__dirname, "public/user/fonts"))
);
app.use(
  "/categoryproduct/images",
  express.static(path.join(__dirname, "public/user/images"))
);
app.use(
  "/categoryproduct/js",
  express.static(path.join(__dirname, "public/user/js"))
);

app.use(
  "/conform/css",
  express.static(path.join(__dirname, "public/user/css"))
);
app.use(
  "/conform/fonts",
  express.static(path.join(__dirname, "public/user/fonts"))
);
app.use(
  "/conform/images",
  express.static(path.join(__dirname, "public/user/images"))
);
app.use("/conform/js", express.static(path.join(__dirname, "public/user/js")));

app.use(
  "/order-conform/css",
  express.static(path.join(__dirname, "public/user/css"))
);
app.use(
  "/order-conform/fonts",
  express.static(path.join(__dirname, "public/user/fonts"))
);
app.use(
  "/order-conform/images",
  express.static(path.join(__dirname, "public/user/images"))
);
app.use(
  "/order-conform/js",
  express.static(path.join(__dirname, "public/user/js"))
);

app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use("/admin/assets", express.static(path.join(__dirname, "public/assets")));

//const upload = multer({ dest: "public/files" });

//session middleware
app.use(
  sessions({
    secret: "thiskey",
    saveUninitialized: true,
    cookie: { maxAge: 6000000 },
    resave: false,
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

(async function (req,res,next) {
  try{
  const db =  mongoose.connection;
 
  db.on("error", console.error.bind(console, "connection error: "));
  db.once("open", function () {
  console.log("Connected successfully");
   //db.close()
})}
catch(err){
  next(err)
}
})()

 // client.connect(err => {
  //   const collection = client.db("test").collection("devices");
  //   // perform actions on the collection object
  //   client.close();
  // });

//console.log(mongoose.connection.readyState);

//app.use(expressLayouts);
//app.set('layout', './layouts/layout');

//app.engine('ejs',ejs.engine({extname:'ejs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}))

//app.use(express.static(path.join(__dirname,'public')));

//Routes
app.use("/admin", adminRouter);
app.use("/", userRouter);

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render("error")
})

const PORT = process.env.PORT;
app.listen(PORT, console.log("Server has started at port " + PORT));

//module.exports = app;
