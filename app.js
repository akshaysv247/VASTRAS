const express = require("express");
const path = require("path");
const logger = require("morgan");
//const createError = require('http-errors');
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();

const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");

const app = express();

mongoose.connect("mongodb://localhost:27017/ecommercedb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true
});

app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
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

app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use("/admin/assets", express.static(path.join(__dirname, "public/assets")));

//const upload = multer({ dest: "public/files" });

//session middleware
app.use(
  sessions({
    secret: "thiskey",
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
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

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
//console.log(mongoose.connection.readyState);

//app.use(expressLayouts);
//app.set('layout', './layouts/layout');

//app.engine('ejs',ejs.engine({extname:'ejs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}))

//app.use(express.static(path.join(__dirname,'public')));

//Routes
app.use("/admin", adminRouter);
app.use("/", userRouter);

const PORT = process.env.PORT || 5111;
app.listen(PORT, console.log("Server has started at port " + PORT));
//console.log(process.env);

module.exports = app;
