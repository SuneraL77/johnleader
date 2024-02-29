import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const cartSchema = mongoose.Schema(
  {

    products:[
{
    product:{
        type:ObjectId,
        ref:"ProductModel"
    },
    count:Number,
    color:String,
    price:Number,
},
    ]
 
  },
  {
    colection: "carts",
    timeStamps: true,
  }
);

const CartModel =
  mongoose.models.CartModel || mongoose.model("CartModel", cartSchema);

export default CartModel;
