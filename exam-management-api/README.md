# Exam Management API

## Project Description

Exam Management API is a simple backend application built using **Node.js**, **Express.js**, and **SQLite**.
This API allows users to manage **students, exams, and results** through RESTful endpoints.

The system stores data in an SQLite database and provides endpoints to create, retrieve, and delete records.

# Technologies Used

* Node.js
* Express.js
* SQLite
* CORS
* JSON


# Project Structure

```
exam-management-api
│
├── server.js
├── seed.js
├── package.json
├── package-lock.json
└── exam_database.db
```

### File Description

**server.js**
Main backend server file. It contains API routes and database connection.

**seed.js**
Used to insert sample data into the database for testing.

**package.json**
Contains project information and dependencies.

**exam_database.db**
SQLite database file that stores students, exams, and results.



# Database Structure

## Students Table

| Column | Type    | Description   |
| ------ | ------- | ------------- |
| id     | INTEGER | Primary Key   |
| name   | TEXT    | Student Name  |
| email  | TEXT    | Student Email |

---

## Exams Table

| Column     | Type    | Description |
| ---------- | ------- | ----------- |
| id         | INTEGER | Primary Key |
| title      | TEXT    | Exam Title  |
| totalMarks | INTEGER | Total Marks |

---

## Results Table

| Column        | Type    | Description    |
| ------------- | ------- | -------------- |
| id            | INTEGER | Primary Key    |
| studentName   | TEXT    | Student Name   |
| examName      | TEXT    | Exam Name      |
| obtainedMarks | INTEGER | Marks Obtained |

---

# API Endpoints

## Students

### Get all students

GET /students

### Add a student

POST /students

Example request body:

```
{
"name": "Ali",
"email": "ali@example.com"
}
```

### Delete a student

DELETE /students/:id

---

## Exams

### Get all exams

GET /exams

### Add exam

POST /exams

Example request body:

```
{
"title": "Physics Midterm",
"totalMarks": 50
}
```

---

## Results

### Get all results

GET /results

### Add result

POST /results

Example request body:

```
{
"studentName": "Ali",
"examName": "Physics",
"obtainedMarks": 40
}
```

---

# Installation Guide

## Step 1

Install Node.js from:
https://nodejs.org

---

## Step 2

Download or clone the project.

```
git clone <repository link>
```

---

## Step 3

Open project folder in terminal.

```
cd exam-management-api
```

---

## Step 4

Install dependencies.

```
npm install
```

---

## Step 5

Run the server.

```
node server.js
```

---

# Server URL

```
http://localhost:3000
```

---

# Example API Requests

### Get Students

```
http://localhost:3000/students
```

### Get Exams

```
http://localhost:3000/exams
```

### Get Results

```
http://localhost:3000/results
```

---

# Features

* Add students
* Create exams
* Record results
* Fetch data using REST APIs
* SQLite database storage

<img width="1617" height="1000" alt="s1" src="https://github.com/user-attachments/assets/1d5af64d-da21-427a-830b-be5d04346d13" />

<img width="1596" height="996" alt="s2" src="https://github.com/user-attachments/assets/525a95fa-8500-4a74-82e1-8d90ea24600b" />
<img width="1600" height="997" alt="s4" src="https://github.com/user-attachments/assets/c6231e07-a6eb-4e8c-b964-30d0706008ee" />

<img width="1603" height="1001" alt="s5" src="https://github.com/user-attachments/assets/26c413b7-0264-4645-939e-ddb977db4e38" />
<img width="1598" height="997" alt="s6" src="https://github.com/user-attachments/assets/7ef6e249-f6b0-4e6a-aa57-ca124ca71ce1" />
<img width="1615" height="997" alt="s7" src="https://github.com/user-attachments/assets/e8e9516a-4fb5-4132-8b53-c532aad13da6" />
