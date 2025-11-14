const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.get("/user", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).send("User is not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    console.error("User can not be saved", err);
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    console.error("Something went erong", err);
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    console.error("Something went erong", err);
    res.status(400).send("Something went wrong");
  }
});

app.patch('/user',async (req, res) => {
  const userId = req.body.userId;
  const updates = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, updates);
    res.send("User updated successfully");
  } catch (err) {
    console.error("Something went erong", err);
    res.status(400).send("Something went wrong");
  }
});

app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    console.error("User can not be saved", err);
    res.status(400).send("Something went wrong");
  }
});

connectDB()
  .then(() => {
    console.log("DB connected successfully");
    app.listen(7777, () => {
      console.log("server is running");
    });
  })
  .catch((err) => {
    console.error("DB connection failed");
  });
