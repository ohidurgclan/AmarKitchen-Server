require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId  } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// ENV
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
const URI = process.env.MONGO_URI;

// Mongo client
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let userCollection;
let menuCollection;
let kitchenCollection;

// Connect only once
async function connectDB() {
  if (client.topology && client.topology.isConnected()) return;
  try {
    await client.connect();
    const db = client.db("amarKitchen");
    userCollection = db.collection("users");
    menuCollection = db.collection("menu");
    kitchenCollection = db.collection("kitchen");

    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  }
}
// -----------------------------------------------------------------------------
// ------------------------------- ROUTES STARTS -------------------------------
// -----------------------------------------------------------------------------

app.get("/users", async (req, res) => {
  await connectDB();
  const users = await userCollection.find().toArray();
  res.send(users);
});

app.post("/users", async (req, res) => {
  await connectDB();
  const result = await userCollection.insertOne(req.body);
  res.json(result);
});

app.put("/users/:id", async (req, res) => {
  await connectDB();
  const id = req.params.id;
  const updatedUser = {
    $set: req.body
  };
  const result = await userCollection.updateOne(
    { _id: new ObjectId(id) },
    updatedUser
  );
  res.json(result);
});

app.delete("/users/:id", async (req, res) => {
  await connectDB();
  const id = req.params.id;
  const result = await userCollection.deleteOne({
    _id: new ObjectId(id)
  });
  res.json(result);
});

// Register
app.post("/register", async (req, res) => {
  await connectDB();
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  await userCollection.insertOne({ name, email, password: hashed });
  res.json({ success: true, message: "User registered!" });
});

// Login
app.post("/login", async (req, res) => {
  await connectDB();
  const { email, password } = req.body;
  const user = await userCollection.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  const correct = await bcrypt.compare(password, user.password);
  if (!correct) return res.status(400).json({ message: "Invalid password" });
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ success: true, token });
});
// -----------------------------------------------------------------------------
// ------------------------------- ROUTES ENDS ---------------------------------
// -----------------------------------------------------------------------------
// Root Domain Route
app.get("/", (req, res) => {
  res.send("Congrats Md Ohidur Rahman (S_ID: 221002406)! Your AmarKitchen Production Server is Running!...");
});

// Logical Setup For Proiduction &  Local Environment
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 7090;
  app.listen(PORT, () => {
    console.log("AmarKitchen Local Server Running on Port", PORT);
  });
}
module.exports = app;