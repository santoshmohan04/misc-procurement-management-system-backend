# Codebase Overview — Procurement Management System Backend

## 📦 Repository Overview

**Name:** `misc-procurement-management-system-backend`  
**Purpose:** A REST API backend for a **Procurement Management System** — managing suppliers, purchase orders, deliveries, delivery advice notes, products, and payments.

---

## 🛠️ Key Technologies

| Technology                    | Purpose                                                                  |
| ----------------------------- | ------------------------------------------------------------------------ |
| **Node.js + Express.js**      | HTTP server & routing framework                                          |
| **MongoDB + Mongoose**        | Database & ODM (Object Document Mapper)                                  |
| **bcrypt**                    | Password hashing                                                         |
| **jsonwebtoken (JWT)**        | Authentication tokens                                                    |
| **celebrate + Joi**           | Request validation (schema enforcement)                                  |
| **dotenv**                    | Environment variable management                                          |
| **pug**                       | Server-side HTML templating (minimal — just a health-check landing page) |
| **ESLint + Prettier + Husky** | Code quality & pre-commit hooks                                          |
| **Jest + Supertest + Babel**  | Testing framework                                                        |

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
  2. `POST /api/user/login` — Returns a signed JWT token (expires in **1 hour**)
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

| Method | Path     | Auth | Roles                             | Description        |
| ------ | -------- | ---- | --------------------------------- | ------------------ |
| POST   | `/`      | ❌   | —                                 | Register new user  |
| POST   | `/login` | ❌   | —                                 | Login, returns JWT |
| GET    | `/me`    | ✅   | any                               | View own profile   |
| GET    | `/`      | ✅   | SITE_MANAGER, SENIOR, PROCUREMENT | List all users     |
| PUT    | `/:id`   | ✅   | any                               | Update user        |
| DELETE | `/:id`   | ✅   | SITE_MANAGER, SENIOR              | Delete user        |

**User roles:** `SITE_MANAGER`, `PROCUREMENT`, `SENIOR`, `SUPPLIER`  
**Departments:** `PROCUREMENT`, `MANAGEMENT`, `ONSITE`, `OTHER`

### 🏭 Suppliers — `/api/supplier`

| Method | Path           | Auth | Roles | Description        |
| ------ | -------------- | ---- | ----- | ------------------ |
| POST   | `/`            | ✅   | any   | Create supplier    |
| GET    | `/`            | ✅   | any   | List all suppliers |
| GET    | `/:supplierId` | ✅   | any   | Get supplier by ID |
| PUT    | `/:supplierId` | ✅   | any   | Update supplier    |
| DELETE | `/:supplierId` | ✅   | any   | Delete supplier    |

### 📋 Orders (legacy) — `/api/order`

| Method | Path        | Auth | Roles | Description     |
| ------ | ----------- | ---- | ----- | --------------- |
| POST   | `/`         | ✅   | any   | Create order    |
| GET    | `/`         | ✅   | any   | List all orders |
| GET    | `/:orderId` | ✅   | any   | Get order       |
| PUT    | `/:orderId` | ✅   | any   | Update order    |
| DELETE | `/:orderId` | ✅   | any   | Delete order    |

### 📦 Orders (new/active) — `/api/orderNew`

| Method | Path          | Auth | Roles                                       | Description                   |
| ------ | ------------- | ---- | ------------------------------------------- | ----------------------------- |
| POST   | `/`           | ✅   | any                                         | Create order                  |
| GET    | `/`           | ✅   | SITE_MANAGER, SENIOR, PROCUREMENT           | List all orders               |
| GET    | `/single/:id` | ✅   | any                                         | Get single order              |
| GET    | `/manager`    | ✅   | any                                         | Orders for logged-in manager  |
| GET    | `/supplier`   | ✅   | any                                         | Orders for logged-in supplier |
| PUT    | `/:id`        | ✅   | SITE_MANAGER, SENIOR, PROCUREMENT, SUPPLIER | Update order                  |
| DELETE | `/:id`        | ✅   | SITE_MANAGER, SENIOR, PROCUREMENT           | Delete order                  |

