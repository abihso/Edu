import mongoose from "mongoose";

const feesSchema = new mongoose.Schema({
  studentid : {
    type:"string",
    required :[true,"Id must be provided"],
  },
  class : {
    type:"string",
    required : [true,"Class must be provided"],
  },
  mode : {
    type:"string",
    required :[true,"Mode must be provided"],
  },
  amount : {
    type:"string",
    required : [true,"Amount must be provided"],
  },
  reference : {
    type:"string",
    required : [true,"Reference must be provided"],
  },
},{
  timestamp : true
})

export const Fees = mongoose.model("Fees",feesSchema)

