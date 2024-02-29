import { createUser, signUser } from "../services/auth.service.js";
import { generateToken } from "../services/token.service.js";
import createHttpError from 'http-errors';

export const register=async (req,res,next) =>{
    try {
        const {fname,lname,email,password} = req.body;
        const newUser = await  createUser({fname,lname,email,password});
       
        const access_token = await generateToken(
            { userId: newUser._id },
            "1d",
            process.env.ACCESS_TOKEN_SECRET
          );
          const refresh_token = await generateToken(
            { userId: newUser._id },
            "30d",
            process.env.REFRESH_TOKEN_SECRET
          );
          res.cookie("refreshToken", refresh_token, {
            httpOnly: true,
            path: "/api/v1/auth/refreshtoken",
            maxAge: 30 * 24 * 60 * 1000, //30day
          });
          console.table({ access_token, refresh_token });
          res.json({
            message: "register success",
      
            user: {
              id: newUser._id,
              first_name: newUser.fname,
              last_name: newUser.lname,
              email: newUser.email,
              password: newUser.password,
              role:newUser.role,
              token: access_token,
            },
          });
    } catch (error) {
      console.log(error)
        next(error)
    }
}

export const  login = async (req,res,next) => {
  try {
   const {email,password} = req.body;
   const user = await signUser(email,password)
   const access_token = await generateToken(
    { userId: user._id },
    "1d",
    process.env.ACCESS_TOKEN_SECRET
  );
  const refresh_token = await generateToken(
    { userId: user._id },
    "30d",
    process.env.REFRESH_TOKEN_SECRET
  );
  res.cookie("refreshToken",refresh_token,{
    httpOnly:true,
    path:"/api/v1/auth/refreshtoken",
    maxAge:30* 24* 60 * 1000, //30day
  })
  res.json({
    message: "login success",
      
    user: {
      _id: user._id,
      first_name: user.fname,
      last_name:user.lname,
      email: user.email,
      password:user.password,
      token:access_token, 
    },
  })
  } catch (error) {
    next(error)
  }
}