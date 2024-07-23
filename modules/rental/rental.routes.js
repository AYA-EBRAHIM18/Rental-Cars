import { Router } from "express";
import {
  createRental,
  updateRental,
  deleteRental,
  getAllRentals,
  getRental,
} from "./rental.controllers.js";

const rentalRouter = Router();

rentalRouter.post("/", createRental);
rentalRouter.put("/:rentalId", updateRental);
rentalRouter.delete("/:rentalId", deleteRental);
rentalRouter.get("/", getAllRentals);
rentalRouter.get("/:rentalId", getRental);

export default rentalRouter;
