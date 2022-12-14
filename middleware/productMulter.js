const multer = require("multer");

//Configuration for Multer
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, "image-" + Date.now()+file.originalname);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

//Calling the "multer" Function
const multiImage = multer({
  storage: multerStorage,
});

const upload = multiImage.array("myFile", 4);

module.exports = upload;
