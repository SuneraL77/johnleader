import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt'
const { ObjectId } = mongoose.Schema.Types;
const userSchema = mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, "Please Provide your name"],
    },
    lname: {
      type: String,
      required: [true, "Please Provide your name"],
    },
    address: {
      line1: String,
      line2: String,
      city: String,
      district: String,
      country: String,
      postal_code: String,
      mobile: String,
    },
    email: {
      type: String,
      required: [true, "Please provide your email address"],
      uinque: [true, "This email address already exit"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email adress"],
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    propic: { file: String, path: String },
    cart: {
      type: Array,
      default: [],
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
      minLength: [6, "Please make your password is at least 6 characters long"],
      maxLength: [
        128,
        "please make sure your password is less than 128 characters long",
      ],
    },
    wishlist: [{ type: ObjectId, ref: "ProductModel" }],
  },
  {
    colection: "users",
    timeStamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
    console.log(error);
  }
});
const UserModel =
  mongoose.models.UserModel || mongoose.model("UserModel", userSchema);

export default UserModel;
