import jwt from "jsonwebtoken"

export const generateTokensAndSetCookie = (id,res) => {
  const token = jwt.sign({id},process.env.JWT_SECRET,{
    expiresIn : "15d"
  })
  res.cookie("token",token,{
    maxAge:15*24*60*10000,
    httpOnly:true,
    sameSite:"Strict",
    secure:process.env.NODE_ENV !== "development"
  })
}