import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  signIn,
  signUp,
  updateUser,
} from "./users.controllers.js";

const userRouter = Router();
userRouter.post("/signUp", signUp);
userRouter.post("/SignIn", signIn);
// userRouter.get("/userId", getUser);
userRouter.put("/:userId", updateUser);
userRouter.delete("/:userId", deleteUser);
userRouter.get("/", getAllUsers);
userRouter.get("/:userId", getUserById);
export default userRouter;
