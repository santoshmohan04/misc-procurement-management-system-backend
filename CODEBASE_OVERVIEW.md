# Codebase Overview — Procurement Management System Backend

## 📦 Repository Overview

**Name:** `misc-procurement-management-system-backend`  
**Purpose:** A REST API backend for a **Procurement Management System** — managing suppliers, purchase orders, deliveries, delivery advice notes, products, and payments.

---

## 🛠️ Key Technologies

| Technology | Purpose |
|---|---|
| **Node.js + Express.js** | HTTP server & routing framework |
| **MongoDB + Mongoose** | Database & ODM (Object Document Mapper) |
| **bcrypt** | Password hashing |
| **jsonwebtoken (JWT)** | Authentication tokens |
| **celebrate + Joi** | Request validation (schema enforcement) |
| **dotenv** | Environment variable management |
| **pug** | Server-side HTML templating (minimal — just a health-check landing page) |
| **ESLint + Prettier + Husky** | Code quality & pre-commit hooks |
| **Jest + Supertest + Babel** | Testing framework |

---

## 🗂️ Directory Structure

```
├── app.js              # Express app setup (middleware, routes, view engine)
├── server.js           # HTTP server entry point (listens on PORT)
├── routes/             # Route definitions — maps HTTP verbs/paths to controllers
├── controllers/        # Request handlers — parse req/res, call services
├── services/           # Business logic layer (auth, validation, transformations)
├── repository/         # Data access layer — direct Mongoose DB queries
├── models/             # Mongoose schema/model definitions
├── middleware/         # Auth middleware (JWT verification)
├── schema/             # Joi validation schemas (used via celebrate)
├── utils/              # Helpers: DB connection, AppError class, Success response
├── views/              # Pug template (single landing page: "All systems up and running")
├── public/             # Static assets (CSS)
└── test/               # Tests organized as unit / integration / functional
```

### Layered Architecture

```
Request → Route → (celebrate validation) → (auth middleware) → Controller → Service → Repository → MongoDB
```

---

## 🔐 Authentication

- **Mechanism:** JWT (JSON Web Tokens) via `Bearer` token in the `Authorization` header
- **Flow:**
  1. `POST /api/user` — Register (password bcrypt-hashed before storage)
  2. `POST /api/user/login` — Returns a signed JWT token
  3. Protected routes use the `authenticate` middleware, which:
     - Strips `Bearer ` from the header
     - Verifies the JWT using `JWT_SECRET` env variable
     - Looks up the user in MongoDB by `_id`
     - Attaches `req.user` or returns `401 Unauthorized`

---

## 🗄️ Database Connectivity

- **Database:** MongoDB (connection URI from `process.env.MONGODB_URI`)
- **ODM:** Mongoose
- Connection is established once at startup via `connect()` in `utils/dbConnect.js`
- A `disconnect()` helper is available for test teardown

---

## 📡 API Endpoints

All routes are prefixed with `/api`.

### 👤 Users — `/api/user`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | ❌ | Register new user |
| POST | `/login` | ❌ | Login, returns JWT |
| GET | `/me` | ✅ | View own profile |
| GET | `/` | ❌ | List all users |
| PUT | `/:id` | ❌ | Update user |
| DELETE | `/:id` | ❌ | Delete user |

**User roles:** `SITE_MANAGER`, `PROCUREMENT`, `SENIOR`, `SUPPLIER`  
**Departments:** `PROCUREMENT`, `MANAGEMENT`, `ONSITE`, `OTHER`

### 🏭 Suppliers — `/api/supplier`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | ✅ | Create supplier |
| GET | `/` | ✅ | List all suppliers |
| GET | `/:supplierId` | ✅ | Get supplier by ID |
| PUT | `/:supplierId` | ✅ | Update supplier |
| DELETE | `/:supplierId` | ✅ | Delete supplier |

### 📋 Orders (legacy) — `/api/order`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | ✅ | Create order |
| GET | `/` | ✅ | List all orders |
| GET | `/:orderId` | ✅ | Get order |
| PUT | `/:orderId` | ✅ | Update order |
| DELETE | `/:orderId` | ✅ | Delete order |

### 📦 Orders (new/active) — `/api/orderNew`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | ✅ | Create order |
| GET | `/` | ❌ | List all orders |
| GET | `/single/:id` | ❌ | Get single order |
| GET | `/manager` | ✅ | Orders for logged-in manager |
| GET | `/supplier` | ✅ | Orders for logged-in supplier |
| PUT | `/:id` | ❌ | Update order |
| DELETE | `/:id` | ❌ | Delete order |

### 🚚 Delivery Advice — `/api/deliveryAdvice`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | ✅ | Create delivery advice |
| GET | `/` | ❌ | List all |
| GET | `/manager` | ✅ | Filtered by manager |
| GET | `/supplier` | ✅ | Filtered by supplier |
| PUT | `/:id` | ❌ | Update |
| DELETE | `/:id` | ❌ | Delete |

### 🛒 Products — `/api/product`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | ✅ | Create product |
| GET | `/` | ❌ | List all products |
| GET | `/supplier` | ✅ | Products for logged-in supplier |
| PUT | `/:id` | ❌ | Update product |
| DELETE | `/:id` | ❌ | Delete product |

### 💳 Payments — `/api/payment`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | ✅ | Create payment |
| GET | `/` | ❌ | List all payments |
| GET | `/manager` | ✅ | Payments by logged-in manager |
| GET | `/:id` | ❌ | Get payment by ID |
| PUT | `/:id` | ❌ | Update payment |
| DELETE | `/:id` | ❌ | Delete payment |

---

## 🗃️ Data Models (MongoDB Collections)

| Model | Key Fields |
|---|---|
| **User** | name, nic, email, mobile, department, password (hashed), role, siteName, supplier |
| **Supplier** | name, mobile, email, company, address |
| **Order** (legacy) | orderType, items[], approval, status, requiredDate, manager (ref), supplier (ref) |
| **OrderNew** | orderType, itemName, quantity, approval, status, managerID, supplierID, rejectionNote |
| **DeliveryAdvice** | orderID, deliveryItems, deliveredDate, quantity, unitPrice, total, supplierID, managerID |
| **Product** | itemName, itemBrand, image, availableQty, price, inStock, supplierID |
| **Payment** | paymentName, paymentType, paymentAmount, paymentStatus, managerID (+ timestamps) |

---

## 🌐 Frontend Consumption

The API is designed to be consumed by a **separate frontend SPA** (React/Angular/etc.):
- **CORS** is enabled globally (`app.use(cors())`), so any origin can call the API
- All API responses follow a uniform shape: `{ status: 200, data: {...}, message: "..." }`
- Errors are returned with HTTP status codes and a message string
- The frontend authenticates by storing the JWT and sending it as `Authorization: Bearer <token>` on protected routes
- The landing page (`GET /`) just serves a Pug "health-check" page ("All systems up and running")

---

## ⚠️ Notable Observations

1. **Inconsistent auth coverage** — Some mutating routes (PUT/DELETE on orders, products, payments) don't require auth, which could be intentional for rapid development but is a security gap.
2. **Two Order models** — `Order` (legacy, with ObjectId refs to Supplier/User) and `OrderNew` (flat string IDs) — suggesting the system was partially refactored.
3. **No token expiry** — JWT tokens are signed without an `expiresIn` option, meaning they never expire.
4. **Request body size** — Allows up to 50MB (likely for base64 product images).
5. **Tests** are organized into `unit/`, `intergration/` (sic), and `functional/` directories.
