import createHttpError from "http-errors";
import { CouponModel } from "../models/index.js";

export const createCoupen = async (coupenData) => {
  const { name, expiry, discount } = coupenData;
  if (!name || !expiry || !discount) {
    throw createHttpError.BadRequest("All fields are requied");
  }
  if (name.length < 6) {
    throw createHttpError.BadRequest("name minmun charater are 6");
  }
  if (name.length > 12) {
    throw createHttpError.BadRequest("name maximun character are 12");
  }
  let Coupen = new CouponModel({ name, expiry, discount }).save();

  return Coupen;
};

export const removeCoupen = async (coupenId) => {
  const deleted = await CouponModel.findByIdAndDelete(coupenId);
  return deleted;
};

export const deleteCoupen = async () => {
  const listCoupeen = await CouponModel.find({});
  return listCoupeen;
};
