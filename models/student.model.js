import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, "First name must be provided"],
    },
    oname: {
      type: String,
      required: [true, "Other name must be provided"],
    },
    parentname: {
      type: String,
      required: [true, "Parent full name must be provided"],
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
    gender: {
      type: String,
      required: [true, "gender must be provided"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email must be provided"],
      match: [/.+\@.+\..+/, "Please enter a valid email"],
    },
    number: {
      type: String,
      required: [true, "Number must be provided"],
      match: [/^\d{10,15}$/, "Please enter a valid phone number"],
    },
    img: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, "Report this issue to the developer"],
    },
    studentId: {
      type: String,
      required: [true, "Student Id is required"],
    },
  },
  {
    timestamps: true,
  }
);

export const Student = mongoose.model("Student", studentSchema);
