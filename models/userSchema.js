
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    trime:true,
    default: null
    
  },
  Email: {
        type: String,
        required: true,
        trime:true,
        unique:true
       
 },
  Password:{
     type:String,
     required: true
     
 },
  PhoneNumber:{
    type:Number,
    maxlength: 10,
    required: true
  
 },
 is_active: {
  type: Boolean,
  default: true,
},
 
},{ timestamps: true })



const userData = mongoose.model("userData", userSchema);

module.exports = userData;