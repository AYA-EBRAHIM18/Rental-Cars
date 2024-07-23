import { ObjectId } from "mongodb";
import db from "./../../database/dbConnection.js";
import bcrypt from "bcrypt";

const signUp = async (req, res) => {
  try {
    let { name, email, phone, password } = req.body;
    const existingCustomer = await db
      .collection("customers")
      .findOne({ email: `${email}` });
    if (existingCustomer) {
      return res.status(400).json({ error: "Customer already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    let user = await db
      .collection("customers")
      .insertOne({ name, email, phone, password: hashedPassword });
    res.json({ message: "success", user });
  } catch (err) {
    res.json({ error: err.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db
      .collection("customers")
      .findOne({ email: `${email}` });
    if (!user) {
      return res.status(404).json({ error: "Customer not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.json({ message: "login..token" });
  } catch (err) {
    res.json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    let user = await db
      .collection("customers")
      .updateOne({ _id: new ObjectId(req.params.userId) }, { $set: req.body });
    res.json({ message: "success", user });
  } catch (err) {
    res.json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    let user = await db
      .collection("customers")
      .deleteOne({ _id: new ObjectId(req.params.userId) });
    res.json({ message: "success" });
  } catch (err) {
    res.json({ error: err.message });
  }
};
const getAllUsers = async (req, res) => {
  try {
    let users = await db.collection("customers").find().toArray();
    res.json({ message: "success", users });
  } catch (err) {
    res.json({ error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const customer = await db
      .collection("customers")
      .findOne({ _id: new ObjectId(req.params.userId) });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json({ message: "success", customer });
  } catch (err) {
    res.json({ error: err.message });
  }
};
export { updateUser, deleteUser, getAllUsers, signIn, signUp, getUserById };
