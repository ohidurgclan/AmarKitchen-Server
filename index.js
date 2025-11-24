require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
// Middlewares
app.use(cors());
app.use(express.json());

// Environment variables
const PORT = process.env.PORT || 7090;
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
const URI = process.env.MONGO_URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const run = async() => {
  try {
    await client.connect();
    const database = await client.db('amarKitchen');
    const userCollection = database.collection('users');
/* ---------------------------------------------------------- */
                 // API Routes Starts
/* ---------------------------------------------------------- */
    app.get('/users', async (req, res) => {
        const cursor = userCollection.find({});
        const packages = await cursor.toArray();
        res.send(packages);
    });

// Example Register Route
    app.post('/register', async (req, res) => {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const db = client.db("myDatabase");
        const users = db.collection("users");
        await users.insertOne({ name, email, password: hashedPassword });
        res.send({ success: true, message: "User registered!" });
    });

    // Example Login Route
    app.post('/login', async (req, res) => {
        const { email, password } = req.body;
        const db = client.db("myDatabase");
        const users = db.collection("users");
        const user = await users.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid password" });
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1d" });
        res.json({ success: true, token });
    });
/* ---------------------------------------------------------- */
                 // API Routes End
/* ---------------------------------------------------------- */
  } finally {
    // Ensures that the client will close when you finish/error
    console.log("Congrats To Md Ohidur Rahman (221002406)")
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Amar kitchen Server is running! Congrats To Md Ohidur Rahman (221002406)');
});
// Start server
app.listen(PORT, () => {
    console.log(`API Running at http://localhost:${PORT}`);
});