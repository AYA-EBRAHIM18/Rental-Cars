import { ObjectId } from "mongodb";
import db from "../../database/dbConnection.js";
const createRental = async (req, res) => {
  const { carId, customerId, rentalDate, returnDate } = req.body;
  if (!carId || !customerId || !rentalDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const newRentalData = {
      carId: new ObjectId(carId),
      customerId: new ObjectId(customerId),
      rentalDate: new Date(rentalDate),
      returnDate: returnDate ? new Date(returnDate) : null,
    };
    const car = await db
      .collection("cars")
      .findOne({ _id: new ObjectId(carId), rentalStatus: "available" });

    if (!car) {
      return res.status(400).json({ message: "Car is not available for rent" });
    }
    const newRental = await db.collection("rentals").insertOne(newRentalData);
    await db
      .collection("cars")
      .updateOne(
        { _id: new ObjectId(carId) },
        { $set: { rentalStatus: "rented" } }
      );

    res.json({ message: "success", newRental });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateRental = async (req, res) => {
  const { rentalId } = req.params;
  const { rentalDate, returnDate } = req.body;
  try {
    const rental = await db.collection("rentals").findOne({
      _id: new ObjectId(rentalId),
    });
    if (!rental) {
      return res.status(404).json({ message: "Rental record not found" });
    }
    const updateQuery = {};
    if (rentalDate) {
      updateQuery.rentalDate = new Date(rentalDate);
    }
    if (returnDate) {
      updateQuery.returnDate = new Date(returnDate);
    }
    const updatedRental = await db
      .collection("rentals")
      .updateOne({ _id: new ObjectId(rentalId) }, { $set: updateQuery });

    res.status(200).json({ message: "Rental updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const deleteRental = async (req, res) => {
  let { rentalId } = req.params;
  try {
    const rental = await db.collection("rentals").findOne({
      _id: new ObjectId(rentalId),
    });
    await db
      .collection("cars")
      .updateOne(
        { _id: rental.carId },
        { $set: { rentalStatus: "available" } }
      );
    await db.collection("rentals").deleteOne({ _id: new ObjectId(rentalId) });

    res.json({ message: "Rental is deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getAllRentals = async (req, res) => {
  try {
    let rentals = await db.collection("rentals").find().toArray();
    res.json({ message: "success", rentals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getRental = async (req, res) => {
  try {
    let rental = await db
      .collection("rentals")
      .findOne({ _id: new ObjectId(req.params.rentalId) });

    !rental
      ? res.json({ message: "Rental Not Found" })
      : res.json({ message: "success", rental });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export { createRental, updateRental, deleteRental, getAllRentals, getRental };
