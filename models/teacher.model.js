import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, "First name must be provided"],
    },
    oname: {
      type: String,
      required: [true, "Other name must be provided"],
    },
    address: {
      type: String,
      required: [true, "Address must be provided"],
    },
    class: {
      type: String,
      required: [true, "Class must be provided"],
    },
    dob: {
      type: String,
      required: [true, "dob must be provided"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email must be provided"],
    },
    subject: {
      type: String,
      required: [true, "subject must be provided"],
    },
    number: {
      type: String,
      required: [true, "Number must be provided"],
      match: [/^\d{10,15}$/, "Please enter a valid phone number"],
    },
    gender: {
      type: String,
      required: [true, "gender must be provided"],
    },
    img: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Report this iusse to the developer"],
    },
    teaherId: {
      type: String,
      required: [true, "Teacher Id is required"],
    },
  },
  {
    timestamps: true,
  }
);
export const Teacher = mongoose.model("Teacher",teacherSchema)

