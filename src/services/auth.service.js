import createHttpError from "http-errors";
import validator from "validator";
import { UserModel } from "../models/index.js";
import bcrypt from "bcrypt";

export const createUser = async (userData) =>{
    const{fname,lname,email,password} = userData;

    if (!fname || !email || !lname  || !password) {
        throw createHttpError.BadRequest("Please fill all fildes");
      }
      if (
        !validator.isLength(fname || lname, {
          min: 2,
          max: 16,
        })
      ) {
        throw createHttpError.BadRequest("please fill all filed");
      }
       //check if email adress is valid
  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest(
      "Please make sure to provide a valiid email"
    );
  }
    
  const checkDb = await UserModel.findOne({ email }) 
  if (checkDb) {
    throw createHttpError.Conflict(
      "Please try again with a different email address and mobile,this email or mobile already"
    );
  }


  if (
    !validator.isLength(password, {
      min: 6,
      max: 128,
    })
  ) {
    throw createHttpError.BadRequest(
      "Please make sure your password is between 6 and 128 characters"
    );
  }
  const user = await new UserModel({
    fname,
    lname,
    email,
    password,
  }).save();
  return user;

}



export const signUser = async (email,password) =>{
    const user = await UserModel.findOne({email:email.toLowerCase()}).lean();
  
    //check if user exieit
    if(!user)  throw createHttpError.NotFound("Invalid clent details");
    
    //compare password
    let passwordMatches = await bcrypt.compare(password,user.password);
    if(!passwordMatches) throw createHttpError.NotFound('Invalid credentials');
  
    return user
  }