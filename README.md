# To-Do App

A full-stack To-Do web application with user authentication and task management.

## 🛠 Tech Stack
- Frontend: React, Material UI
- Backend: Node.js, Express.js, MongoDB Atlas
- Authentication: JWT

## 📦 Features
- Sign up and Login
- Authenticated CRUD for Tasks
- User-specific task filtering

## 📂 Project Structure
project-root/
├── backend/
│   ├── models/
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env                
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── SignUp.js
│   │   │   ├── TaskForm.js
│   │   │   └── TodoList.js
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env                 
└── README.md

## ⚙️ Setup Instructions

### Backend
```bash
cd backend
npm install
create .env file with:
  MONGO_URI=your-mongo-uri
  JWT_SECRET=your-secret
npm run dev
