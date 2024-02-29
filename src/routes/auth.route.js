import express from "express";
import trimRequest from "trim-request";
import { login, register } from "../controllers/auth.controller.js";
const router = express.Router();
router.route("/register").post(trimRequest.all,register);
router.route("/login").post(trimRequest.all,login);

export default router