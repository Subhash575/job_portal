import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/user.controller.js";
import isAuthenticated, { limitAttempts } from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(limitAttempts(), singleUpload, register);
router.route("/login").post(limitAttempts(), login);
//In logout we use the get bcs we don't send any data there.
router.route("/logout").get(logout);
//Here we want that authenticate people only able to update profile therefore we use
// middleware here
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);


export default router;