### 🚚 Delivery Advice — `/api/deliveryAdvice`

| Method | Path        | Auth | Roles                                       | Description            |
| ------ | ----------- | ---- | ------------------------------------------- | ---------------------- |
| POST   | `/`         | ✅   | any                                         | Create delivery advice |
| GET    | `/`         | ✅   | SITE_MANAGER, SENIOR, PROCUREMENT, SUPPLIER | List all               |
| GET    | `/manager`  | ✅   | any                                         | Filtered by manager    |
| GET    | `/supplier` | ✅   | any                                         | Filtered by supplier   |
| PUT    | `/:id`      | ✅   | SITE_MANAGER, SENIOR, PROCUREMENT, SUPPLIER | Update                 |
| DELETE | `/:id`      | ✅   | SITE_MANAGER, SENIOR, PROCUREMENT           | Delete                 |

### 🛒 Products — `/api/product`

| Method | Path        | Auth | Roles                                       | Description                     |
| ------ | ----------- | ---- | ------------------------------------------- | ------------------------------- |
| POST   | `/`         | ✅   | any                                         | Create product                  |
| GET    | `/`         | ✅   | any                                         | List all products               |
| GET    | `/supplier` | ✅   | any                                         | Products for logged-in supplier |
| PUT    | `/:id`      | ✅   | SITE_MANAGER, SENIOR, PROCUREMENT, SUPPLIER | Update product                  |
| DELETE | `/:id`      | ✅   | SITE_MANAGER, SENIOR, PROCUREMENT, SUPPLIER | Delete product                  |

### 💳 Payments — `/api/payment`

| Method | Path       | Auth | Roles                             | Description                   |
| ------ | ---------- | ---- | --------------------------------- | ----------------------------- |
| POST   | `/`        | ✅   | any                               | Create payment                |
| GET    | `/`        | ✅   | SITE_MANAGER, SENIOR, PROCUREMENT | List all payments             |
| GET    | `/manager` | ✅   | any                               | Payments by logged-in manager |
| GET    | `/:id`     | ✅   | SITE_MANAGER, SENIOR, PROCUREMENT | Get payment by ID             |
| PUT    | `/:id`     | ✅   | SITE_MANAGER, SENIOR, PROCUREMENT | Update payment                |
| DELETE | `/:id`     | ✅   | SITE_MANAGER, SENIOR, PROCUREMENT | Delete payment                |

---

## 🗃️ Data Models (MongoDB Collections)

| Model              | Key Fields                                                                                                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **User**           | name, nic, email, mobile, department, password (hashed), role, siteName, supplier                                                                                             |
| **Supplier**       | name, mobile, email, company, address                                                                                                                                         |
| **Order**          | orderType, description, items[], approval, status, requiredDate, deliveryAddress, deliveredDate, rejectionNote, isReceiptPrinted, manager (ref User), supplier (ref Supplier) |
| **DeliveryAdvice** | orderID, deliveryItems, deliveredDate, quantity, description, unitPrice, total, supplierID, managerID                                                                         |
| **Product**        | itemName, title, itemBrand, image, description, measuringUnit, availableQty, price, inStock, supplierID                                                                       |
| **Payment**        | paymentName, paymentType, paymentAmount, paymentStatus, managerID (+ timestamps)                                                                                              |

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

1. **Consistent auth coverage** — All routes require authentication (`authenticate` middleware). Many mutating and sensitive read routes also enforce role-based access via `authorizeRoles`.
2. **Single Order model** — The separate `OrderNew` model has been removed. The `/api/orderNew` routes now use the normalized `Order` model (ObjectId refs for `manager` and `supplier`), matching the legacy `/api/order` routes. The "OrderNew" route prefix is retained for backward compatibility.
3. **JWT token expiry** — Tokens are signed with `expiresIn: "1h"` and require re-authentication after expiry.
4. **Request body size** — Allows up to 50MB (likely for base64 product images).
5. **Tests** are organized into `unit/`, `intergration/` (sic), and `functional/` directories.
