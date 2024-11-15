import express from "express";
import http from "http";
import { Server } from "socket.io";
import db from "./config/Database.js";
import dotenv from "dotenv";
import cors from "cors";

import messageRoutes from "./routes/messageRoutes.js";
import Message from "./models/messageModel.js";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

try {
  await db.authenticate();
  console.log("Database connected");
  // await db.sync();
} catch (error) {
  console.log("Database connection failed: ", error);
}

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.static("public"));
app.use(messageRoutes);

const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("set_username", async (username, callback) => {
    if (activeUsers.has(username)) {
      callback({
        success: false,
        message: "This username has already been used.",
      });
    } else {
      activeUsers.set(username, socket.id);
      socket.username = username;

      const messages = await Message.findAll();
      socket.emit("load_messages", messages);

      callback({ success: true });
      console.log(`User ${username} connected.`);
    }
  });

  socket.on("get_messages", async () => {
    const messages = await Message.findAll();
    socket.emit("load_messages", messages);
  });

  socket.on("send_message", async (message) => {
    const newMessage = await Message.create(message);
    io.emit("new_message", newMessage);
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      console.log(`User ${socket.username} disconnected.`);

      setTimeout(() => {
        if (!io.sockets.sockets.get(activeUsers.get(socket.username))) {
          activeUsers.delete(socket.username);
          console.log(`User ${socket.username} removed from active users.`);
        }
      }, 5000);
    }
  });
});

httpServer.listen(5000, () => console.log("Server is running on port 5000"));
