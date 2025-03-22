import bcrypt from "bcrypt"

export const hashpassword = async (data) => {
  let generateSalt = await bcrypt.genSalt(10)
  return await bcrypt.hash(data,generateSalt)
}