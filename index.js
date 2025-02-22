const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y7jbt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");

        const db = client.db("taskManager");
        const tasksCollection = db.collection("tasks");
        const usersCollection = db.collection("users");

        // WebSocket Setup
        const server = http.createServer(app);
        const io = new Server(server, { cors: { origin: "*" } });

        io.on("connection", (socket) => {
            console.log("User connected:", socket.id);

            socket.on("updateTasks", async () => {
                const tasks = await tasksCollection.find({}).toArray();
                io.emit("tasksUpdated", tasks);
            });

            socket.on("disconnect", () => console.log("User disconnected"));
        });

        // Register or Fetch User
        app.post("/users", async (req, res) => {
            try {
                const { uid, email, displayName, photoURL } = req.body;
                if (!uid || !email) return res.status(400).json({ message: "Missing user details" });

                const existingUser = await usersCollection.findOne({ uid });

                if (!existingUser) {
                    const newUser = { uid, email, displayName, photoURL, createdAt: new Date() };
                    await usersCollection.insertOne(newUser);
                    return res.status(201).json({ message: "User registered", user: newUser });
                }

                res.json({ message: "User already exists", user: existingUser });
            } catch (error) {
                res.status(500).json({ message: "Error registering user", error });
            }
        });

        // Fetch all tasks
        app.get("/tasks", async (req, res) => {
            const tasks = await tasksCollection.find({}).toArray();
            res.json(tasks);
        });

        // Add a new task
        app.post("/tasks", async (req, res) => {
            try {
                const { title, description, category } = req.body;
                if (!title || title.length > 50) return res.status(400).json({ message: "Title is required (max 50 chars)" });
                if (description && description.length > 200) return res.status(400).json({ message: "Description too long (max 200 chars)" });

                const newTask = {
                    title,
                    description: description || "",
                    category: category || "To-Do",
                    timestamp: new Date(),
                    position: Date.now(),
                };

                await tasksCollection.insertOne(newTask);
                io.emit("updateTasks");
                res.status(201).json({ message: "Task added successfully", task: newTask });
            } catch (error) {
                res.status(500).json({ message: "Error adding task", error });
            }
        });

        // Update task
        app.put("/tasks/:id", async (req, res) => {
            try {
                const { id } = req.params;
                if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid task ID" });
        
                // Remove `_id` if it exists in the request body
                const { _id, ...updateData } = req.body;
        
                const result = await tasksCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updateData }
                );
        
                if (result.modifiedCount === 0) {
                    return res.status(404).json({ message: "Task not found or no changes made" });
                }
        
                io.emit("updateTasks");
                res.json({ message: "Task updated successfully" });
            } catch (error) {
                console.error("Server error updating task:", error);
                res.status(500).json({ message: "Server error updating task", error });
            }
        });
        
        

        // Delete a task
        app.delete("/tasks/:id", async (req, res) => {
            try {
                const { id } = req.params;
                if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid task ID" });
        
                const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });
        
                if (result.deletedCount === 0) return res.status(404).json({ message: "Task not found" });
        
                io.emit("updateTasks");
                res.json({ message: "Task deleted successfully" });
            } catch (error) {
                console.error("Error deleting task:", error);
                res.status(500).json({ message: "Server error deleting task", error });
            }
        });
        

        // Reorder tasks
        app.put("/tasks/reorder", async (req, res) => {
            try {
                const { updatedTasks } = req.body;
                const bulkOperations = updatedTasks.map(task => ({
                    updateOne: {
                        filter: { _id: new ObjectId(task._id) },
                        update: { $set: { position: task.position, category: task.category } },
                    }
                }));

                await tasksCollection.bulkWrite(bulkOperations);
                io.emit("updateTasks");
                res.json({ message: "Tasks reordered successfully" });
            } catch (error) {
                res.status(500).json({ message: "Error reordering tasks", error });
            }
        });

        //Server Running
        server.listen(port, () => console.log(`Server running on port ${port}`));
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectDB();
