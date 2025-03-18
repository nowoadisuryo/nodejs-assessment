# **📌 API Server Setup Guide On Windows**

## Prerequisites

Ensure you have the following installed before proceeding:

- **Node.js** `>= 20.15.1`
- **NPM** `>= 10.7.0`
- **MySQL** (Ensure MySQL service is running)

---

## Getting Started

Follow these steps to run the API server locally:

### **1. Create the Project Folder**

- Open Windows Command Prompt and create destination foler:

```sh
mkdir [your-folder-path]
```

e.g.

```sh
mkdir D:\nowo-assessment
```

### **2. Clone the Repository**

- Go to inside the folder

```sh
cd /d D:\nowo-assessment
```

- Clone the repository

```sh
git clone https://github.com/nowoadisuryo/nodejs-assessment.git
cd nodejs-assessment
```

### **3. Set Up Environment Variables**

- Create a .env file by copying .env.example:
  ```sh
  copy .env.example .env
  ```
- Open the .env file through file explorer or command prompt.
- Edit the .env file and configure the following:

  ```sh
  DB_USER=<your_mysql_username>
  DB_PASS=<your_mysql_password>
  DB_HOST=<your_mysql_host>
  DB_PORT=<your_mysql_port>
  ```

### **4. Install Dependencies**

- Run the following command in Windows Command Prompt:

```sh
npm install
```

### **5. Seed the Database**

- Ensure MySQL is running.
- Create the database manually.
- Open MySQL Workbench or any MySQL client.
- Connect to the server and then execute this query:

  ```sh
  CREATE DATABASE IF NOT EXISTS `nowo_nodejs_assessment`;
  ```

- Run the database seed data:
  ```sh
  npm run seed
  ```

### **6. Run Test Coverage**

```sh
npm run test:coverage
```

### **7. Start the Server**

```sh
npm start
```

The server should now be running.

---

## Runs the API server using Docker

## Prerequisites

Ensure you have the following installed before proceeding:

- **Docker** (Ensure Docker service is running)
- Ensure docker-compose is installed

Follow these steps to run the API server using Docker:

### **1. Set Up Environment Variables**

- Create a .env file by copying .env.example:
  ```sh
  copy .env.example .env
  ```
- Open the .env file through file explorer or command prompt.
- Edit the .env file and configure the following:

  ```sh
  DB_USER=<your_mysql_username>
  DB_PASS=<your_mysql_password>
  DB_HOST=<your_mysql_host>
  DB_PORT=<your_mysql_port>
  ```

### **2. Set Up Docker Compose**

- Create a docker-compose.yaml file by copying docker-compose.yaml.example:
  ```sh
  copy docker-compose.yaml.example docker-compose.yaml
  ```
- Open the docker-compose.yaml file through file explorer or command prompt.
- Edit the docker-compose.yaml file and configure the following:

  ```sh
  MYSQL_ROOT_PASSWORD: <your_mysql_root_password>
  MYSQL_USER: <your_mysql_username>
  MYSQL_PASSWORD: <your_mysql_password>
  ```

### **3. Build and Run the Containers**

- Open command prompt and run the following commands:
  ```sh
  docker-compose up --build -d
  ```

### **4. Stopping and Removing Containers**

- Open command prompt and run the following commands:
  ```sh
  docker-compose down
  ```

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

## Database Schema Diagram

![alt text](image.png)

## Endpoints

### **1. Register one or more students to a specified teacher.**

- Endpoint: `POST /api/register`
- Headers: `Content-Type: application/json`
- Success response status: HTTP 204
- Request body example:

```
{
  "teacher": "teacherken@gmail.com"
  "students":
    [
      "studentjon@gmail.com",
      "studenthon@gmail.com"
    ]
}
```

### **2. Retrieve a list of students common to a given list of teachers.**

- Endpoint: `GET /api/commonstudents`
- Success response status: HTTP 200
- Request example 1: `GET /api/commonstudents?teacher=teacherken%40gmail.com`
- Success response body 1:

```
{
  "students" :
    [
      "commonstudent1@gmail.com",
      "commonstudent2@gmail.com",
      "student_only_under_teacher_ken@gmail.com"
    ]
}
```

### **3. Suspend a specified student.**

- Endpoint: `POST /api/suspend`
- Headers: `Content-Type: application/json`
- Success response status: HTTP 204
- Request body example:

```
{
  "student" : "studentmary@gmail.com"
}
```

### **4. Retrieve a list of students who can receive a given notification.**

- Endpoint: `POST /api/retrievefornotifications`
- Headers: `Content-Type: application/json`
- Success response status: HTTP 200
- Request body example:

```
{
  "teacher":  "teacherken@gmail.com",
  "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
}
```

- Success response body 1:

```
{
  "recipients":
    [
      "studentbob@gmail.com",
      "studentagnes@gmail.com",
      "studentmiche@gmail.com"
    ]
}
```

---
