# 💸 Digital Wallet API

A secure and role-based digital wallet backend system inspired by mobile wallet platforms like **bKash** or **Nagad**. Built with **Express.js**, **TypeScript**, and **MongoDB**, the system supports three distinct user roles: **Admin**, **User**, and **Agent**.

---

## 🎯 Project Overview

This API enables users to register, manage wallets, and perform financial transactions like adding money, withdrawing, and sending funds. It emphasizes security, modularity, and real-world transactional consistency.

---

## 🔑 Roles & Capabilities

| Role      | Capabilities                                                                                                                      |
| --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **User**  | Add money, withdraw, send money, view transaction history                                                                         |
| **Agent** | Cash-in, cash-out for users, view commission history                                                                              |
| **Admin** | View all users/agents/wallets/transactions, block/unblock wallets, approve/suspend agents, configure system parameters (optional) |

---

## ✅ Features

- 🔐 JWT Authentication with password hashing
- 🎭 Role-based Authorization Middleware
- 🏦 Wallet auto-creation during registration
- 🔁 Fully trackable Transaction System
- 💸 Cash-in/Cash-out support via Agents
- 🧱 Modular Project Structure
- 🧪 Postman-tested API Endpoints
- 📄 Clean and professional README
- 🎥 Video walkthrough (submission requirement)

---

## 📦 Project Structure

src/
├── modules/
│ ├── auth/ # Register, Login, Role management
│ ├── user/ # User schema, user-only logic
│ ├── agent/ # Agent-specific logic
│ ├── admin/ # Admin operations
│ ├── wallet/ # Wallet creation & operations
│ └── transaction/ # Transaction records & validation
├── middlewares/ # Auth, Error, Validation, RBAC
├── config/ # DB, app configs
├── utils/ # QueryBuilder, helper functions
├── constants/ # Enum and static values
├── app.ts # Express app setup
└── server.ts # App entry point

API Endpoints Summary

POST /auth/register
GET /api/v1/user/all-users
POST /auth/login
GET /wallets/me User
POST /wallets/deposit
POST /wallets/withdraw
POST /wallets/send
GET /transactions/me
POST /cash-in
POST /cash-out
GET /admin/users
PATCH /admin/wallets/block/:id
PATCH /admin/agents/:id/status

More detailed routes are documented in the Postman collection.

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-username/digital-wallet-api.git
cd digital-wallet-api

npm install
--
## Configure .env
### 1. Clone the repo
env
Copy

PORT=5000
DATABASE_URL=mongodb://localhost:27017/digital-wallet
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

Video Link : https://www.youtube.com/watch?v=vPa81Vvryr4

Github Link:  https://github.com/azir9200/digital-wallet
Deploy Link:


```
