# Sweet Shop Management System

A full-stack **Sweet Shop Management System** developed as part of the **AI Kata Assessment**.  
This project demonstrates backend API development, frontend integration, authentication, authorization, inventory management, and **Test-Driven Development (TDD)** using modern web technologies.

---

## 🎯 Project Objective

The objective of this project is to design, implement, and test a complete Sweet Shop Management System that:

- Allows users to register, log in, view sweets, and purchase sweets
- Allows admin users to add, update, restock, and delete sweets
- Maintains accurate inventory control
- Uses JWT-based authentication
- Follows clean coding practices
- Follows Test-Driven Development (TDD)
- Transparently documents AI usage as required by the AI Kata guidelines

---

## 🛠️ Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Jest (for testing)

### Frontend
- React
- React Router
- Context API
- Tailwind CSS
- Fetch API

### Development Practices
- RESTful API architecture
- Test-Driven Development (TDD)
- Role-based Authorization
- Git version control
- Clean and modular code structure

---

## 🔐 Authentication & Authorization

- Users can register and log in
- Authentication is handled using JWT
- Secure routes using middleware
- Role-based authorization:
  - **Admin**
    - Add sweets
    - Update sweets
    - Delete sweets
    - Restock sweets
  - **User**
    - View sweets
    - Purchase sweets
- Protected frontend routes ensure unauthorized users cannot access restricted pages

---

## 🍬 Application Features

### User Features
- User registration and login
- View all available sweets
- Purchase sweets
- Purchase button automatically disabled when stock is zero

### Admin Features
- Add new sweets
- Update sweet price and quantity
- Delete sweets
- Restock sweets
- Admin-only UI components (role-based rendering)

### Inventory Management
Each sweet includes:
- Unique ID
- Name
- Category
- Price
- Quantity

Inventory rules:
- Quantity decreases when a sweet is purchased
- Quantity increases when restocked
- Quantity is never allowed to become negative

---

## 📡 API Endpoints

### Authentication APIs
| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user and return JWT |

### Sweet Management APIs (Protected)
| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/api/sweets` | Add a new sweet (Admin only) |
| GET | `/api/sweets` | Fetch all sweets |
| GET | `/api/sweets/search` | Search sweets by name or category |
| PUT | `/api/sweets/:id` | Update sweet (Admin only) |
| DELETE | `/api/sweets/:id` | Delete sweet (Admin only) |

### Inventory APIs
| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/api/sweets/:id/purchase` | Purchase a sweet |
| POST | `/api/sweets/:id/restock` | Restock a sweet (Admin only) |

---

## 🧪 Test-Driven Development (TDD)

- Backend development follows Red → Green → Refactor
- Unit tests are written before implementing logic
- Jest is used for backend testing
- Test coverage includes:
  - Authentication logic
  - Sweet CRUD operations
  - Inventory purchase logic
  - Inventory restocking logic
- Tests ensure correctness, stability, and maintainability

---
🤖 My AI Usage
🔧 AI Tools Used

ChatGPT (OpenAI)

🧠 How I Used AI

I used ChatGPT as a learning and productivity assistant throughout the development process:

To understand complex backend concepts such as JWT authentication, middleware, and role-based authorization.

To design REST API endpoints according to the project specification.

To learn and correctly apply Test-Driven Development (TDD) step by step, including writing meaningful test cases using Jest and Supertest.

To debug errors such as CORS issues, ESLint errors, and library version mismatches (e.g., jwt-decode changes).

To structure frontend architecture, including React Context, protected routes, and service layers.

To refactor UI using Tailwind CSS without changing any business logic.

To improve code readability and maintain clean Git commit history.

## 🚀 How to Run the Project Locally

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/subrata-bauri/sweet-shop-management-system/
cd Sweet-Shop-Management-System

---

### 2️⃣ Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs on:
http://localhost:5000
----

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm start
---
Frontend runs on:
http://localhost:3000

---
### 🔑 Environment Variables
Create a .env file in the backend directory:

MONGO_URI=mongodb://127.0.0.1:27017/sweetshop
MONGO_URI_TEST=mongodb://127.0.0.1:27017/sweetshop_test
JWT_SECRET=your_secret_key
PORT=5000

## My AI Usage

I used AI tools (ChatGPT) during the development of this project
to assist with:

- Designing REST API endpoints
- Writing unit tests following TDD
- Debugging authentication and role-based authorization
- Refactoring frontend components
- Improving UI with Tailwind CSS

AI helped accelerate development and improve code quality,
but all logic, validation, and final decisions were reviewed
and implemented by me to ensure correctness and originality.
