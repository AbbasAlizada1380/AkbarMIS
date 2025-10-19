import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deactivateUser,
  reactivateUser,
  changePassword,
} from "../Controllers/userController.js";

const userrouter = express.Router();

userrouter.post("/register", registerUser);
userrouter.post("/login", loginUser);
userrouter.get("/", getAllUsers);
userrouter.get("/:id", getUserById);
userrouter.patch("/:id", updateUser);
userrouter.patch("/:id/deactivate", deactivateUser);
userrouter.patch("/:id/reactivate", reactivateUser);
userrouter.patch("/:id/password", changePassword);

export default userrouter;
