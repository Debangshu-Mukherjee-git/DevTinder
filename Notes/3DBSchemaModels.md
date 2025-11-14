# # **📘 Database, Schema & Models — Study Notes**

A complete, clean guide to using **Mongoose**, understanding **schemas**, **models**, connecting to MongoDB, handling request bodies, CRUD operations, and interview-ready concepts.

---

# ## **📡 Connecting MongoDB with Mongoose**

### **📁 File: `src/config/database.js`**

```js
// src/config/database.js
const mongoose = require("mongoose");

// Async function to connect to MongoDB
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://debangshumukherjee:dev-tinder-debangshu@cluster0.yc88hhf.mongodb.net/devTinder?appName=Cluster0"
  );
};

module.exports = connectDB;
```

### **📝 Why wrap mongoose.connect() inside an async function?**

* Allows `await` → ensures connection completes before continuing
* Enables `.then()` / `.catch()` handling
* Cleaner error handling
* Production-grade best practice

---

# ## **🚀 Starting the Server *After* DB Connection**

### ❌ Wrong:

Connection runs but app starts *without waiting* for DB.

```js
const express = require("express");
require("./config/database");

const app = express();

app.listen(7777, () => console.log("server is running")); 
```

### ✅ Correct:

Wait for DB → then start listening.

```js
const express = require("express");
const connectDB = require("./config/database");

const app = express();

connectDB()
  .then(() => {
    console.log("DB connected successfully");
    app.listen(7777, () => console.log("server is running"));
  })
  .catch((err) => {
    console.error("DB connection failed", err);
  });
```

---

# ## **🧭 MongoDB Connection URL Explained**

| Connection URL                                             | Meaning                                       |
| ---------------------------------------------------------- | --------------------------------------------- |
| `mongodb+srv://username:password@cluster-url.mongodb.net/` | Connects to cluster → DB defaults to **test** |
| `mongodb+srv://...mongodb.net/devTinder`                   | Connects to **devTinder** database            |

### **ℹ️ About `appName=`**

* Purely client-side metadata
* Does **not** affect DB or cluster
* Optional
* Helps identify apps in MongoDB Atlas logs

---

# ## **🏗️ Schemas & Models**

### **📘 Schema**

A **blueprint** for how documents look inside a collection.
a schema defines the structure of a document inside a MongoDB collection.
It specifies what fields a document will have, their data types, and any validations or default values.
Basically, it’s like a blueprint for how the data should look.

### **📙 Model**

A **constructor** created from a schema.
Used to **create, read, update, delete** documents.
A model is created from a schema and represents a specific collection in the database.
It’s what we actually use to interact with MongoDB — to create, read, update, or delete documents.

---

# ### **🧩 Example: User Schema & Model**

```js
// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  age: Number,
  gender: String,
});

// model(name, schema)
const User = mongoose.model("User", userSchema);

module.exports = User;
```

---

# ## **🔤 mongoose.model vs mongoose.Model**

| Term                               | Meaning                                                   |
| ---------------------------------- | --------------------------------------------------------- |
| **mongoose.model("User", schema)** | Function used to create or retrieve a model               |
| **mongoose.Model**                 | Base class all models inherit from (`find`, `save`, etc.) |

You almost **never** use `mongoose.Model` directly.

---

# ## **📝 Creating a Document (Signup Example)**

```js
app.post("/signup", async (req, res) => {
  try {
    const user = new User({
      firstName: "Debangshu",
      lastName: "Mukherjee",
      email: "debangshu@mukherjee.com",
      password: "12345678",
      gender: "male",
      age: 26,
    });

    await user.save();     // inserts into DB
    res.send("User created successfully");
  } catch (err) {
    console.error("User cannot be saved", err);
    res.status(400).send("Error");
  }
});
```

### ⚠️ Important:

You **must return a response** → otherwise request hangs.

---

# ## **🆔 Auto-Generated Fields: `_id` and `__v`**

| Field   | Meaning                                              |
| ------- | ---------------------------------------------------- |
| **_id** | Unique identifier for every document (ObjectId)      |
| **__v** | Version key used by Mongoose for concurrency control |

---

# # **🧠 JSON vs JavaScript Object**

