import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const productSchema = mongoose.Schema(
    {
          title: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            text: true,
          },
          slug: {
            type: String,
            uinque: true,
            lowercase: true,
            index: true,
          },
          price: {
            type: Number,
            trim: true,
            required: true,
          },
          description: {
            type: String,
            required: true,
            maxlength: 2000,
            text: true,
          },
          category: {
            type: ObjectId,
            ref: "Category",
          },
          subs: [
            {
              type: ObjectId,
              ref: "Sub",
            },
          ],
          quantity: {
            type: Number,
            required: true,
          },
          sold: {
            type: Number,
            default: 0,
          },
          profic: {
            type: Array,
          },
          shipping: {
            type: String,
            enum: ["Yes", "No"],
          },
          color: {
            type: String,
            enum: ["Black", "Brown", "White", "Blue", "Silver"],
          },
          brand: {
            type: String,
            enum: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
          },
          ratings: [ {
              star: Number,
              comment:String,
              postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

            },
          ],

        },
    {
      colection: "products",
      timeStamps: true,
    }
  );
  
  const ProductModel =
    mongoose.models.ProductModel || mongoose.model("ProductModel", productSchema);
  
  export default ProductModel;
  