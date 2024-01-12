const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
const dbConnect = require("./config/db");
colors = require("colors");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const roomRoutes = require("./routes/roomRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoute");
const { verifyToken } = require("./middleware/verifyToken");

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
  app.listen(PORT, () => {
    console.log(`Server is running on port - ${PORT}`.warn);
  });
})();

// Enable CORS for all routes
app.use(cors());

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



