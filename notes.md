# 🧠 Express.js Routing — Complete Notes

---

## 🚀 Basic Express Setup

```js
const express = require('express');

const app = express();

app.use('/', (req, res) => {
  res.send('Namaste');
});

app.use('/hello', (req, res) => {
  res.send('Hello hello hello');
});

app.use('/test', (req, res) => {
  res.send('This is test');
});

app.listen(7777, () => {
  console.log('Server is running');
});
````

### 🧩 Explanation

* The server runs on **port 7777**.
* `app.use()` handles **all HTTP methods** (GET, POST, PUT, DELETE, etc.).
* Routes are matched **from top to bottom**.
* Once a match is found, **Express stops checking** further routes.
* If `/` is placed first, it will match everything (since all paths start with `/`).

### ⚡ Quick Notes

* `app.use()` → handles all methods
* Routes checked **top → bottom**
* `/` matches everything if first
* **Order of routes matters**

---

## ⚖️ Order of Routes

```js
app.use('/', (req, res) => {
  res.send('Root');
});

app.use('/hello', (req, res) => {
  res.send('Hello Route');
});
```

* Visiting `/hello/test` will match `/` first if `/` comes before `/hello`.
* If we reverse the order:

```js
app.use('/hello', (req, res) => {
  res.send('Hello Route');
});

app.use('/', (req, res) => {
  res.send('Root');
});
```

Then `/hello/test` will correctly go to the `/hello` route.

### ⚡ Quick Notes

* Express matches routes **top to bottom**
* The **first match executes**
* Always put **generic routes (like `/`) last**

---

## 🌐 HTTP Methods Explained

### 🧱 HTTP Methods Overview

| Method     | Purpose                   | Safe |    Idempotent   |
| :--------- | :------------------------ | :--: | :-------------: |
| **GET**    | Retrieve data             |   ✅  |        ✅        |
| **POST**   | Create new data           |   ❌  |        ❌        |
| **PUT**    | Replace existing resource |   ❌  |        ✅        |
| **PATCH**  | Partially update resource |   ❌  | ⚠️ (Not always) |
| **DELETE** | Delete resource           |   ❌  |        ✅        |

### 🧠 Explanation

* **Safe** → Does not modify server data.
* **Idempotent** → Multiple identical requests result in the same outcome.
* Browsers send a **GET request** by default when visiting a URL.

**Difference between methods:**

* `app.use()` → matches **all HTTP methods**.
* `app.get()`, `app.post()` → match only the specified method.

### ⚡ Quick Notes

* **GET:** Read data
* **POST:** Create new data
* **PUT:** Replace resource
* **PATCH:** Partial update
* **DELETE:** Remove resource
* `app.use()` = all methods

---

## 🧩 Advanced Routing Patterns

*(For Express v4.x and path-to-regexp v6 or below)*

| Pattern    | Description                    | Example URLs that match     |
| ---------- | ------------------------------ | --------------------------- |
| `/abc`     | Exact match                    | `/abc`                      |
| `/ab?c`    | `b` is optional                | `/abc`, `/ac`               |
| `/ab+c`    | One or more `b`s               | `/abc`, `/abbc`, `/abbbbbc` |
| `/ab*cd`   | Anything between `ab` and `cd` | `/abcd`, `/abRANDOMcd`      |
| `/a(bc)?d` | Optional group                 | `/ad`, `/abcd`              |

### 🧠 Regex Routes

```js
app.get(/a/, (req, res) => { ... });       // Matches any path containing "a"
app.get(/.*fly$/, (req, res) => { ... });  // Matches any path ending with "fly"
```

### ⚡ Quick Notes

* `/ab?c` → optional character
* `/ab+c` → multiple allowed
* `/ab*cd` → wildcard in between
* `/a(bc)?d` → optional group
* Regex supported: `/a/`, `/.*fly$/`

---

## 🧱 Express Router (Newer Syntax – Express 5+)

Express 5+ prefers modular route definitions using `Router()`.

### Example

```js
const express = require('express');
const router = express.Router();

// Normal routes
router.get('/abc', (req, res) => res.send('ABC'));
router.get('/a(bc)?d', (req, res) => res.send('Optional BC'));

// Grouping multiple HTTP methods
router.route('/user')
  .get((req, res) => res.send('GET User'))
  .post((req, res) => res.send('POST User'))
  .put((req, res) => res.send('PUT User'));

module.exports = router;
```

### ⚡ Quick Notes

* Use **`express.Router()`** for modular routes
* Use `.route()` to handle **multiple methods** on one path
* Cleaner and maintainable codebase

---

## 🔍 Query Parameters — `req.query`

**Example URL:**

```
/user?userId=101&pass=aponiar
```

**Code Example:**

```js
app.get('/user', (req, res) => {
  console.log(req.query.userId); // 101
  console.log(req.query.pass);   // aponiar
});
```

### ⚡ Quick Notes

* Use `req.query` for URLs with `?key=value`
* Example:
  `/search?q=node` → `req.query.q = 'node'`

---

## 🧭 Dynamic Route Parameters — `req.params`

**Example Route:**

```js
app.get('/user/:userId', (req, res) => {
  console.log(req.params.userId); // Output: 101
});
```

**Example URL:**

```
/user/101
```

### ⚡ Quick Notes

* Use `req.params` for **dynamic segments** in routes
* `/user/:id` → `/user/101`
  → `req.params.id = '101'`

---

## 💡 Summary of Key Points

✅ **Order matters** — Express checks routes **top to bottom**
✅ **`app.use()`** matches all methods
✅ Use **`req.query`** for `?key=value` pairs
✅ Use **`req.params`** for dynamic URL segments
✅ Use **pattern or regex routes** for flexible matching
✅ Prefer **`express.Router()`** in modular apps

---

### 📘 Example Route Order Recommendation

```js
// Specific routes first
app.get('/user/:id', userHandler);
app.get('/user', listUsers);
app.get('/about', aboutHandler);

// Generic catch-all or root last
app.use('/', homeHandler);
```

