const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const roomRoutes = require("./routes/roomRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoute");
const { verifyToken } = require("./middleware/verifyToken");
require("dotenv").config();

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();

const cors = require("cors");

// Enable CORS for all routes
const corsOptions = {
  credentials: true,
  origin: "*", // Whitelist the domains you want to allow
};

app.use(cors(corsOptions));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

const PORT = process.env.PORT || 5000;
const dbConnect = require("./config/db");
colors = require("colors");

colors.setTheme({
  warn: "yellow",
  debug: "blue",
  error: "red",
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database setup
(async () => {
  await dbConnect();
})();
httpServer.listen(PORT, () => {
  console.log(`Server is running on port - ${PORT}`.warn);
});

app.get("/", (req, res, next) => {
  res.status(200).json("Successfully connected to server");
});

// api routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", verifyToken, chatRoutes);
app.use("/api/users", verifyToken, userRoutes);
app.use("/api/rooms", verifyToken, roomRoutes);
app.use("/api/messages", verifyToken, messageRoutes);

// error handler
app.use((err, req, res, next) => {
  console.log("error".error, err);
  if (res.headersSent) {
    return next(err);
  }
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Internal Server Error!" });
});

/* Socket.io handling */

// Store connected users
const connectedUsers = {};
const roomUsers = {};

io.on("connection", (socket) => {
  // Event handler for the "userConnected" event
  socket.on("userConnected", (userId) => {
    connectedUsers[socket.id] = userId; // Store the user in the connectedUsers object
    // Emit Online Users
    io.emit("connectedUsers", Object.values(connectedUsers));
  });

  // listen for room chat
  socket.on("roomChat", ({ membersIds, roomId, userId }) => {
    socket.join(roomId); // join room
    membersIds?.map((member) => {
      for (const [socketId, userId] of Object.entries(connectedUsers)) {
        if (member.id === userId) {
          io.to(socketId).emit("roomChat");
        }
      }
    });
    io.to(roomId).emit("roomChat");
  });
  // listen for room chat message
  socket.on("roomMessage", ({ roomId, senderId, text }) => {
    const details = {
      senderId,
      text,
    };
    io.to(roomId).emit("roomMessage", details); // emit message
  });
  // listen for room chat message
  socket.on("roomRemove", ({ roomId, senderId }) => {
    const details = {
      roomId,
      senderId,
    };
    io.to(roomId).emit("roomRemove", details); // emit message
  });

  // listen for one to one chat message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    for (const [socketId, userId] of Object.entries(connectedUsers)) {
      if (userId == receiverId) {
        const details = {
          senderId,
          text,
        };
        socket.to(socketId).emit("sendMessage", details); // emit message // One Account can have Multiple Socket Connection
      }
    }
  });

  // Disconnect event
  socket.on("disconnect", () => {
    // Remove the user from the connectedUsers object
    delete connectedUsers[socket.id];
    delete roomUsers[socket.id];
    io.emit("connectedUsers", Object.values(connectedUsers));
  });
});

// url
// https://chat-app-frontend-eight-xi.vercel.app/login

// https://chat-app-u3hn.onrender.com/
