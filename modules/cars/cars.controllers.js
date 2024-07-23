import { ObjectId } from "mongodb";
import db from "../../database/dbConnection.js";

const addCar = async (req, res) => {
  try {
    const { name, model } = req.body;
    let car = await db
      .collection("cars")
      .insertOne({ name, model, rentalStatus: "available" });
    res.json({ message: "success", car });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllCars = async (req, res) => {
  try {
    let cars = await db.collection("cars").find().toArray();
    res.json({ message: "success", cars });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCar = async (req, res) => {
  try {
    let car = await db
      .collection("cars")
      .findOne({ _id: new ObjectId(req.params.carId) });

    !car
      ? res.json({ message: "car Not Found" })
      : res.json({ message: "success", car });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCar = async (req, res) => {
  try {
    const { name, model } = req.body;
    let car = await db
      .collection("cars")
      .updateOne(
        { _id: new ObjectId(req.params.carId) },
        { $set: { name, model } }
      );

    res.json({ message: "success", car });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCar = async (req, res) => {
  try {
    let car = await db
      .collection("cars")
      .deleteOne({ _id: new ObjectId(req.params.carId) });

    res.json({ message: "success", car });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const returnCar = async (req, res) => {
  const { rentalId } = req.params;
  try {
    const rental = await db.collection("rentals").findOne({
      _id: new ObjectId(rentalId),
    });
    if (!rental) {
      return res.status(404).json({ message: "Rental record not found" });
    }
    await db
      .collection("rentals")
      .updateOne(
        { _id: new ObjectId(rentalId) },
        { $set: { returnDate: new Date() } }
      );
    await db
      .collection("cars")
      .updateOne(
        { _id: rental.carId },
        { $set: { rentalStatus: "available" } }
      );
    res.status(200).json({ message: "Car returned successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getByModel = async (req, res) => {
  const { model } = req.query;
  console.log(model);
  try {
    const query = {
      model: { $in: ["Honda", "Toyota"] },
    };

    if (model) {
      query.model = model;
      let cars = await db.collection("cars").find(query).toArray();
      res.status(200).json({ message: "success", cars });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getByAvailability = async (req, res) => {
  const { model } = req.params;

  try {
    const query = {
      model: model,
      rentalStatus: "available",
    };
    let cars = await db.collection("cars").find(query).toArray();
    if (cars.length === 0) {
      res
        .status(400)
        .json({ message: "No cars Found Available of this model." });
    }
    res.status(200).json({ message: "success", cars });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getCarByFilter = async (req, res) => {
  const { model, rented } = req.query;

  try {
    const query = {};
    if (model) {
      query.model = model;
    }
    if (rented && rented.toLowerCase() === "true") {
      query.rentalStatus = "rented";
    } else {
      query.rentalStatus = "available";
    }
    let cars = await db.collection("cars").find(query).toArray();

    res.status(200).json({ message: "success", cars });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getByModelsAndAvailability = async (req, res) => {
  const { models, rented } = req.query;
  try {
    const query = {};
    if (models) {
      query.model = { $in: models.split(",") };
    }
    if (rented && rented.toLowerCase() === "true") {
      query.rentalStatus = "rented";
    } else {
      query.rentalStatus = "available";
    }
    let cars = await db.collection("cars").find(query).toArray();

    res.status(200).json({ message: "success", cars });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export {
  addCar,
  getAllCars,
  getCar,
  updateCar,
  deleteCar,
  returnCar,
  getByModel,
  getByAvailability,
  getCarByFilter,
  getByModelsAndAvailability,
};
