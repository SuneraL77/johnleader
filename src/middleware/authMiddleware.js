import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { findUserId } from "../services/auth.service.js";

export const authMidllware = async (req, res, next) => {
  if (!req.headers["authorization"])
    return next(createHttpError.Unauthorized());
  const berareToken = req.headers["authorization"];
  const token = berareToken.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      return next(createHttpError.Unauthorized());
    }
    req.user = payload;
    next();
  });
};

export const isAdmin = async (req, res, next) => {
  const user = await findUserId(req.user.userId);
  if (user.role !== "admin") {
    res.json("Unautorized");
  } else {
    next();
  }
};
