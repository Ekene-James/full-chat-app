const express = require("express");
const app = express();
const dotenv = require("dotenv");
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    //  origin: "http://localhost:3000",
    origin: "*",
  },
});

const crypto = require("crypto");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const colors = require("colors");

//bring in the router files
const auth = require("./routes/auth");
const chats = require("./routes/chats");
const chatStructure = require("./routes/chatStructure");

// const admin = require("./routes/admin");

const errorHandler = require("./middleware/error");

dotenv.config({ path: ".env" });

//body parser
app.use(express.json());
app.use(fileupload());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(cors());
const limit = rateLimit({
  windowMs: 10 * 60 * 1000, //10mins
  max: 100,
});
app.use(limit);
//set static folder
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//connect to db
const db = process.env.MONGO_URI;
// console.log(db);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((connections) => {
    console.log(`mongodb connected `.cyan.underline.bold);
  })
  .catch((err) => console.log(`${err.message}`.red.bold));

// socket helper functions
let users = [];

const addUser = (userDetails, socketId) => {
  !users.some((user) => user.id === userDetails.id) &&
    users.push({ ...userDetails, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.id === userId);
};

//setup socket connection
io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (user) => {
    addUser(user, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", (msg) => {
    const user = getUser(msg.receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", msg);
    }
  });
  //delete message
  socket.on("deleteMessage", (msg) => {
    const user = getUser(msg.receiverId);
    if (user) {
      io.to(user.socketId).emit("getDeleteMessage", msg);
    }
  });

  socket.on("stop_typing", (msg) => {
    const user = getUser(msg.sendTo);
    if (user) {
      io.to(user.socketId).emit("stop_is_typing", msg);
    }
  });
  socket.on("typing", (msg) => {
    const user = getUser(msg.sendTo);
    if (user) {
      io.to(user.socketId).emit("is_typing", msg);
    }
  });

  socket.on("logout", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
    socket.disconnect();
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

//mount the routers

app.use("/api/auth", auth);
app.use("/api/chatStructure", chatStructure);
app.use("/api/chats", chats);

app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}
const PORT = process.env.PORT || 5000;

const server = http.listen(
  PORT,
  console.log(
    `App listening on PORT: ${PORT}! and on mode : ${process.env.NODE_ENV}`
      .yellow.bold
  )
);
process.on("unhandledRejection" || "uncaughtException", (err, promise) => {
  console.log(`error : ${err.message}`);
  server.close(() => process.exit(1));
});
