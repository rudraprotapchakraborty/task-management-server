# Task Management Application (Server-Side)

## 📌 Short Description
This is the **backend** of the Task Management Application, built using **Node.js, Express.js, MongoDB, and Socket.IO** to provide real-time updates for task management.

## 🔗 Live Links
- **Live Demo:** [Task Management App](https://task-management-server-production-c1e0.up.railway.app/)
- **Frontend Repository:** [GitHub](https://github.com/rudraprotapchakraborty/task-management-client)

## 📦 Dependencies
The project requires the following dependencies:

- **express** - Backend framework for handling API requests.
- **dotenv** - Loads environment variables.
- **cors** - Handles cross-origin requests.
- **mongodb** - MongoDB client for database operations.
- **socket.io** - Enables real-time communication.

## 🚀 Installation Steps

1. **Clone the repository**
   ```sh
   git clone https://github.com/rudraprotapchakraborty/task-management-server.git
   cd task-management-server
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env` file in the root directory and add:
     ```env
     PORT=5000
     DB_USER=your-mongodb-username
     DB_PASS=your-mongodb-password
     ```

4. **Run the server**
   ```sh
   nodemon index.js
   ```

## 🛠️ Technologies Used

- **Node.js** - JavaScript runtime for backend operations.
- **Express.js** - Framework for building RESTful APIs.
- **MongoDB** - NoSQL database for task storage.
- **Socket.IO** - Enables real-time updates.
- **CORS** - Manages cross-origin requests.
- **Dotenv** - Manages environment variables.

Feel free to contribute, raise issues, or suggest improvements! 🚀