import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  fullname : {
    type:"string",
    required :[true,"First name must be provided"],
  },
  email : {
    type:"string",
    unique : true,
    required : [true,"Email must be provided"],
  },
  img : {
    type:"string",
   
  },
  password : {
    type:"string",
    required : [true,"Report this iusse to the developer"],
  }
},{
  timestamps : true
})
export const Admin = mongoose.model("Admin",adminSchema)

