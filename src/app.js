const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
  res.send("All Data send");
});

app.delete("/admin/deleteUser", (req, res) => {
  res.send("User Data deleted !");
});

app.get("/user", userAuth, (req, res) => {
  console.log("in route handler 1");
  res.send("userData send");
});

app.post("user/login", (req, res) => {
  res.send("login successfully");
});

app.get("/user/getData", (req, res) => {
  //   try {
  throw Error("hfhf");
  res.send("userData send");
  //   } catch (err) {
  //     res.status(500).send("Something went wrong in the user handler");
  //   }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong");
  }
});

app.listen(7777, () => {
  console.log("server is running");
});
