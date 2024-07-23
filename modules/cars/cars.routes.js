import { Router } from "express";
import {
  addCar,
  deleteCar,
  getAllCars,
  getCar,
  getByModel,
  returnCar,
  updateCar,
  getByAvailability,
  getCarByFilter,
  getByModelsAndAvailability,
} from "./cars.controllers.js";

const carsRouter = Router();

carsRouter.get("/filter", getCarByFilter);

carsRouter.get("/models", getByModel);
carsRouter.get("/model&avail", getByModelsAndAvailability);
carsRouter.get("/:model", getByAvailability);
carsRouter.post("/", addCar);
carsRouter.get("/", getAllCars);
carsRouter.get("/:carId", getCar);
carsRouter.put("/:carId", updateCar);
carsRouter.delete("/:carId", deleteCar);
carsRouter.put("/return/:rentalId", returnCar);
export default carsRouter;
