const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const validator = require("validator");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Signs up a user
app.post("/signup", async (req, res) => {
  try {
    // validate the data
    validateSignupData(req);
    const { firstName, lastName, email, password } = req.body;
    //Encrypt password
    const passwordHash = await bcrypt.hash(password, 10);
    // creating new instance of user
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    await user.save();
    res.send("User created successfully");
  } catch (err) {
    console.error("User can not be saved", err);
    res.status(400).send("Something went wrong" + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Invalid credentials");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }
    const token = user.getJWT();
    res.cookie("token", token, {
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.send("Login successful");
  } catch (err) {
    console.error("Login error", err);
    res.status(400).send("ERROR " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

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

// FEED API - get all users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    console.error("Something went erong", err);
    res.status(400).send("Something went wrong" + err);
  }
});

// Delete a user from database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    console.error("Something went erong", err);
    res.status(400).send("Something went wrong" + err);
  }
});

//Update data of a user
app.patch("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  try {
    const ALLOWED_UPDATES = ["photoURL", "about", "gender", "skills"];

    const isUpdateAllowed = Object.keys(updates).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      return res.status(400).send("Update is not allowed");
    }

    if (updates.skills && updates.skills.length > 10) {
      return res.status(400).send("Skills cannot be more than 10");
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message);
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
