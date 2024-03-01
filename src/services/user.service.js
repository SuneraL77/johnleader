import { CartModel, CouponModel, OrderModel, ProductModel, UserModel } from "../models/index.js";
import createHttpError from "http-errors";
import fs from "fs/promises";
import exp from "constants";

export const updateUser = async (updateData) => {
  const {
    userId,
    fname,
    lname,
    email,
    mobile,
    line1,
    line2,
    city,
    district,
    country,
    postal_code,
  } = updateData;

  if (!fname || !lname || !email || !mobile) {
    throw createHttpError.BadRequest("Please fill all fields");
  }

  if (
    !validator.isLength(fname, { min: 2, max: 16 }) ||
    !validator.isLength(lname, { min: 2, max: 16 })
  ) {
    throw createHttpError.BadRequest(
      "First name and last name should be between 2 and 16 characters"
    );
  }

  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest("Please provide a valid email address");
  }

  if (!validator.isLength(password, { min: 6, max: 128 })) {
    throw createHttpError.BadRequest(
      "Please make sure your password is between 6 and 128 characters"
    );
  }

  const existingUser = await UserModel.findById(userId);
  if (!existingUser) {
    throw createHttpError.NotFound("User not found");
  }

  // Update the user
  existingUser.fname = fname;
  existingUser.lname = lname;
  existingUser.email = email;
  existingUser.mobile = mobile;

  let address = new ({
    line1,
    line2,
    city,
    district,
    country,
    postal_code,
    mobile,
  });
  existingUser.address = address;

  const updatedUser = await existingUser.save();
  return updatedUser;
};
export const findUsers = async () => {
  const {userId, sort, order, page } = listData;
  const user = await UserModel.findById(userId);
  if(user.role !=='admin'){
    throw createHttpError.BadRequest("Can't access other users")
  }
  const currentPage = page || 1;
  const perpage = (page = 12);
  const users = await UserModel.findOne({})  
  .skip((currentPage - 1) * perpage)
  .sort([[sort, order]])
  .limit(perpage);
  return users;
};

export const updateUserRole = async (userData) => {
  const {userId,user,role } = userData;
  const adminuser = await UserModel.findById(userId);
  if(adminuser.role !== 'admin' ){
    throw createHttpError.BadRequest("you can't change user")
  }
  const valideRoles = ["user", "admin"];
  if (!valideRoles.includes(role)) {
    throw createHttpError.BadRequest("Invalide role specified");
  }
  const updateUserRole = await UserModel.findByIdAndUpdate(
    user,
    {
      role: newRole,
    },
    { new: true }
  );

  return updateUserRole
};


export const updateAddress = async (addressData) =>{
const {userId, line1,
  line2,
  city,
  district,
  country,
  postal_code,
  mobile, }= addressData

  if(line1 || district|| city || country || postal_code ||mobile){
    throw createHttpError.BadRequest('all  field is required')
  }

  const  user = await UserModel.findByIdAndUpdate( userId,{
    $set:{
      "address.line1":line1,
      "address.line2":line2,
      "address.city":city,
      "address.district":district,
      "address.country":country,
      "address:postal_code": postal_code,
      "address:mobile":mobile,
    },
  },
  {new:true},
  );

  return user
}
export const deleteUser = async (userData) => {
  const {userId,user}  = userData;
  const checkusr = await UserModel.findById(userId);
  if(checkusr.role !== 'user'){
    throw createHttpError.BadRequest('In valid user')
  }
  const user1 = await UserModel.findById(user);
  if (!user1) {
    createHttpError.BadRequest("can't find user");
  }
  if (user1.propic.length > 0) {
    await fs.unlink(user.propic.path);
  }
  const deleted = await UserModel.findByIdAndDelete(user);
  return deleted;
};


export const userCart =async (cartData) =>{
  const {userId,cart} = cartData;

  let products = [];
  const user = await UserModel.findById(userId);
  
  try{
    const cartExistByThisUser = await CartModel.findOneAndUpdate({
      orderBy:user._id
    });
    console.log(cartExistByThisUser)
  }catch(error){
    console.log(error)
  }

  for (let i = 0; i < cart.length; i++) {
    let object = {};

    object.product = cart[i]._id;
    object.count = cart[i].count;

    // get price for creating total
    let productFromDb = await ProductModel.findById(cart[i]._id).select("price");
    object.price = productFromDb.price;

    products.push(object);
  }

  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count;
  }

  let newCart = await new CartModel({
    products,
    cartTotal,
    orderBy:userId
  }).save();

  return newCart


}

export const getuserCart = async () =>{
  let cart = await CartModel.findOne({orderBy:userId}).populate("products.product")

  return cart
}

export  const emptyCart  = async (userId) =>{
const user = await UserModel.findById(userId);

const cart = await CartModel.findById(user._id);
return cart
}

export const applytoCopon  = async (applyCouponData) => {
  const {coupon, userId} = applyCouponData;
  console.log("COUPON",)
}

export const applytoCouponToUsercart = async (couponData) =>{
  const { coupon ,userId} = couponData;
  console.log("COUPON", coupon);

  const validCoupon = await CouponModel.findOne({ name: coupon });
  if (validCoupon === null) {
    return res.json({
      err: "Invalid coupon",
    });
  }
  console.log("VALID COUPON", validCoupon);

  const user = await UserModel.findById(userId);

  let { products, cartTotal } = await Cart.findOne({
    orderdBy: userId,
  }).populate("products.product", "_id title price");

  console.log("cartTotal", cartTotal, "discount%", validCoupon.discount);

  // calculate the total after discount
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2); // 99.99

  console.log("----------> ", totalAfterDiscount);

  Cart.findOneAndUpdate(
    { orderdBy:userId},
    { totalAfterDiscount },
    { new: true }
  ).exec();
  const discount = validCoupon.discount;

return { totalAfterDiscount, discount }

}


export  const addWishlist = async (productData) =>{
  const {productId,userId} =productData;
const user = await UserModel.findOneAndUpdate(
  {_id:userId},
  {$addToSet :{wishlist:productId}}
)
return user
}
export const wishlists = async (userId) =>{
  const lists = await UserModel.find(userId).select('wishlist').populate('product')
  return lists
}
export const removeWishlist = async (wishlistData) =>{
  const {productId,userId} = wishlistData;
  const user = await UserModel.findOneAndUpdate({_id:userId},
    {$pull:{wishlist:productId}})
 
    return user
}

export const createOrder = async(orderData) => {
  const {COD,couponApplied ,userId} = orderData
  if(!COD){
    throw createHttpError.BadRequest("Create cash order failed")
  }
  const user = await UserModel.findById(userId);
  const userCart = await CartModel.findOne({orderBy:userId})

  let finalAmount = 0;
   if (couponApplied && userCart.totalAfterDiscount) {
    finalAmount = userCart.totalAfterDiscount;
  } else {
    finalAmount = userCart.cartTotal;
  }

  let newOrder = await new OrderModel({
    products:userCart.products,
    amount : finalAmount,
  

  })

}