| Feature               | JS Object   | JSON                      |
| --------------------- | ----------- | ------------------------- |
| Stored in memory      | ✔️          | ❌ (string format)         |
| Can contain functions | ✔️          | ❌                         |
| Quotes around keys    | optional    | must be **double quotes** |
| Purpose               | programming | data exchange             |

```js
// JS object
const user = { name: "Debangshu", age: 26 };

// JSON
const json = '{"name": "Debangshu", "age": 26}';
```

---

# ## **📥 Why req.body is undefined without express.json()?**

Node's request body = **readable stream**, comes in chunks.

```js
req.on("data", chunk => {...});
req.on("end", () => {...});
```

Express solves this automatically using:

```js
app.use(express.json());
```

### **What express.json() does:**

- ✔ Reads the incoming request body (which is a readable stream)
- ✔ Parses the JSON string → converts it into a JavaScript object
- ✔ Attaches the parsed object to `req.body`
- ✔ Internally calls `next()` to pass control to the next middleware or route handler

---


# # **🛠️ Mongoose CRUD Behaviors & Tricks**

### **🔍 find() vs findOne()**

| Method    | Returns                                        |
| --------- | ---------------------------------------------- |
| find()    | array of all matching docs                     |
| findOne() | first matching document (not guaranteed order) |

To control order:

```js
User.findOne({ email }).sort({ _id: -1 });
```

---

# ## **🔥 TOP Interview Questions (with Answers)**

### **1️⃣ deleteOne() vs findByIdAndDelete()**

| Method              | Deletes by | Returns                  |
| ------------------- | ---------- | ------------------------ |
| deleteOne()         | filter     | only delete result       |
| findByIdAndDelete() | `_id`      | returns deleted document |

---

### **2️⃣ Invalid ID in findById()?**

Throws **CastError** → fix:

```js
if (!mongoose.Types.ObjectId.isValid(id)) { ... }
```

---

### **3️⃣ Does updateOne() return updated document?**

❌ No.

To get updated doc:

```js
User.findOneAndUpdate(query, update, { new: true }); // old way
User.findOneAndUpdate(query, update, { returnDocument: 'after' }); // new way (Recommended)
```

---

### **4️⃣ updateOne() vs findOneAndUpdate()**

| Method             | Returns       | Use case                |
| ------------------ | ------------- | ----------------------- |
| updateOne()        | update result | no need for updated doc |
| findOneAndUpdate() | updated doc   | need updated doc        |

---

### **5️⃣ Why does findById() accept strings?**

Mongoose automatically **casts** to ObjectId.

---

### **6️⃣ What does { new: true } do?**

Returns **updated** document instead of old one.

---

### **7️⃣ save() vs updateOne()**

| Method      | Validations Run?                   |
| ----------- | ---------------------------------- |
| save()      | ✔ always                           |
| updateOne() | ❌ unless `{ runValidators: true }` |

---

### **8️⃣ create() vs new Model() + save()**

| Method       | Behavior                        |
| ------------ | ------------------------------- |
| create()     | creates & saves in one step     |
| new + save() | get instance first → save later |

Use when you need pre-save manipulation.

---

### **9️⃣ What is lean()?**

Converts query result to **plain JS objects** → faster, no `.save()` etc.

```js
User.find().lean();
```

---

### **🔟 Do soft-deleted documents appear in find()?**

Yes — unless manually filtered.

---

---

# # **⚡ Quick Notes (Revision Friendly)**

* Mongoose → ODM for MongoDB
* Schema = structure
* Model = collection interface
* connectDB() must complete **before** app.listen
* `_id` from MongoDB, `__v` from Mongoose
* req.body requires `express.json()`
* findOne() returns first match (order not guaranteed)
* updateOne() doesn’t return updated doc
* findOneAndUpdate({},{},{ new:true }) returns updated doc
* save() runs validations; updateOne() does not
* lean() returns plain objects
* Invalid ObjectId → CastError

---

## 📌 Summary

- ✔ MongoDB requires a **successful async connection** before the server starts
- ✔ **Schemas** define structure; **Models** interact with the database
- ✔ Mongoose adds features like **__v**, type casting, middleware, and validation
- ✔ `express.json()` is required to parse **JSON request bodies**
- ✔ CRUD methods behave differently (`findOne`, `updateOne`, `save`, `create`)
- ✔ Many interview questions focus on casting, validation, update behavior, and `lean()`

---

