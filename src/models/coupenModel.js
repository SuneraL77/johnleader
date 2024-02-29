import mongoose from "mongoose";


const couponSchema = mongoose.Schema(
    {
        name: {
          type: String,
          trim: true,
          unique: true,
          uppercase: true,
          required: "Nmae is required",
          minlength: [6, "Too short"],
          maxlength: [12, "Too long"],
        },
        expiry: {
          type: Date,
          required: true,
        },
        discount: {
          type: Number,
          requred: true,
        },
      },
  {
    colection: "coupen",
    timeStamps: true,
  }
);

const CouponModel =
  mongoose.models.CouponModel || mongoose.model("CouponModel", couponSchema);

export default CouponModel;
