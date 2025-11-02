````markdown
# 🧩 Express.js — Middlewares & Error Handlers

---

## 📚 Table of Contents

1. [🚀 Introduction](#-introduction)  
2. [⚙️ Basic Example: Multiple Handlers](#️-basic-example-multiple-handlers)  
3. [🪜 Using `next()` to Move to the Next Handler](#-using-next-to-move-to-the-next-handler)  
4. [⚠️ Error: Cannot Set Headers After They Are Sent](#️-error-cannot-set-headers-after-they-are-sent)  
5. [🧩 Multiple Handlers Example](#-multiple-handlers-example)  
6. [❌ If No Handler Sends a Response](#-if-no-handler-sends-a-response)  
7. [🧱 Alternate Syntax](#-alternate-syntax)  
8. [🧠 What Are Middlewares?](#-what-are-middlewares)  
9. [🧩 Types of Middleware](#-types-of-middleware)  
10. [🎯 Why Use Middleware](#-why-use-middleware)  
11. [🔐 Example — Authentication Middleware](#-example--authentication-middleware)  
12. [🆚 `app.use()` vs `app.all()`](#-appuse-vs-appall)  
13. [💥 Error Handling Middleware](#-error-handling-middleware)  
    - [Example 1 — Basic Error Middleware](#-example-1--basic-error-middleware)  
    - [Example 2 — Using trycatch](#-example-2--using-trycatch)  
    - [⚡ Common Mistake](#-common-mistake)  
14. [💡 Summary](#-summary)  
15. [🧾 Interview Summary](#-interview-summary)

---

## 🚀 Introduction

In Express.js, middleware functions form the backbone of request handling.  
They sit between the incoming request and the final response — processing data, verifying users, logging, handling errors, etc.

---

## ⚙️ Basic Example: Multiple Handlers

```js
const express = require('express');
const app = express();

app.get(
  "/user",
  (req, res) => {
    console.log("in 1st responseHandler");
    res.send("this is test1");
  },
  (req, res) => {
    console.log("in 2nd responseHandler");
    res.send("this is test2");
  }
);
````

🧠 **Explanation:**

* Only the **first handler** runs because it sends the response immediately.
* Once `res.send()` is called, Express ends the response cycle.

⚡ **Quick Notes**

* Each route can have **multiple handlers**.
* Without calling `next()`, control does **not move forward**.
* Once a response is sent, **no further handlers execute**.

---

## 🪜 Using `next()` to Move to the Next Handler

```js
app.get(
  "/user",
  (req, res, next) => {
    console.log("in 1st responseHandler");
    next();
  },
  (req, res) => {
    console.log("in 2nd responseHandler");
    res.send("this is test2");
  }
);
```

🧠 **Explanation**

* `next()` passes control to the **next function** in the chain.
* If `next()` is omitted, the request will **hang** (no response sent).

⚡ **Quick Notes**

* `next()` → moves to next middleware.
* Always ensure one middleware **ends the response**.

---

## ⚠️ Error: Cannot Set Headers After They Are Sent

```js
app.get(
  "/user",
  (req, res, next) => {
    console.log("in 1st responseHandler");
    res.send("this is test1");
    next(); // ❌ Wrong: next() called after sending response
  },
  (req, res) => {
    console.log("in 2nd responseHandler");
    res.send("this is test2");
  }
);
```

🧠 **Explanation**

* Express is **synchronous**, so after `res.send()`, headers are sent.
* Calling `next()` afterwards triggers the next handler → second `res.send()` call.
* Result: **Cannot send headers twice** → error.

⚡ **Quick Notes**

* Never call `next()` **after** sending response.
* Only one `res.send()` per request.

---

## 🧩 Multiple Handlers Example

```js
app.get(
  "/user",
  (req, res, next) => { console.log("Handler 1"); next(); },
  (req, res, next) => { console.log("Handler 2"); next(); },
  (req, res, next) => { console.log("Handler 3"); next(); },
  (req, res) => { console.log("Handler 4"); res.send("Response from 4th handler"); }
);
```

🧠 **Explanation**

* Control flows from **Handler 1 → 4**.
* Response comes from the **last handler**.

⚡ **Quick Notes**

* Chain multiple handlers using `next()`.
* Final handler must **send response**.

---

## ❌ If No Handler Sends a Response

```js
app.get(
  "/user",
  (req, res, next) => { console.log("Handler 1"); next(); },
  (req, res, next) => { console.log("Handler 2"); next(); },
  (req, res, next) => { console.log("Handler 3"); next(); },
  (req, res, next) => { console.log("Handler 4"); next(); }
);
```

🧠 **Explanation**

* All handlers execute, but none send a response.
* Express expects another handler → results in **“Cannot GET /user”** error.

⚡ **Quick Notes**

* Always ensure one handler **ends** the request-response cycle.

---

## 🧱 Alternate Syntax

You can define multiple handlers for the same route in two ways:

### ✅ Using Inline Functions

```js
app.use('/route', fn1, fn2, fn3);
app.use('/route', [fn1, fn2, fn3]);
app.use('/route', fn1, [fn2, fn3], fn4);
```

### ✅ Using Separate Route Definitions

```js
app.get("/user", (req, res, next) => {
  console.log("in handler 1");
  next();
});

app.get("/user", (req, res) => {
  res.send("in handler 2");
});
```

---

## 🧠 What Are Middlewares?

**Definition:**

> Middleware are functions that have access to the request (`req`), response (`res`), and the next middleware in the cycle (`next`).
> They form a **pipeline** that the request passes through before a response is sent.

### 🔄 How Middleware Works

1. **Request-Response Cycle** begins.
2. Each middleware runs **in order of definition**.
3. Middleware can:

   * Execute any logic.
   * Modify `req` or `res`.
   * End the cycle with a response.
   * Call `next()` to continue.
4. If `next()` isn’t called → request **hangs**.
5. The **last handler** typically sends the final response.

---

## 🧩 Types of Middleware

| Type                  | Description           | Example                                   |
| --------------------- | --------------------- | ----------------------------------------- |
| **Application-level** | Applies to all routes | `app.use(logger)`                         |
| **Router-level**      | Specific to a router  | `router.use(auth)`                        |
| **Error-handling**    | Handles thrown errors | `app.use((err, req, res, next) => {...})` |
| **Built-in**          | Provided by Express   | `express.json()`, `express.static()`      |
| **Third-party**       | Installed via npm     | `cors`, `body-parser`, `helmet`           |

---

## 🎯 Why Use Middleware

* For **repetitive logic** — authentication, logging, error handling.
* To **centralize** logic (avoid repeating checks in each route).
* Example: verifying admin before accessing admin routes.

---

## 🔐 Example — Authentication Middleware

```js
// src/middlewares/auth.js
const adminAuth = (req, res, next) => {
  console.log("Admin auth is being checked");
  const token = 'xyz';
  const isAdminAuthorized = token === 'xyz';
  if (!isAdminAuthorized) {
    res.status(401).send('Unauthorized Admin');
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("User auth is being checked");
  const token = 'xyz';
  const isUserAuthorized = token === 'xyz';
  if (!isUserAuthorized) {
    res.status(401).send('Unauthorized User');
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
```

```js
// app.js
const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
  res.send("All Data sent");
});

app.delete("/admin/deleteUser", (req, res) => {
  res.send("User deleted!");
});

app.get("/user", userAuth, (req, res) => {
  res.send("User Data sent");
});

app.post("/user/login", (req, res) => {
  res.send("Login successful");
});

app.listen(7777, () => console.log("Server running"));
```

⚡ **Quick Notes**

* `app.use('/admin', adminAuth)` applies middleware to **all `/admin` routes**.
* You can also use specific middleware per route.
* Helps avoid **repetitive authorization logic**.

---

## 🆚 `app.use()` vs `app.all()`

| Method                | Behavior                                                     | Example                        |
| --------------------- | ------------------------------------------------------------ | ------------------------------ |
| **app.use('/api')**   | Matches `/api` and any subpaths (`/api/test`)                | Works for **all HTTP methods** |
| **app.all('/api/*')** | Matches only routes **extending** `/api` (not `/api` itself) | Useful for **wildcards**       |

⚡ **Quick Notes**

* Both can handle all methods, but `app.use()` is more **inclusive**.
* Typically use `app.use()` for global middlewares.

---

## 💥 Error Handling Middleware

### 🧱 Example 1 — Basic Error Middleware

```js
app.get("/user/getData", (req, res) => {
  throw Error("Something broke!");
  res.send("userData send");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong");
  }
});
```

🧠 **Explanation**

* Any error thrown in routes will be caught by the **error-handling middleware**.
* The error handler has **four parameters** → `(err, req, res, next)`.

---

### 🧱 Example 2 — Using try...catch

```js
app.get("/user/getData", (req, res) => {
  try {
    throw Error("Something went wrong");
  } catch (err) {
    res.status(500).send("Error handled in route itself");
  }
});

app.use("/", (err, req, res, next) => {
  if (err) res.status(500).send("Global error handler");
});
```

🧠 **Explanation**

* If handled via `try...catch`, error middleware isn’t triggered.
* If not caught, Express forwards it automatically to the error handler.

⚠️ **Important:**
Always keep the **error middleware at the end** of all routes.

---

### ⚡ Common Mistake

```js
app.use("/", (err, req, res, next) => {
  if (err) res.status(500).send("Error caught early");
});

app.get("/user/getData", (req, res) => {
  throw Error("Error inside route");
});
```

🧠 **Explanation**

* `/` middleware runs **before** `/user/getData` (order matters).
* Error appears as raw Express error (unhandled).

✅ **Fix:** Always define the error handler **after all routes**.

---

## 💡 Summary

| Concept           | Key Idea                                  |
| ----------------- | ----------------------------------------- |
| **Middleware**    | Functions between request and response    |
| **next()**        | Moves to next middleware                  |
| **res.send()**    | Ends response; don’t call next() after    |
| **Error Handler** | Uses 4 args `(err, req, res, next)`       |
| **Order Matters** | Define routes before catch-all middleware |
| **app.use()**     | Works for all HTTP methods & subpaths     |
| **app.all()**     | Works for all methods, but specific paths |
| **Common Use**    | Auth, logging, data parsing, validation   |

---

## 🧾 Interview Summary

* Middleware = functions executed sequentially in Express request cycle.
* They have access to `req`, `res`, and `next()`.
* If no response is sent or `next()` not called → request **hangs**.
* Types: App-level, Router-level, Built-in, Third-party, Error-handling.
* Use middlewares for **auth, validation, error handling**.
* Always place error handlers **at the bottom** of the stack.
* Never send multiple responses in one request.

---

