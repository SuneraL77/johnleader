import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = mongoose.Schema(
    {
        product: [
          {
            product:{
                type:ObjectId,
                ref:"ProductModel"
            },
            count:Number,
          }
        ] ,
        amount:{type:Number},
        currency: { typr: String },
        orderStatus: {
          type: String,
          default: "Not Processed",
          enum: [
            "Not Processed",
            "processing",
            "Dispatched",
            "Cancelled",
            "Completed",
            "Cash On Delivery",
            "UnPaid",
            "Paid",
            "Faild",
          ],
        },
        payment_method_types: { type: String },
        status: {
          type: String,
        },
        orderdBy:{
            type:ObjectId,
            ref:"UserModel"
        }
    
        },
    {
      colection: "orders",
      timeStamps: true,
    }
  );
  
  const OrderModel =
    mongoose.models.OrderModel || mongoose.model("OrderModel", orderSchema);
  
  export default OrderModel;
  