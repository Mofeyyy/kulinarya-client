# Kulinarya 🍲  
**Your Digital Guide for Filipino Gastronomy and Dishes**

Kulinarya is a full-stack web application created as a capstone project by two BSIT students from Colegio de San Gabriel Arcangel. The platform allows users to browse, post, and interact with Filipino recipes from different provinces in the Philippines.  

This project was built using the **MERN stack** (MongoDB, Express.js, React, Node.js) with secure authentication, media uploading, and role-based access.

> 🔒 This repository highlights my main role in the backend and partial frontend integration.

---

## 📌 Features

- 👨‍🍳 **User Roles**: Admin, Content Creator, Normal User, Guest  
- 🍽️ **Recipe Posting**: Includes images, videos, ingredients, and procedures  
- 🔐 **Authentication**: JWT-based login/registration with bcrypt password hashing  
- 📧 **Email Verification & Reset**: Using Nodemailer  
- ☁️ **Media Upload**: Images and videos stored via Supabase  
- 🔍 **Search and Filter**: By title, category, or province  
- 💬 **User Interaction**: Reactions (❤️ 🤤 😐), Comments  
- 🛠️ **Content Moderation**: Admin/creator can approve or reject recipe posts  
- 📊 **Dashboard**: Analytics for visits, engagements, and recipe activity  
- 🔔 **Notifications**: For reactions, comments, and announcements (coming soon)

---

## 🛠️ Tech Stack

### Frontend
- React.js
- TailwindCSS
- React Router
- Axios
- Zustand
- Framer Motion
- ShadCN UI + ManTime UI

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Zod (Validation)
- JWT (Auth)
- Bcrypt (Password Hashing)
- Nodemailer (Emails)
- Day.js (Date handling)
- Supabase (Cloud Storage)

---

## 🧩 My Role

I focused on **backend development** and helped in integrating key APIs into the frontend. My main responsibilities included:

- Creating secure REST APIs using Express and MongoDB
- Implementing authentication using JWT and bcrypt
- Integrating media uploads via Supabase
- Handling email features using Nodemailer
- Validating data using Zod
- Testing API routes with Postman
- Collaborating via GitHub and syncing API responses with frontend components

> My teammate handled the frontend UI and some backend logic as well.

---

## 🚀 Getting Started (for developers)

### Prerequisites
- Node.js
- MongoDB (local or Atlas)
- Supabase account
- Email provider (e.g., Gmail for Nodemailer)

🌐 Live Demo
👉 https://kulinarya-client.vercel.app/


### Backend Setup / Frontend Setup
```bash
cd backend
npm install
npm run dev

Frontend

cd client
npm install
npm run dev



