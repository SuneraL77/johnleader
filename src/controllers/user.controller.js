import { addWishlist, removeWishlist, updateAddress, updateUser, wishlists} from "../services/user.service.js";

export const userUpdate = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const {
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
    } = req.body;
    const user = await updateUser(
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
      postal_code
    );
    res.json(user)
  } catch (error) {
    next(error);
  }
};
export const updateUserAdress = async (req, res, next) => {
    try {
        const userId =  req.user.userId
     const { line1,
        line2,
        city,
        district,
        country,
        postal_code,
        mobile, }= req.body 
     const user = await updateAddress({userId, line1,
        line2,
        city,
        district,
        country,
        postal_code,
        mobile, });
     res.json(user);


    } catch (error) {
      next(error);
    }
  };
export const Wishlist = async (req,res,next) =>{
    try {
        const userId = req.user.userId;
        const {productId} = req.body
        const wishlist = await addWishlist({userId,productId})
        res.json(wishlist)
    } catch (error) {
        next(error)
    }
}
export const showwishlsist = async (req,res,next) =>{
    try{
const wishlist = await wishlists(req.user.userId);
res.json(wishlist)
    }catch(error){
    next(error)
    }
}
export const deleteWishlist = async (req,res, next) => {
    try {
        const userId = req.user.userId;
        const {productId} = req.body;
        const removeProductwishlist = await removeWishlist({userId,productId});
        res.json(removeProductwishlist)
    } catch (error) {
        next(error)
    }
}