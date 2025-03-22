import mongoose from "mongoose";

export const connect = async () => {
  try {
    return await mongoose.connect(process.env.MONGO_URI)
  } catch (error) {
    console.log(`Could not connect to database ${error}`)
  }
}

