# 💬 Real-Time Chat Application (MERN + Socket.IO)

A real-time chat app built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) and **Socket.IO** for real-time messaging. It supports both **one-to-one** and **group chats** with JWT-based authentication.

---

## 🚀 Features

- User Authentication (JWT)
- Create private or group chats
- Real-time messaging with Socket.IO
- Search & add users to chat
- Responsive UI with React & Bootstrap
- RESTful APIs using Express and MongoDB

---

## 🛠 Tech Stack

**Frontend:**
- React.js
- Axios
- React Router
- Bootstrap 

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Socket.IO for real-time communication

---

## 📁 Project Structure
/client # React frontend
/server # Express backend
/server/routes # API Routes
/server/controllers # Logic Handlers
/server/models # Mongoose Schemas
/server/config # DB & auth setup


---

## ⚙️ Installation

### 1. Clone the Repository

bash
git clone https://github.com/your-username/mern-chat-app.git
cd mern-chat-app

cd server
npm install

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

npm start


cd ../client
npm install

npm run dev




