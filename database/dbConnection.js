import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://0.0.0.0:27017");

client
  .connect()
  .then(() => {
    console.log("Connected successfully to server");
  })
  .catch((error) => {
    console.log(error);
  });
const db = client.db("RentalCars");

export default db;
