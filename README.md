# Task Management Application (Server)

## Live Link
[Task Management API](https://task-management-server-production-c1e0.up.railway.app/)

## Description
This is the backend server for the Task Management Application, built using **Express.js** and **MongoDB**. It handles user authentication, task management, and real-time updates. The server ensures persistence and instant synchronization of tasks with **WebSockets** and **MongoDB Change Streams**.

## Features
- **Task Management**:
  - Add, edit, delete, and reorder tasks.
  - Categorization: **To-Do, In Progress, Done**.
  - Drag-and-drop support.
- **Database & Persistence**:
  - MongoDB for storing tasks.
  - Real-time updates with WebSockets & MongoDB Change Streams.
- **REST API Endpoints**:
  - `POST /tasks` – Add a new task.
  - `GET /tasks` – Retrieve all tasks for the logged-in user.
  - `PUT /tasks/:id` – Update a task (title, description, category).
  - `DELETE /tasks/:id` – Delete a task.

## Technologies Used
- **Backend**: Node.js, Express.js, MongoDB
- **Database**: MongoDB
- **Real-time Updates**: WebSockets, MongoDB Change Streams
- **Deployment**: Railway

## Installation Steps
### Clone the repository
```sh
git clone https://github.com/rudraprotapchakraborty/task-management-server.git
cd task-management-server
```

### Install dependencies
```sh
npm install
```

### Create an `.env` file and add your environment variables
```sh
PORT=5000
DB_USER=YOUR_USER
DB_PASS=YOUR_PASS
```

### Run the server
```sh
npm start
```

## License
This project is licensed under the MIT License.