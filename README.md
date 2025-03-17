# **📌 API Server Setup Guide**

## Prerequisites

Ensure you have the following installed before proceeding:

- **Node.js** `>= 20.0.0`
- **MySQL** (Ensure MySQL service is running)

---

## Getting Started

Follow these steps to run the API server locally:

### **1️⃣ Clone the Repository**

```sh
git clone <repository-url>
cd <repository-folder>
```

### **2️⃣ Set Up Environment Variables**

- Copy the example environment file:
  ```sh
  cp .env.example .env
  ```
- Edit the `.env` file with your database credentials and configurations.

### **3️⃣ Install Dependencies**

```sh
npm install
```

### **4️⃣ Set Up the Database**

- Ensure MySQL is running.
- Run the database migration and seed data:
  ```sh
  npm run seed
  ```

### **5️⃣ Run Test Coverage**

```sh
npm run test:coverage
```

### **6️⃣ Start the Server**

```sh
npm start
```

The server should now be running.

---

## Available Scripts

| Command                 | Description                               |
| ----------------------- | ----------------------------------------- |
| `npm install`           | Installs all dependencies                 |
| `npm start`             | Starts the API server                     |
| `npm run dev`           | Starts the API server in development mode |
| `npm run seed`          | Seeds the database with initial data      |
| `npm run test`          | Runs the test suite                       |
| `npm run test:coverage` | Runs tests with coverage report           |
| `npm run lint`          | Runs ESLint to check code quality         |
| `npm run lint:fix`      | Runs ESLint to fix the code quality       |
| `npm run format`        | Formats code using Prettier               |

---
