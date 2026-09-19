# Blog REST API with CRUD Operations

## 1. Project Overview

This project is a simple Blog REST API developed as a Web Development Minor Project.

The API allows users to create, read, update and delete blog posts using REST API principles.

The backend is developed using Node.js and Express.js. Blog data is stored in a JSON file instead of using an external database.

A simple HTML, CSS and JavaScript frontend is included to demonstrate the API.

---

## 2. Features

- Create a blog post
- Get all blog posts
- Get a single blog post
- Update a blog post
- Delete a blog post
- Basic input validation
- Error handling
- JSON responses
- HTTP status codes
- JSON file data storage
- Simple frontend interface
- Postman API testing support

---

## 3. Technologies Used

### Backend

- Node.js
- Express.js

### Storage

- JSON file

### Frontend

- HTML
- CSS
- Vanilla JavaScript

### Testing

- Postman

---

## 4. Project Structure

```text
blog-rest-api/
│
├── controllers/
│   └── postController.js
│
├── routes/
│   └── postRoutes.js
│
├── middleware/
│   └── errorMiddleware.js
│
├── data/
│   └── posts.json
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── app.js
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md